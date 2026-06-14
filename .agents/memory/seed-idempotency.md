---
name: Seed script idempotency
description: The lib/db seed script is NOT idempotent — re-running it causes unique-constraint failures.
---

## Rule
`lib/db/src/seed.ts` will fail on the second run because it tries to INSERT rows that already exist (unique constraints on `tenants.slug`, `users.email`, `shops.slug`, `subscription_plans.tier`, `system_settings.key`, etc.).

**Why:** The seed was written for a clean database. There is no ON CONFLICT / upsert logic.

**How to apply:**
- Before re-seeding: run `pnpm --filter @workspace/db run push-force` (which will drop and recreate tables) OR manually truncate all tables.
- If idempotent re-seeding is needed in the future, add `.onConflictDoNothing()` or `.onConflictDoUpdate()` to each insert in the seed script.
