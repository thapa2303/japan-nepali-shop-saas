import { relations } from "drizzle-orm";
import { tenantsTable, usersTable, rolesTable, userRolesTable } from "./identity.js";
import { shopsTable } from "./shops.js";
import { productsTable, categoriesTable } from "./products.js";
import { ordersTable, orderItemsTable } from "./orders.js";
import { customersTable } from "./customers.js";

export const tenantsRelations = relations(tenantsTable, ({ many }) => ({
  users: many(usersTable),
  shops: many(shopsTable),
}));

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  tenant: one(tenantsTable, {
    fields: [usersTable.tenantId],
    references: [tenantsTable.id],
  }),
  userRoles: many(userRolesTable),
  ownedShops: many(shopsTable),
  customer: one(customersTable, {
    fields: [usersTable.id],
    references: [customersTable.userId],
  }),
}));

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  userRoles: many(userRolesTable),
}));

export const userRolesRelations = relations(userRolesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userRolesTable.userId],
    references: [usersTable.id],
  }),
  role: one(rolesTable, {
    fields: [userRolesTable.roleId],
    references: [rolesTable.id],
  }),
}));

export const shopsRelations = relations(shopsTable, ({ one, many }) => ({
  tenant: one(tenantsTable, {
    fields: [shopsTable.tenantId],
    references: [tenantsTable.id],
  }),
  owner: one(usersTable, {
    fields: [shopsTable.ownerId],
    references: [usersTable.id],
  }),
  products: many(productsTable),
  orders: many(ordersTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one }) => ({
  shop: one(shopsTable, {
    fields: [productsTable.shopId],
    references: [shopsTable.id],
  }),
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  shop: one(shopsTable, {
    fields: [ordersTable.shopId],
    references: [shopsTable.id],
  }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));

export const customersRelations = relations(customersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [customersTable.userId],
    references: [usersTable.id],
  }),
}));
