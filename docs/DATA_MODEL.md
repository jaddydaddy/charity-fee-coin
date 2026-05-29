# Data Model

This is a suggested Postgres schema for the first real backend.

## campaigns

Stores one charity coin/fundraiser campaign.

```sql
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  coin_name text not null,
  coin_ticker text not null,
  coin_mint text,
  pumpfun_url text,
  fundraiser_url text not null,
  fundraiser_title text,
  fundraiser_beneficiary text,
  treasury_wallet text not null,
  donation_split_bps integer not null default 10000,
  growth_split_bps integer not null default 0,
  ops_split_bps integer not null default 0,
  status text not null default 'draft',
  sensitive_review_required boolean not null default false,
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Suggested statuses:

```text
draft
pending_review
approved
live
paused
rejected
archived
```

## fee_events

Stores on-chain deposits or fee movements related to a campaign.

```sql
create table fee_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  tx_hash text not null,
  instruction_index integer not null default 0,
  slot bigint,
  source_wallet text,
  destination_wallet text not null,
  token_mint text,
  token_symbol text not null default 'SOL',
  raw_amount numeric not null,
  decimals integer not null default 9,
  ui_amount numeric not null,
  usd_value_at_event numeric,
  confirmed_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique(tx_hash, instruction_index)
);
```

Suggested statuses:

```text
pending
confirmed
ignored
batched
reversed
```

## conversion_batches

Groups crypto deposits into an off-ramp/conversion event.

```sql
create table conversion_batches (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  batch_number integer not null,
  source_token_symbol text not null,
  source_crypto_amount numeric not null,
  estimated_fiat_currency text not null default 'AUD',
  estimated_fiat_amount numeric,
  actual_fiat_currency text not null default 'AUD',
  actual_fiat_received numeric,
  conversion_rate numeric,
  spread_or_fees numeric,
  off_ramp_provider text,
  off_ramp_reference text,
  treasury_tx_hash text,
  status text not null default 'created',
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(campaign_id, batch_number)
);
```

Suggested statuses:

```text
created
approved
sent_to_offramp
converted
ready_to_donate
donated
cancelled
```

## batch_fee_events

Links fee events to conversion batches.

```sql
create table batch_fee_events (
  batch_id uuid not null references conversion_batches(id),
  fee_event_id uuid not null references fee_events(id),
  primary key (batch_id, fee_event_id)
);
```

## donation_receipts

Stores donation evidence for GoFundMe or another fiat donation endpoint.

```sql
create table donation_receipts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  batch_id uuid references conversion_batches(id),
  fundraiser_url text not null,
  donated_currency text not null default 'AUD',
  donated_amount numeric not null,
  donor_display_name text,
  receipt_url text,
  receipt_hash text,
  external_confirmation_id text,
  donated_at timestamptz,
  verified_by uuid,
  verified_at timestamptz,
  public_note text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
```

Suggested statuses:

```text
pending
verified
rejected
needs_more_info
```

## audit_logs

Every admin action that changes money-related state should write an audit event.

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_role text,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before jsonb,
  after jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
```

## Useful public computed fields

For a campaign page:

```sql
-- total fees confirmed
select sum(ui_amount) from fee_events
where campaign_id = $1 and status in ('confirmed', 'batched');

-- total fiat received from conversions
select sum(actual_fiat_received) from conversion_batches
where campaign_id = $1 and status in ('converted', 'ready_to_donate', 'donated');

-- total donated
select sum(donated_amount) from donation_receipts
where campaign_id = $1 and status = 'verified';
```
