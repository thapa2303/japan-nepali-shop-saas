import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { shopStatusEnum } from "./enums.js";
import { tenantsTable, usersTable } from "./identity.js";

export const shopsTable = pgTable("shops", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  address: text("address"),
  city: text("city"),
  prefecture: text("prefecture"),
  postalCode: text("postal_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  status: shopStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertShopSchema = createInsertSchema(shopsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Shop = typeof shopsTable.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;
