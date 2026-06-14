import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  doublePrecision,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { tenants } from "./identity.js";
import { shopCategoryEnum, shopFeatureEnum } from "./enums.js";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  nameNepali: varchar("name_nepali", { length: 100 }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 100 }),
  image: text("image"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shops = pgTable(
  "shops",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    nameNepali: varchar("name_nepali", { length: 255 }),
    description: text("description").notNull(),
    category: shopCategoryEnum("category").notNull(),
    subcategories: text("subcategories").array().notNull().default([]),
    coverImage: text("cover_image"),
    logo: text("logo"),
    rating: doublePrecision("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    isOpen: boolean("is_open").notNull().default(false),
    features: shopFeatureEnum("features").array().notNull().default([]),
    minOrder: integer("min_order"),
    deliveryFee: integer("delivery_fee"),
    deliveryTime: varchar("delivery_time", { length: 100 }),
    featured: boolean("featured").notNull().default(false),
    googleMapsTag: varchar("google_maps_tag", { length: 100 }),
    googleMapsUrl: text("google_maps_url"),
    onlineStoreUrl: text("online_store_url"),
    contactPhone: varchar("contact_phone", { length: 30 }),
    contactWhatsapp: varchar("contact_whatsapp", { length: 30 }),
    contactEmail: varchar("contact_email", { length: 320 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("shops_tenant_id_idx").on(t.tenantId),
    index("shops_category_idx").on(t.category),
    index("shops_featured_idx").on(t.featured),
    index("shops_is_active_idx").on(t.isActive),
  ]
);

export const shopLocations = pgTable(
  "shop_locations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .unique()
      .references(() => shops.id, { onDelete: "cascade" }),
    address: varchar("address", { length: 255 }),
    area: varchar("area", { length: 100 }),
    city: varchar("city", { length: 100 }),
    prefecture: varchar("prefecture", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
  },
  (t) => [
    index("shop_locations_prefecture_idx").on(t.prefecture),
    index("shop_locations_city_idx").on(t.city),
  ]
);

export const shopOpeningHours = pgTable(
  "shop_opening_hours",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    dayOfWeek: varchar("day_of_week", { length: 10 }).notNull(),
    openTime: varchar("open_time", { length: 5 }),
    closeTime: varchar("close_time", { length: 5 }),
    isClosed: boolean("is_closed").notNull().default(false),
  },
  (t) => [
    index("shop_opening_hours_shop_id_idx").on(t.shopId),
  ]
);
