import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { shops } from "./shops.js";
import { tenants } from "./identity.js";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    nameNepali: varchar("name_nepali", { length: 255 }),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    category: varchar("category", { length: 100 }).notNull(),
    browseCategory: varchar("browse_category", { length: 100 }),
    storeCategory: varchar("store_category", { length: 100 }),
    inStock: boolean("in_stock").notNull().default(true),
    stockCount: integer("stock_count"),
    unit: varchar("unit", { length: 50 }),
    featured: boolean("featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_tenant_id_idx").on(t.tenantId),
    index("products_shop_id_idx").on(t.shopId),
    index("products_category_idx").on(t.category),
    index("products_featured_idx").on(t.featured),
    index("products_in_stock_idx").on(t.inStock),
  ]
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    index("product_images_product_id_idx").on(t.productId),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    price: integer("price").notNull(),
    inStock: boolean("in_stock").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    index("product_variants_product_id_idx").on(t.productId),
  ]
);
