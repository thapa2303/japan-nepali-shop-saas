---
name: DB enum case
description: All DB enum values are lowercase; using uppercase in SQL literals causes 500 errors.
---

All PostgreSQL enums in this project use lowercase values. Using uppercase string literals in raw SQL (e.g. `sql\`...\``) causes query failures.

**Known enums and their values:**
- `merchant_status`: `active`, `pending`, `suspended`
- `order_status`: `pending`, `confirmed`, `preparing`, `out-for-delivery`, `delivered`, `cancelled`
- `subscription_tier`: `starter`, `growth`, `premium`
- `role_enum`: `PLATFORM_SUPER_ADMIN`, `TENANT_ADMIN`, `MERCHANT`, `STAFF`, `CUSTOMER` (these ARE uppercase — only the role enum is uppercase)

**Why:** The Drizzle schema defines them with lowercase strings in pgEnum(). PostgreSQL enum values are case-sensitive.

**How to apply:** Any time you write a raw `sql\`...\`` template with a string literal compared to an enum column, use lowercase. E.g. `sql\`${orders.status} != 'cancelled'\`` not `'CANCELLED'`.
