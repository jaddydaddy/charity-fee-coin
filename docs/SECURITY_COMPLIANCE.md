# Security, Compliance, and Abuse Risks

This product touches crypto, charitable giving, public tragedies/fundraisers, and fiat money movement. It needs stronger guardrails than a normal memecoin site.

This document is not legal advice. It is a product/security checklist.

## Main risks

### 1. Custody risk

If GivePump controls treasury wallets, users must trust the operator not to steal or misuse funds.

Mitigations:

- campaign-specific treasury wallets
- multisig control
- public wallet addresses
- public tx history
- public balance reconciliation
- withdrawal audit logs
- admin approvals for every conversion batch

### 2. Off-ramp and KYC/AML risk

Crypto-to-fiat conversion may require regulated exchange accounts, KYC, AML monitoring, tax records, and jurisdiction-specific compliance.

Mitigations:

- use compliant off-ramp providers
- keep records of conversion batches
- do not promise instant fiat delivery
- disclose conversion spread and fees
- consult a qualified lawyer/accountant before real launch

### 3. Charity/fundraiser legitimacy risk

A creator could attach a fake, impersonated, exploitative, or misleading fundraiser.

Mitigations:

- manual fundraiser review
- duplicate fundraiser detection
- sensitive campaign review lane
- require fundraiser URL and visible beneficiary details
- avoid campaigns involving harassment, hate, misinformation, or exploitation
- allow takedown/pausing

### 4. False advertising risk

Users may think every trade instantly donates to GoFundMe.

Mitigations:

- clear wording: fees go to treasury first
- show pending vs donated amounts separately
- show conversion delays
- show fees/spread
- publish receipts only after verification

### 5. Admin compromise risk

An attacker with admin access could approve fake batches or receipts.

Mitigations:

- MFA on admin accounts
- role-based access
- separate creator/reviewer/admin roles
- immutable audit logs
- two-person approval for money movement
- receipt verification separate from batch creation

### 6. Webhook spoofing risk

Fake webhook payloads could create fake fee events.

Mitigations:

- verify webhook signature/secret
- cross-check tx hashes against Solana RPC
- de-duplicate events
- only count confirmed/finalized transactions
- never trust webhook data alone for final accounting

### 7. Receipt fraud risk

Someone could upload a fake receipt.

Mitigations:

- manual review
- compare amount/date/fundraiser URL
- store receipt hash
- keep original file immutable
- mark receipts as pending until verified
- allow public dispute/reporting later

## Roles

### Creator

Can:

- create draft campaign
- edit non-money metadata before approval
- view campaign stats

Cannot:

- approve campaign
- alter treasury wallet after live
- create verified receipts
- mark donations complete

### Reviewer

Can:

- review fundraiser legitimacy
- flag sensitive campaigns
- verify receipts

Cannot:

- move treasury funds alone

### Admin

Can:

- approve/pause campaigns
- create conversion batches
- approve off-ramp flow
- manage platform settings

Should require MFA and ideally multisig for treasury movement.

## Sensitive campaign policy

Campaigns involving death, illness, disasters, vulnerable people, crime, children, harassment, or public controversy should enter a sensitive review lane.

Sensitive review checks:

- beneficiary appears legitimate
- no impersonation
- no harassment target
- no hate symbols/slurs
- no misinformation claims
- no exploitative meme framing
- donation claims are precise
- public copy is respectful

## Launch recommendation

Start with a closed beta:

- one or two test campaigns
- dummy donations or tiny real amounts only after review
- manual conversion
- public proof wall
- no autonomous money movement
- no claim of official GoFundMe partnership unless actually obtained
