# Donation Reconciliation Flow

## Problem

GoFundMe generally operates as a fiat donation platform. If it does not accept crypto directly for a campaign, the product needs a bridge:

```text
crypto fees → fiat money → GoFundMe donation
```

The dangerous part is pretending this bridge is invisible. It is not. It creates custody, compliance, timing, spread, and trust questions.

The product should expose that bridge clearly.

## Recommended MVP flow

### 1. Fees enter treasury

The campaign treasury receives SOL/USDC or another asset.

Public proof:

- tx hash
- token
- amount
- timestamp
- source/destination wallets

### 2. Admin creates conversion batch

When the balance crosses a threshold, an admin selects eligible fee events and creates a batch.

Public proof after publication:

- batch number
- included tx hashes
- crypto amount
- estimated fiat value
- status

### 3. Batch is approved

A second admin/multisig signer approves conversion.

Internal proof:

- approved by
- approved at
- audit log

### 4. Crypto is off-ramped

This could be done manually through a compliant exchange/off-ramp or via a provider API later.

Track:

- provider
- reference ID
- sent crypto amount
- fiat received
- exchange rate
- spread/fees
- timestamp

### 5. Fiat donation is made to GoFundMe

Admin submits the donation using normal fiat rails.

Track:

- GoFundMe URL
- donated amount
- donor display name
- receipt/confirmation screenshot
- confirmation ID if available
- timestamp

### 6. Receipt is verified and published

A reviewer verifies the receipt matches the campaign and batch.

Public proof:

- donation amount
- donation date
- receipt image/PDF or redacted receipt
- linked conversion batch
- unreconciled difference, if any

## Example reconciliation

```text
Fee events received:
- tx_a: 5.00 SOL
- tx_b: 7.42 SOL
Total: 12.42 SOL

Conversion batch #014:
- 12.42 SOL sent to off-ramp
- estimated A$2,913
- actual A$2,887 received
- A$26 spread/fees

Donation receipt:
- A$2,850 donated to GoFundMe
- A$37 remaining pending or processing buffer
```

Public wording should say:

> This campaign has received 12.42 SOL in controlled fees. A$2,887 was received after conversion. A$2,850 has been donated and verified. A$37 remains pending/reconciling.

## What not to say

Avoid:

- “automatic GoFundMe donation” if humans/off-ramp are involved
- “100% donated” if spread, gas, conversion, platform, or processing fees exist
- “trustless charity” if any off-chain human step remains
- “verified fundraiser” unless actually verified

Better:

- “transparent donation pipeline”
- “public fee-to-donation proof wall”
- “human-reviewed conversion and receipt verification”
- “controlled fee stream routed toward fundraiser”

## Future automation

Automation can increase over time:

1. auto-index fee events
2. auto-create suggested batches
3. auto-price conversion estimates
4. auto-submit off-ramp requests through regulated provider
5. auto-detect GoFundMe donation confirmation if API/partner access exists
6. auto-publish receipts after reviewer approval

Money movement should stay gated until the rails and legal/compliance posture are solid.
