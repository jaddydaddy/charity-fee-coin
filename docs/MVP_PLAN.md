# MVP Build Plan

## Phase 0 — Prototype site

Status: done.

Includes:

- landing page
- concept explanation
- technical architecture section
- proof-wall mock
- safeguards copy

## Phase 1 — Static campaign proof wall

Goal: make one campaign page that can display manually entered proof data.

Build:

- `/campaign/[slug]` page
- JSON or DB-backed campaign data
- treasury wallet display
- manual fee event list
- manual conversion batch list
- manual donation receipt list
- computed totals

No live indexing yet.

## Phase 2 — Database backend

Goal: store real campaign/proof data.

Build:

- Postgres schema from `DATA_MODEL.md`
- ORM setup
- campaign CRUD
- admin dashboard shell
- audit log helper
- public API endpoints

## Phase 3 — Solana indexing

Goal: automatically detect treasury deposits.

Build:

- Helius webhook endpoint
- webhook signature verification
- treasury wallet matching
- fee event ingestion
- de-duplication
- polling backfill job
- balance reconciliation job

## Phase 4 — Admin conversion workflow

Goal: track crypto-to-fiat movement transparently.

Build:

- create conversion batch from fee events
- approve batch
- mark as sent/off-ramped
- record fiat received
- show spread/fees
- update public proof wall

## Phase 5 — Donation receipt workflow

Goal: prove GoFundMe donation happened.

Build:

- receipt upload
- receipt metadata form
- link receipt to conversion batch
- reviewer verification
- public receipt display
- donation totals

## Phase 6 — Real campaign beta

Goal: test with one controlled campaign.

Requirements before real money:

- legal/compliance review
- treasury custody decision
- off-ramp process confirmed
- admin MFA
- backup/export plan
- clear public terms/disclaimers
- sensitive campaign review policy

## Phase 7 — Automation upgrades

Possible later upgrades:

- auto-suggest conversion batches
- auto-price SOL/USDC to AUD/USD
- off-ramp provider integration
- receipt OCR
- public dispute/report button
- creator analytics
- campaign embeds
- X bot posting donation milestones
- DexScreener/ads growth split mode

## Suggested first engineering sprint

1. Add Supabase/Neon Postgres.
2. Implement schema tables.
3. Build `/campaign/demo` from database.
4. Build admin form to add manual fee events.
5. Build admin form to add conversion batch.
6. Build admin form to add receipt.
7. Compute public totals.
8. Deploy.

This proves the core value before touching complex wallet automation.
