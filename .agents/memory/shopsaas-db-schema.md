---
name: ShopSaaS DB schema facts
description: Actual database column names and shape — critical for all Drizzle queries and API routes.
---

# ShopSaaS DB Schema Facts

## shops table
- `is_active` boolean (not `status` enum)
- `cover_image`, `logo` (not `bannerUrl`, `logoUrl`)
- `name` (not `display_name`)
- `area` text (no separate city/prefecture/address columns on shops)
- `contact_phone`, `contact_whatsapp`, `contact_email`
- `rating` double, `review_count` integer
- `opening_hours` stored as JSON string (parse with `tryParseJson`)
- No `whatsapp` column — use `contact_whatsapp`

## products table
- `in_stock` boolean, `stock_count` integer (not `status` enum)
- `price` integer (yen, no decimals)
- `images text[]` column (array of image URLs)
- `is_active` boolean

## users / identity table
- `name` (not `display_name`)
- `password_hash`

## cart tables
- `carts` has `user_id` + `session_id`
- `cart_items` has `cart_id` FK (not `user_id` directly)
- Always call `getOrCreateCart(userId)` → returns `cartId` before querying cart_items

## orders table
- Requires `tenant_id` (from shop's tenant), `order_number` (generated)
- `customer_name`, `customer_phone`, `customer_email` denormalized
- `delivery_address` required; postal/prefecture/city/building optional
- `subtotal`, `delivery_fee`, `total` stored as integers
- `order_status` enum: `pending/confirmed/preparing/out-for-delivery/delivered/cancelled`

## API response shape conventions
- Shop location response must include full shape: `{ address, area, city, prefecture, postalCode, coordinates: { lat, lng } }` — fill empty strings for missing DB columns
- Shop `openingHours` must always return 7-day object — use `buildDefaultHours()` fallback
- `/api/shops/:slug/products` must include `pagination` wrapper (same as `/api/products`)

**Why:** The Drizzle schema files were rewritten to match the actual DB. Any future schema migrations must sync both the Drizzle schema files and the actual DB.
