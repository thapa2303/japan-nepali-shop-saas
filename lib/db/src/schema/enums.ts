import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "PLATFORM_SUPER_ADMIN",
  "TENANT_ADMIN",
  "MERCHANT",
  "STAFF",
  "CUSTOMER",
]);

export const shopCategoryEnum = pgEnum("shop_category", [
  "groceries",
  "fashion",
  "electronics",
  "home-decor",
  "health-beauty",
  "books-stationery",
  "sports-fitness",
  "food-beverages",
  "handicrafts",
  "jewelry",
]);

export const shopFeatureEnum = pgEnum("shop_feature", [
  "delivery",
  "pickup",
  "cash-on-delivery",
  "digital-payment",
  "wholesale",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cod",
  "paypay",
  "credit-card",
  "bank-transfer",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "starter",
  "growth",
  "premium",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past-due",
  "cancelled",
]);

export const merchantStatusEnum = pgEnum("merchant_status", [
  "active",
  "pending",
  "suspended",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "paid",
  "pending",
  "failed",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const languageEnum = pgEnum("language", ["en", "ne"]);
