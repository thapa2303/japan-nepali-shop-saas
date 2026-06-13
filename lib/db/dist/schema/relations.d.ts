export declare const tenantsRelations: import("drizzle-orm").Relations<"tenants", {
    users: import("drizzle-orm").Many<"users">;
    shops: import("drizzle-orm").Many<"shops">;
}>;
export declare const usersRelations: import("drizzle-orm").Relations<"users", {
    tenant: import("drizzle-orm").One<"tenants", false>;
    userRoles: import("drizzle-orm").Many<"user_roles">;
    ownedShops: import("drizzle-orm").Many<"shops">;
    customer: import("drizzle-orm").One<"customers", true>;
}>;
export declare const rolesRelations: import("drizzle-orm").Relations<"roles", {
    userRoles: import("drizzle-orm").Many<"user_roles">;
}>;
export declare const userRolesRelations: import("drizzle-orm").Relations<"user_roles", {
    user: import("drizzle-orm").One<"users", true>;
    role: import("drizzle-orm").One<"roles", true>;
}>;
export declare const shopsRelations: import("drizzle-orm").Relations<"shops", {
    tenant: import("drizzle-orm").One<"tenants", true>;
    owner: import("drizzle-orm").One<"users", true>;
    products: import("drizzle-orm").Many<"products">;
    orders: import("drizzle-orm").Many<"orders">;
}>;
export declare const categoriesRelations: import("drizzle-orm").Relations<"categories", {
    products: import("drizzle-orm").Many<"products">;
}>;
export declare const productsRelations: import("drizzle-orm").Relations<"products", {
    shop: import("drizzle-orm").One<"shops", true>;
    category: import("drizzle-orm").One<"categories", false>;
}>;
export declare const ordersRelations: import("drizzle-orm").Relations<"orders", {
    shop: import("drizzle-orm").One<"shops", true>;
    items: import("drizzle-orm").Many<"order_items">;
}>;
export declare const orderItemsRelations: import("drizzle-orm").Relations<"order_items", {
    order: import("drizzle-orm").One<"orders", true>;
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const customersRelations: import("drizzle-orm").Relations<"customers", {
    user: import("drizzle-orm").One<"users", true>;
}>;
//# sourceMappingURL=relations.d.ts.map