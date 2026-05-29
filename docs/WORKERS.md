# Workers and Indexing Flow

## Worker responsibilities

The worker layer keeps the public campaign ledger in sync with Solana and internal batch state.

Main jobs:

1. ingest treasury wallet transactions
2. normalize transfers into fee events
3. de-duplicate transaction records
4. wait for confirmations/finality
5. update campaign balances
6. detect batch eligibility
7. flag reconciliation mismatches

## Indexer options

### Option A — Helius webhook

Best MVP option.

Flow:

```text
Solana transaction involving treasury wallet
  → Helius webhook
  → /api/webhooks/helius
  → parse transfers
  → insert fee_events
  → update campaign balance
```

Pros:

- simple
- real-time enough
- less infra

Cons:

- dependency on third-party provider
- webhook downtime/retry handling needed

### Option B — polling worker

Flow:

```text
cron every N seconds/minutes
  → fetch active campaign treasury wallets
  → getSignaturesForAddress
  → getTransaction for unseen signatures
  → parse transfer instructions
  → insert fee_events
```

Pros:

- provider-independent
- easy to backfill

Cons:

- more RPC calls
- more indexing complexity

Recommended: start with Helius webhooks plus a slower polling backfill job.

## Pseudocode: webhook ingestion

```ts
async function handleHeliusWebhook(payload) {
  assertValidWebhookSecret();

  for (const tx of payload.transactions) {
    const transfers = extractSolAndSplTransfers(tx);

    for (const transfer of transfers) {
      const campaign = await findCampaignByTreasuryWallet(transfer.to);
      if (!campaign) continue;

      await upsertFeeEvent({
        campaignId: campaign.id,
        txHash: tx.signature,
        instructionIndex: transfer.instructionIndex,
        sourceWallet: transfer.from,
        destinationWallet: transfer.to,
        tokenMint: transfer.mint,
        tokenSymbol: transfer.symbol,
        rawAmount: transfer.rawAmount,
        decimals: transfer.decimals,
        uiAmount: transfer.uiAmount,
        slot: tx.slot,
        confirmedAt: tx.timestamp,
        status: 'confirmed'
      });

      await writeAuditLog({
        entityType: 'fee_event',
        action: 'ingested_from_helius',
        entityId: feeEvent.id
      });
    }
  }
}
```

## Pseudocode: polling backfill

```ts
async function backfillTreasuryWallets() {
  const campaigns = await getLiveCampaigns();

  for (const campaign of campaigns) {
    const signatures = await rpc.getSignaturesForAddress(campaign.treasuryWallet, {
      limit: 100
    });

    for (const sig of signatures) {
      if (await txAlreadySeen(sig.signature)) continue;

      const tx = await rpc.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      });

      await parseAndStoreFeeEvents(campaign, tx);
    }
  }
}
```

## Balance reconciliation job

Run periodically.

Checks:

- confirmed fee events total equals expected treasury inflows
- batched events are not included in multiple batches
- campaign pending balance equals confirmed fees minus batched/donated amounts
- conversion batch fiat totals match donation receipts

Pseudocode:

```ts
async function reconcileCampaign(campaignId) {
  const confirmedFees = await sumConfirmedFeeEvents(campaignId);
  const batchedFees = await sumBatchedFeeEvents(campaignId);
  const fiatReceived = await sumConvertedBatches(campaignId);
  const fiatDonated = await sumVerifiedReceipts(campaignId);

  const pendingCrypto = confirmedFees.minus(batchedFees);
  const pendingFiat = fiatReceived.minus(fiatDonated);

  if (pendingFiat.lt(0)) {
    await flagMismatch(campaignId, 'donated_more_than_received');
  }

  await updateCampaignTotals({ pendingCrypto, pendingFiat });
}
```

## Worker deployment options

For MVP:

- Vercel Cron for slow backfills/reconciliation
- Next.js API route for Helius webhook
- Supabase/Neon Postgres

For production:

- dedicated worker on Fly.io/Render/Railway
- queue system such as BullMQ/Redis or Inngest
- retry/dead-letter queue
- Sentry alerts
- dashboard for failed webhook payloads
