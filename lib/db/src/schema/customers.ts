import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./identity.js";
import { shops } from "./shops.js";

export const customerAddresses = pgTable(
  "customer_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 50 }).notNull().default("Home"),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 30 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    prefecture: varchar("prefecture", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    address: text("address").notNull(),
    building: varchar("building", { length: 255 }),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("customer_addresses_user_id_idx").on(t.userId),
  ]
);

export const customerPreferences = pgTable("customer_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  orderUpdates: boolean("order_updates").notNull().default(true),
  promotions: boolean("promotions").notNull().default(true),
  newShops: boolean("new_shops").notNull().default(false),
  newsletter: boolean("newsletter").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customerFavoriteShops = pgTable(
  "customer_favorite_shops",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("customer_favorite_shops_user_id_idx").on(t.userId),
  ]
);
