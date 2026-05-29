# API Design

This file outlines the first API surface. It can be implemented as Next.js route handlers.

## Public endpoints

### `GET /api/campaigns`

Returns approved/live public campaigns.

Response:

```json
{
  "campaigns": [
    {
      "id": "uuid",
      "slug": "mia-recovery",
      "name": "Help Mia's Recovery Fund",
      "coinTicker": "MIA",
      "fundraiserUrl": "https://www.gofundme.com/...",
      "treasuryWallet": "7G3k...9pQ",
      "totalFeesCrypto": "12.42",
      "totalFiatDonated": "2850.00",
      "status": "live"
    }
  ]
}
```

### `GET /api/campaigns/:slug`

Returns a public campaign page payload.

Should include:

- campaign metadata
- public treasury wallet
- donation splits
- totals
- latest fee events
- conversion batches
- verified donation receipts
- unreconciled pending balance

### `GET /api/campaigns/:slug/proof-wall`

Returns the public money trail.

Response shape:

```json
{
  "campaign": { "slug": "mia-recovery", "ticker": "MIA" },
  "totals": {
    "feesReceivedSol": "12.42",
    "fiatReceivedAud": "2913.00",
    "fiatDonatedAud": "2850.00",
    "pendingAud": "63.00"
  },
  "events": [
    {
      "type": "fee_event",
      "txHash": "abc",
      "amount": "2.18",
      "token": "SOL",
      "confirmedAt": "2026-05-29T00:00:00Z"
    },
    {
      "type": "conversion_batch",
      "batchNumber": 14,
      "cryptoAmount": "12.42",
      "fiatReceived": "2913.00",
      "status": "converted"
    },
    {
      "type": "donation_receipt",
      "donatedAmount": "2850.00",
      "receiptUrl": "https://...",
      "status": "verified"
    }
  ]
}
```

## Creator endpoints

### `POST /api/creator/campaigns`

Creates a draft campaign.

Request:

```json
{
  "name": "Help Mia's Recovery Fund",
  "coinName": "Mia Coin",
  "coinTicker": "MIA",
  "coinMint": "optional mint address",
  "pumpfunUrl": "https://pump.fun/...",
  "fundraiserUrl": "https://www.gofundme.com/...",
  "donationSplitBps": 8500,
  "growthSplitBps": 1500,
  "opsSplitBps": 0
}
```

Rules:

- splits must add to 10,000 bps
- fundraiser URL must be allowed domain
- campaign stays `pending_review` until admin approval
- treasury wallet is generated or assigned during review

### `PATCH /api/creator/campaigns/:id`

Allows editing draft/pending campaign metadata. Should not allow editing money-routing fields once live without admin approval.

## Admin endpoints

### `POST /api/admin/campaigns/:id/approve`

Approves a campaign to go live.

Should write audit log.

### `POST /api/admin/campaigns/:id/pause`

Pauses public display or fee routing if something looks wrong.

### `POST /api/admin/batches`

Creates a conversion batch from eligible fee events.

Request:

```json
{
  "campaignId": "uuid",
  "feeEventIds": ["uuid", "uuid"],
  "estimatedFiatCurrency": "AUD",
  "estimatedFiatAmount": "2913.00"
}
```

### `POST /api/admin/batches/:id/approve`

Approves a batch for off-ramp.

### `POST /api/admin/batches/:id/mark-converted`

Records fiat received after conversion.

Request:

```json
{
  "actualFiatCurrency": "AUD",
  "actualFiatReceived": "2887.00",
  "conversionRate": "232.45",
  "spreadOrFees": "26.00",
  "offRampProvider": "manual_exchange_account",
  "offRampReference": "ref_123"
}
```

### `POST /api/admin/receipts`

Creates a donation receipt linked to a batch.

Request:

```json
{
  "campaignId": "uuid",
  "batchId": "uuid",
  "fundraiserUrl": "https://www.gofundme.com/...",
  "donatedCurrency": "AUD",
  "donatedAmount": "2850.00",
  "donorDisplayName": "GivePump community",
  "receiptUrl": "https://storage.../receipt.png",
  "externalConfirmationId": "optional",
  "donatedAt": "2026-05-29T00:00:00Z"
}
```

### `POST /api/admin/receipts/:id/verify`

Marks a receipt as verified and publishes it to the proof wall.

## Webhook endpoints

### `POST /api/webhooks/helius`

Receives Solana transaction events.

Required behavior:

- verify webhook secret/header
- parse transfers into candidate fee events
- match destination wallet to campaign treasury
- de-duplicate by tx hash + instruction index
- store pending/confirmed event
- trigger campaign totals refresh

### `POST /api/webhooks/offramp`

Optional future endpoint for off-ramp providers if using an API-based conversion provider.

## Security rules

- Admin endpoints require admin auth.
- Webhooks require shared secret or signature verification.
- Public endpoints must never expose private admin notes.
- Money-related updates write audit logs.
- Receipt uploads should be immutable after verification; corrections should create new audit records.
