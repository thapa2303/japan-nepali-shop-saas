import { relations } from "drizzle-orm";
import { tenants, users, roles, permissions, rolePermissions, userRoles } from "./identity.js";
import { categories, shops, shopLocations, shopOpeningHours } from "./shops.js";
import { products, productImages, productVariants } from "./products.js";
import { carts, cartItems, orders, orderItems, payments } from "./orders.js";
import {
  subscriptionPlans,
  tenantSubscriptions,
  invoices,
  auditLogs,
  notifications,
  tenantFeatures,
} from "./platform.js";
import { customerAddresses, customerPreferences, customerFavoriteShops } from "./customers.js";

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  shops: many(shops),
  products: many(products),
  orders: many(orders),
  subscriptions: many(tenantSubscriptions),
  invoices: many(invoices),
  features: many(tenantFeatures),
  auditLogs: many(auditLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
  userRoles: many(userRoles),
  carts: many(carts),
  orders: many(orders),
  addresses: many(customerAddresses),
  preferences: one(customerPreferences),
  favoriteShops: many(customerFavoriteShops),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
  tenant: one(tenants, { fields: [userRoles.tenantId], references: [tenants.id] }),
}));

export const shopsRelations = relations(shops, ({ one, many }) => ({
  tenant: one(tenants, { fields: [shops.tenantId], references: [tenants.id] }),
  location: one(shopLocations),
  openingHours: many(shopOpeningHours),
  products: many(products),
  orders: many(orders),
  cartItems: many(cartItems),
  favoriteByCustomers: many(customerFavoriteShops),
}));

export const shopLocationsRelations = relations(shopLocations, ({ one }) => ({
  shop: one(shops, { fields: [shopLocations.shopId], references: [shops.id] }),
}));

export const shopOpeningHoursRelations = relations(shopOpeningHours, ({ one }) => ({
  shop: one(shops, { fields: [shopOpeningHours.shopId], references: [shops.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  tenant: one(tenants, { fields: [products.tenantId], references: [tenants.id] }),
  shop: one(shops, { fields: [products.shopId], references: [shops.id] }),
  images: many(productImages),
  variants: many(productVariants),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  shop: one(shops, { fields: [cartItems.shopId], references: [shops.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [cartItems.variantId], references: [productVariants.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, { fields: [orders.tenantId], references: [tenants.id] }),
  shop: one(shops, { fields: [orders.shopId], references: [shops.id] }),
  customer: one(users, { fields: [orders.customerId], references: [users.id] }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(tenantSubscriptions),
}));

export const tenantSubscriptionsRelations = relations(tenantSubscriptions, ({ one, many }) => ({
  tenant: one(tenants, { fields: [tenantSubscriptions.tenantId], references: [tenants.id] }),
  plan: one(subscriptionPlans, {
    fields: [tenantSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  tenant: one(tenants, { fields: [invoices.tenantId], references: [tenants.id] }),
  subscription: one(tenantSubscriptions, {
    fields: [invoices.subscriptionId],
    references: [tenantSubscriptions.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, { fields: [auditLogs.tenantId], references: [tenants.id] }),
  actorUser: one(users, { fields: [auditLogs.actorUserId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const tenantFeaturesRelations = relations(tenantFeatures, ({ one }) => ({
  tenant: one(tenants, { fields: [tenantFeatures.tenantId], references: [tenants.id] }),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  user: one(users, { fields: [customerAddresses.userId], references: [users.id] }),
}));

export const customerPreferencesRelations = relations(customerPreferences, ({ one }) => ({
  user: one(users, { fields: [customerPreferences.userId], references: [users.id] }),
}));

export const customerFavoriteShopsRelations = relations(customerFavoriteShops, ({ one }) => ({
  user: one(users, { fields: [customerFavoriteShops.userId], references: [users.id] }),
  shop: one(shops, { fields: [customerFavoriteShops.shopId], references: [shops.id] }),
}));
