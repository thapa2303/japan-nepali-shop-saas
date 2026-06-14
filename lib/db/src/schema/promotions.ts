import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { shops } from "./shops.js";
import { tenants } from "./identity.js";

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 50 }).notNull(),
    description: text("description"),
    discountType: varchar("discount_type", { length: 20 }).notNull().default("percentage"),
    discountValue: integer("discount_value").notNull(),
    minOrderAmount: integer("min_order_amount"),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("coupons_tenant_id_idx").on(t.tenantId),
    index("coupons_shop_id_idx").on(t.shopId),
    unique("coupons_shop_code_unique").on(t.shopId, t.code),
  ]
);

export const shopStoreCategories = pgTable(
  "shop_store_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("shop_store_categories_shop_id_idx").on(t.shopId),
    unique("shop_store_categories_shop_name_unique").on(t.shopId, t.name),
  ]
);
