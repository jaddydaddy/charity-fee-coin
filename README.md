# GivePump / Charity Fee Coin

A prototype landing page for a memecoin launch layer where controlled Pump.fun fee streams route into a public treasury, get converted from crypto to fiat, and are reconciled against verified GoFundMe donation receipts.

## Core idea

- Creator launches/connects a coin and chooses a GoFundMe campaign.
- The fee stream controlled by the platform/creator flows into a public Solana treasury wallet.
- Treasury batches are converted to fiat through a documented off-ramp process.
- Fiat donations are made to GoFundMe.
- Receipts, timestamps, tx hashes, conversion amounts, and fees are published on a proof wall.

## Important caveat

This should not claim fully autonomous GoFundMe donations until payment rails, custody, KYC/AML, tax, and GoFundMe policy/API constraints are reviewed. MVP should automate transparency first and keep fiat donation approval human-reviewed.

## Dev

```bash
npm install
npm run dev
npm run build
```
