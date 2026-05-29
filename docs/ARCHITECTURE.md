# System Architecture

## Goal

Build a transparent charity memecoin launch layer where the fee stream controlled by the platform/creator can be routed into a public donation process.

The key challenge is not the landing page. The key challenge is proving:

```text
This on-chain fee income became this fiat donation.
```

## High-level architecture

```text
Creator / Admin Dashboard
        |
        v
Campaign API  ----------------------------+
        |                                  |
        v                                  v
Postgres DB                         Public Campaign Pages
        ^                                  |
        |                                  v
Solana Indexer Worker -------------- Proof Wall API
        ^
        |
Treasury Wallet / Fee Stream
        |
        v
Conversion Batch Admin Flow
        |
        v
Fiat Donation to GoFundMe
        |
        v
Receipt Upload + Verification
```

## Core services

### 1. Web app

Responsibilities:

- public landing page
- public campaign page
- public proof wall
- creator campaign setup
- admin review dashboard
- conversion batch dashboard
- receipt upload/review dashboard

Suggested stack:

- Next.js App Router
- React
- Postgres via Supabase/Neon
- Prisma or Drizzle ORM
- wallet auth or normal email auth for creators
- role-based admin access

### 2. Campaign API

Responsibilities:

- create campaign records
- store GoFundMe URL and fundraiser metadata
- store coin mint / Pump.fun launch details
- store treasury wallet
- store donation split basis points
- expose public proof-wall data
- enforce admin approval gates

### 3. Solana indexer

Responsibilities:

- watch campaign treasury wallets
- ingest fee deposits
- normalize SOL/SPL token transfers
- de-duplicate events by tx hash + instruction index
- confirm finality before marking events as settled
- update campaign totals

Possible implementation paths:

- Helius webhook per treasury wallet
- Helius Enhanced Transactions API polling
- direct Solana RPC `getSignaturesForAddress` polling
- later: dedicated indexer service if scale requires

### 4. Treasury layer

Options:

#### Option A — one treasury wallet per campaign

Pros:

- easiest public accounting
- each campaign has clean on-chain history
- simple campaign page verification

Cons:

- more wallets to manage
- more operational overhead

#### Option B — shared treasury with memo/campaign routing

Pros:

- easier operational management
- fewer wallets

Cons:

- harder public accounting
- needs strong internal ledger to avoid confusion

Recommendation for MVP: **one treasury wallet per campaign**.

### 5. Conversion batch flow

A conversion batch groups one or more on-chain deposits into one off-ramp event.

Example:

```text
Batch #17
- Source campaign: $MIA
- Source events: tx_1, tx_2, tx_3
- Crypto total: 12.42 SOL
- Expected fiat: A$2,913
- Actual fiat received: A$2,887
- Spread/fees: A$26
- Approved by: admin_01
- Status: ready_to_donate
```

This is the bridge between crypto and IRL donation. It must be explicit.

### 6. GoFundMe donation reconciliation

GoFundMe may not accept crypto directly, so the MVP treats GoFundMe as the fiat endpoint.

The system should track:

- target fundraiser URL
- donation amount
- donation date/time
- donor display name used
- receipt screenshot/PDF URL
- confirmation number if available
- admin who verified the receipt
- any shortfall from conversion fees or processing fees

### 7. Public proof wall

Each campaign page should show:

- campaign status
- coin metadata
- fundraiser URL
- treasury wallet address
- total on-chain fees received
- total crypto converted
- total fiat received
- total fiat donated
- pending balance
- list of fee txs
- list of conversion batches
- list of GoFundMe receipts
- unreconciled differences

## Trust model

The system cannot make users trust an invisible operator. It should reduce trust by making every step visible.

Trust assumptions that remain:

- the treasury controller can move funds
- the off-ramp operator honestly reports fiat received
- uploaded receipts are genuine
- GoFundMe campaign is legitimate

Ways to reduce trust:

- multisig treasury
- public tx history
- immutable audit logs
- receipt review
- campaign verification
- third-party attestation later
- open-source indexer/proof logic

## Recommended MVP architecture

```text
Next.js app
  /campaign/[slug]
  /admin/campaigns
  /admin/batches
  /admin/receipts

Postgres
  campaigns
  wallets
  fee_events
  conversion_batches
  batch_fee_events
  donation_receipts
  audit_logs

Worker
  ingestTreasuryWallets()
  syncFeeEvents()
  reconcileBalances()

Admin
  approveCampaign()
  createConversionBatch()
  markBatchConverted()
  attachDonationReceipt()
  publishReceipt()
```
