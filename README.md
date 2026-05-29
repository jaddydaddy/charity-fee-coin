# GivePump / Charity Fee Coin

GivePump is a prototype for a charity memecoin launch layer where **controlled Pump.fun fee streams** are routed into a public treasury, converted from crypto to fiat, and reconciled against verified GoFundMe donation receipts.

Live prototype: https://charity-fee-coin.vercel.app

## The one-line mechanic

A creator launches or connects a coin, selects a GoFundMe campaign, and routes the coin fee stream they control into a transparent donation pipeline:

```text
Pump.fun controlled fee stream
  → public Solana treasury wallet
  → indexed campaign ledger
  → swap/off-ramp batch
  → fiat donation to GoFundMe
  → receipt/proof wall
```

## Why this exists

Most charity coins rely on trust-me marketing. GivePump should make the money trail legible:

- on-chain deposits are visible
- treasury balances are public
- conversion batches are logged
- fiat donation receipts are attached
- deltas from spread, fees, and ops are disclosed
- admins cannot silently edit the record without an audit trail

## Important product stance

The MVP should **not** pretend GoFundMe accepts crypto directly or that every step can be safely autonomous on day one.

Phase one automates:

- campaign creation
- fee-event indexing
- public treasury accounting
- conversion batch tracking
- receipt publishing
- proof-wall generation

Phase one keeps human approval for:

- fundraiser verification
- off-ramp execution
- fiat donation submission
- receipt verification
- sensitive/charity campaign approval

## Documentation

- [System architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA_MODEL.md)
- [API design](docs/API.md)
- [Worker and indexing flow](docs/WORKERS.md)
- [Donation reconciliation flow](docs/DONATION_RECONCILIATION.md)
- [Security, compliance, and abuse risks](docs/SECURITY_COMPLIANCE.md)
- [MVP build plan](docs/MVP_PLAN.md)

## MVP components

| Layer | Purpose | Suggested tools |
| --- | --- | --- |
| Frontend | Landing page, campaign pages, creator dashboard, public proof wall | Next.js, React, Tailwind/CSS |
| Auth/admin | Creator login, reviewer/admin roles | Clerk, Supabase Auth, Privy, or custom wallet auth |
| Database | Campaigns, fee events, batches, receipts, audit logs | Postgres / Supabase |
| Solana indexer | Watch treasury wallets and fee streams | Helius webhooks, Solana RPC, background workers |
| Treasury | Holds fee stream funds before conversion | Campaign wallet or multisig-controlled wallet |
| Conversion | Swap/off-ramp crypto into fiat | Regulated exchange/off-ramp or verified operator |
| Proof wall | Public ledger of deposits, conversions, donations, receipts | Next.js pages/API |
| Admin review | Approve campaigns, batches, donations, receipts | Internal dashboard |

## Example campaign lifecycle

1. Creator creates campaign:
   - coin name / ticker
   - Pump.fun launch or coin mint
   - controlled fee source
   - GoFundMe URL
   - donation split
   - treasury wallet

2. System verifies fundraiser metadata:
   - URL format
   - campaign title/beneficiary text
   - duplicate detection
   - manual sensitive review if needed

3. Fee stream starts landing in treasury.

4. Indexer records on-chain deposits as `fee_events`.

5. When balance reaches a threshold, admin creates `conversion_batch`.

6. Funds are swapped/off-ramped.

7. Admin records fiat amount received, rate, spread, and fees.

8. Admin donates fiat to GoFundMe.

9. Receipt is uploaded/linked and verified.

10. Public campaign page updates the proof wall.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Current repo status

This repo currently contains the public landing/prototype site plus the technical blueprint. The backend, indexer, admin dashboard, and treasury logic are not implemented yet.

