# ShopSaaS — Nepali Shops in Japan

A multi-tenant SaaS marketplace connecting Nepali merchants in Japan with the diaspora community.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run push-force` — push DB schema changes, overwriting conflicts
- `pnpm --filter @workspace/db run seed` — seed the database with demo data (destructive if run twice — wrap in a transaction or drop tables first)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite, Tailwind CSS v4, Wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (`drizzle-orm ^0.45.2`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/shopsaas/` — React-Vite frontend (served at `/`)
- `artifacts/api-server/` — Express 5 API server
- `lib/db/src/schema/` — Drizzle ORM table definitions (source of truth for all DB types)
  - `enums.ts` — all pgEnum definitions
  - `identity.ts` — tenants, users, roles, permissions, user_roles
  - `shops.ts` — categories, shops, shop_opening_hours
  - `products.ts` — products, product_images, product_variants
  - `orders.ts` — carts, cart_items, orders, order_items, payments
  - `platform.ts` — subscription_plans, tenant_subscriptions, invoices, audit_logs, notifications, system_settings, tenant_features
  - `customers.ts` — customer_addresses, customer_preferences, customer_favorite_shops
  - `relations.ts` — all Drizzle `relations()` definitions
- `lib/db/src/zod.ts` — drizzle-zod insert/select schemas for users, shops, products, orders

## Architecture decisions

- **Multi-tenant via `tenant_id`**: Every row (except PLATFORM_SUPER_ADMIN users and customers) is scoped by `tenant_id` pointing to the `tenants` table. Each shop = one tenant.
- **Roles stored in DB**: Roles use a `pgEnum` (PLATFORM_SUPER_ADMIN, TENANT_ADMIN, MERCHANT, STAFF, CUSTOMER). `user_roles` junction table allows a user to hold multiple roles across tenants.
- **Prices in integer yen**: All monetary values (price, delivery_fee, subscription amounts) are stored as integers representing Japanese yen — no decimals needed.
- **Opening hours as rows**: `shop_opening_hours` has one row per day per shop (7 rows per shop) rather than JSONB, enabling SQL queries by day.
- **Order item price snapshot**: `order_items` stores `product_name`, `variant_name`, and `price` at time of purchase so orders are immutable even if the product is later edited.

## Product

- **Storefront**: Browse 12 Nepali shops across Japan by category, location, and rating. View shop details, product listings, and add to cart.
- **Merchant dashboard**: Merchants manage orders, products, and view analytics for their shop.
- **Platform admin**: SaaS operator views all merchants, customers, GMV, and MRR.
- **Customer account**: Customers manage addresses, view order history, and save favorite shops.
- **Subscriptions**: Three tiers — Starter (¥2,980/mo), Growth (¥5,980/mo), Premium (¥11,800/mo).

## Demo logins (seed data)

| Role | Email | Password |
|------|-------|----------|
| Platform Admin | `admin@shopsaas.com` | `password123` |
| Merchant (Himalaya Mart) | `merchant@himalaya-asian-mart.jp` | `password123` |
| Customer | `prabin.shrestha@example.com` | `password123` |

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Seed is not idempotent**: Running `pnpm --filter @workspace/db run seed` a second time will fail on unique constraint violations. Drop all tables and re-push first, or add ON CONFLICT logic.
- **`as const` arrays vs Drizzle**: Drizzle array columns expect mutable arrays. Always spread `[...array]` when inserting values typed as `readonly`.
- **`lib/db` is ESM** (`"type": "module"`). Imports from within this package must use `.js` extension in compiled output (tsx handles this at runtime).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
