import { pgEnum } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", [
  "FREE",
  "STARTER",
  "PRO",
  "ENTERPRISE",
]);

export const shopStatusEnum = pgEnum("shop_status", [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "CLOSED",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const productStatusEnum = pgEnum("product_status", [
  "DRAFT",
  "ACTIVE",
  "OUT_OF_STOCK",
  "ARCHIVED",
]);
