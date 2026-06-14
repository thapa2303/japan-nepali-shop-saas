---
name: Database roles
description: Role names in the DB vs internal middleware aliases
---

Database roles table has: PLATFORM_SUPER_ADMIN, TENANT_ADMIN, MERCHANT, STAFF, CUSTOMER
Authorize middleware hierarchy uses: PSA (=4), TENANT_ADMIN (=3), MERCHANT (=2), CUSTOMER (=1)

PSA in the middleware does NOT match PLATFORM_SUPER_ADMIN in the DB.
JWTs carry DB role names, so PSA-level checks will never pass for PLATFORM_SUPER_ADMIN users until authorize.ts adds "PLATFORM_SUPER_ADMIN" to the hierarchy map.

**Why:** authorize.ts was written before the DB was seeded; DB used a longer name.
**How to apply:** When fixing platform admin access, add PLATFORM_SUPER_ADMIN: 4 to ROLE_HIERARCHY in authorize.ts alongside PSA.
