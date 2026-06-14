export * from "./enums";
export * from "./identity";
export * from "./shops";
export * from "./products";
export * from "./orders";
export * from "./platform";
export * from "./customers";
export * from "./promotions";
export * from "./relations";

// ── Inferred TypeScript types for all tables ──────────────────────────────────

import type {
  tenants, users, roles, permissions, rolePermissions, userRoles,
} from "./identity";
import type {
  categories, shops, shopLocations, shopOpeningHours,
} from "./shops";
import type {
  products, productImages, productVariants,
} from "./products";
import type {
  carts, cartItems, orders, orderItems, payments,
} from "./orders";
import type {
  subscriptionPlans, tenantSubscriptions, invoices,
  auditLogs, notifications, systemSettings, tenantFeatures,
} from "./platform";
import type {
  customerAddresses, customerPreferences, customerFavoriteShops,
} from "./customers";
import type {
  coupons, shopStoreCategories,
} from "./promotions";

// Identity
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;

// Shops
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Shop = typeof shops.$inferSelect;
export type NewShop = typeof shops.$inferInsert;
export type ShopLocation = typeof shopLocations.$inferSelect;
export type NewShopLocation = typeof shopLocations.$inferInsert;
export type ShopOpeningHours = typeof shopOpeningHours.$inferSelect;
export type NewShopOpeningHours = typeof shopOpeningHours.$inferInsert;

// Products
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

// Orders
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// Platform
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type TenantSubscription = typeof tenantSubscriptions.$inferSelect;
export type NewTenantSubscription = typeof tenantSubscriptions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type TenantFeature = typeof tenantFeatures.$inferSelect;
export type NewTenantFeature = typeof tenantFeatures.$inferInsert;

// Customers
export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = typeof customerAddresses.$inferInsert;
export type CustomerPreference = typeof customerPreferences.$inferSelect;
export type CustomerFavoriteShop = typeof customerFavoriteShops.$inferSelect;

// Promotions
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type ShopStoreCategory = typeof shopStoreCategories.$inferSelect;
export type NewShopStoreCategory = typeof shopStoreCategories.$inferInsert;
