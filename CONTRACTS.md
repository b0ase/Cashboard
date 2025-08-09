# Contracts in Cashboard

Cashboard treats contracts as both human‑readable agreements and machine‑readable specifications. The human text explains intent; the JSON specification drives automation (flows, triggers, payouts) with auditability.

## How contracts map to flows

- Clauses → Guardrails or conditions on nodes (e.g., pause payouts if runway < 6 months)
- KPIs → Metrics evaluated before actions (e.g., distribute only if CPM ≥ threshold)
- Triggers → Events that start actions (e.g., revenue_received → distribute_royalties)
- Allocations → Split node configuration (e.g., 70% Royalty Pool / 20% Ops / 10% Reserve)
- Distribution → Scheduler for Dividend node (e.g., weekly Monday 09:00 UTC)

## Files

- Schema: `contracts/royalty_policy.schema.json`
- Example: `contracts/royalty_policy.example.json`

## Validation

Use the provided script to validate example contracts against their schemas:

```bash
npm run contracts:validate
```

## Example (excerpt)

```json
{
  "title": "AUDEX Royalty Policy",
  "allocations": { "royaltyPool": 70, "ops": 20, "reserve": 10 },
  "distribution": { "schedule": "weekly", "dayOfWeek": "mon", "time": "09:00", "timezone": "UTC" },
  "proRataBasis": { "method": "snapshot", "snapshot": { "frequency": "daily", "windowDays": 7 } },
  "guardrails": { "minRunwayMonths": 6, "onBreach": "pause_payouts" },
  "triggers": [ { "event": "revenue_received", "action": "distribute_royalties" } ]
}
```

## Next steps

- Extend schemas to cover vesting schedules, milestone escrows, and multi‑pool royalty policies
- Add a contract editor UI with validation and previews on the canvas
- Emit audit events that link back to contract clause IDs
