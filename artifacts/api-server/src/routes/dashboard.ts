import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  users,
  roles,
  userRoles,
  tenants,
  shops,
  products,
  orders,
  orderItems,
  auditLogs,
  eq,
  and,
  desc,
  asc,
  sql,
  count,
  sum,
  gte,
  isNull,
  lt,
} from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { writeAuditLog } from "../lib/audit.js";

const router: IRouter = Router();

const AUTH = [authenticate, authorize("MERCHANT")] as const;

const PLAN_LIMITS: Record<string, { productLimit: number; commissionRate: number; monthlyPrice: number; name: string }> = {
  starter: { productLimit: 30, commissionRate: 8, monthlyPrice: 2980, name: "Starter" },
  growth: { productLimit: 150, commissionRate: 5, monthlyPrice: 5980, name: "Growth" },
  premium: { productLimit: 999, commissionRate: 3, monthlyPrice: 11800, name: "Premium" },
};

async function getMerchantShop(tenantId: string) {
  const [shop] = await db
    .select()
    .from(shops)
    .where(and(eq(shops.tenantId, tenantId), eq(shops.isActive, true)));
  return shop ?? null;
}

function getPeriodStart(period: string): Date {
  const now = new Date();
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (period === "year") {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  }
  const d = new Date(now);
  d.setMonth(d.getMonth() - 1);
  return d;
}

// GET /api/dashboard/shop
router.get("/dashboard/shop", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }
  res.json(shop);
});

// PUT /api/dashboard/shop
router.put("/dashboard/shop", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const allowed = [
    "name", "nameNepali", "description", "contactPhone", "contactWhatsapp",
    "contactEmail", "area", "openingHours", "features", "minOrder", "deliveryFee",
    "deliveryTime", "coverImage", "logo", "latitude", "longitude",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in req.body) {
      updates[key] = req.body[key];
    }
  }

  const [updated] = await db
    .update(shops)
    .set(updates as Partial<typeof shops.$inferInsert>)
    .where(eq(shops.id, shop.id))
    .returning();

  await writeAuditLog({ req, action: "shop.update", resource: "shop", resourceId: shop.id, metadata: updates });
  res.json(updated);
});

// GET /api/dashboard/products
router.get("/dashboard/products", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const productList = await db
    .select()
    .from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));

  res.json({ products: productList });
});

// POST /api/dashboard/products
router.post("/dashboard/products", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  const tier = tenant?.subscriptionTier ?? "starter";
  const limits = PLAN_LIMITS[tier] ?? PLAN_LIMITS.starter;

  const [{ total }] = await db
    .select({ total: count() })
    .from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.isActive, true)));

  if (Number(total) >= limits.productLimit) {
    res.status(403).json({
      error: `Plan limit reached. Your ${limits.name} plan allows up to ${limits.productLimit} products.`,
    });
    return;
  }

  const { name, nameNepali, description, price, compareAtPrice, images, category, browseCategory, storeCategory, inStock, stockCount, unit, featured } = req.body as {
    name: string;
    nameNepali?: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
    category: string;
    browseCategory?: string;
    storeCategory?: string;
    inStock?: boolean;
    stockCount?: number;
    unit?: string;
    featured?: boolean;
  };

  if (!name || !price) {
    res.status(400).json({ error: "name and price are required" });
    return;
  }

  const [product] = await db
    .insert(products)
    .values({
      tenantId,
      shopId: shop.id,
      name,
      nameNepali: nameNepali ?? null,
      description: description ?? "",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      category,
      browseCategory: browseCategory ?? null,
      storeCategory: storeCategory ?? null,
      inStock: inStock ?? true,
      stockCount: stockCount != null ? Number(stockCount) : null,
      unit: unit ?? null,
      featured: featured ?? false,
    })
    .returning();

  await writeAuditLog({ req, action: "product.create", resource: "product", resourceId: product.id, metadata: { name } });
  res.status(201).json(product);
});

// PUT /api/dashboard/products/:id
router.put("/dashboard/products/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const [existing] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.tenantId, tenantId)));
  if (!existing) { res.status(404).json({ error: "Product not found" }); return; }

  const allowed = ["name", "nameNepali", "description", "price", "compareAtPrice", "category", "browseCategory", "storeCategory", "inStock", "stockCount", "unit", "featured"] as const;
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  if (updates.price) updates.price = Number(updates.price);
  if (updates.compareAtPrice != null) updates.compareAtPrice = Number(updates.compareAtPrice);
  if (updates.stockCount != null) updates.stockCount = Number(updates.stockCount);

  const [updated] = await db
    .update(products)
    .set(updates as Partial<typeof products.$inferInsert>)
    .where(eq(products.id, id))
    .returning();

  await writeAuditLog({ req, action: "product.update", resource: "product", resourceId: id, metadata: updates });
  res.json(updated);
});

// DELETE /api/dashboard/products/:id
router.delete("/dashboard/products/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const [existing] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.tenantId, tenantId)));
  if (!existing) { res.status(404).json({ error: "Product not found" }); return; }

  await db
    .update(products)
    .set({ isActive: false })
    .where(eq(products.id, id));

  await writeAuditLog({ req, action: "product.delete", resource: "product", resourceId: id, metadata: { name: existing.name } });
  res.json({ message: "Product deleted" });
});

// GET /api/dashboard/orders
router.get("/dashboard/orders", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const { status, page = "1", limit = "20" } = req.query as Record<string, string>;

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(orders.shopId, shop.id)];
  if (status && status !== "all") {
    conditions.push(eq(orders.status, status as typeof orders.$inferSelect["status"]));
  }

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt)).limit(limitNum).offset(offset),
    db.select({ total: count() }).from(orders).where(and(...conditions)),
  ]);

  const orderIds = rows.map((o) => o.id);
  const items = orderIds.length > 0
    ? await db.select().from(orderItems).where(sql`${orderItems.orderId} = ANY(${sql`ARRAY[${sql.raw(orderIds.map((id) => `'${id}'`).join(","))}]::uuid[]`})`)
    : [];

  const itemsByOrder: Record<string, typeof items> = {};
  for (const item of items) {
    if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
    itemsByOrder[item.orderId].push(item);
  }

  res.json({
    orders: rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail ?? undefined,
      deliveryAddress: o.deliveryAddress,
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      notes: o.notes ?? undefined,
      items: (itemsByOrder[o.id] ?? []).map((item) => ({
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    })),
    pagination: { page: pageNum, limit: limitNum, total: Number(total), pages: Math.ceil(Number(total) / limitNum) },
  });
});

// GET /api/dashboard/orders/:id
router.get("/dashboard/orders/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [order] = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.shopId, shop.id)));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  res.json({
    ...order,
    items: items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    })),
  });
});

// PUT /api/dashboard/orders/:id/status
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out-for-delivery", "cancelled"],
  "out-for-delivery": ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

router.put("/dashboard/orders/:id/status", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);
  const { status } = req.body as { status: string };

  if (!status) { res.status(400).json({ error: "status is required" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [order] = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.shopId, shop.id)));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: `Cannot transition from ${order.status} to ${status}` });
    return;
  }

  const [updated] = await db
    .update(orders)
    .set({ status: status as typeof orders.$inferSelect["status"] })
    .where(eq(orders.id, id))
    .returning();

  await writeAuditLog({
    req,
    action: "order.status_change",
    resource: "order",
    resourceId: id,
    metadata: { from: order.status, to: status },
  });

  res.json(updated);
});

// GET /api/dashboard/analytics
router.get("/dashboard/analytics", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const { period = "month" } = req.query as Record<string, string>;

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const since = getPeriodStart(period);

  const [orderList, productSales] = await Promise.all([
    db.select().from(orders).where(
      and(eq(orders.shopId, shop.id), gte(orders.createdAt, since))
    ),
    db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        totalQty: sql<number>`sum(${orderItems.quantity})`,
        totalRevenue: sql<number>`sum(${orderItems.subtotal})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(eq(orders.shopId, shop.id), gte(orders.createdAt, since)))
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(sql`sum(${orderItems.quantity}) DESC`)
      .limit(10),
  ]);

  const completedOrders = orderList.filter((o) => o.status !== "cancelled");
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const orderCount = completedOrders.length;

  const revenueByDay: Record<string, number> = {};
  for (const o of completedOrders) {
    const day = o.createdAt.toISOString().slice(0, 10);
    revenueByDay[day] = (revenueByDay[day] ?? 0) + o.total;
  }

  const categoryRevenue: Record<string, number> = {};
  for (const p of productSales) {
    categoryRevenue["products"] = (categoryRevenue["products"] ?? 0) + Number(p.totalRevenue);
  }

  res.json({
    period,
    totalRevenue,
    orderCount,
    topProducts: productSales.map((p) => ({
      productId: p.productId,
      name: p.productName,
      unitsSold: Number(p.totalQty),
      revenue: Number(p.totalRevenue),
    })),
    revenueByDay: Object.entries(revenueByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue })),
    categoryBreakdown: Object.entries(categoryRevenue).map(([category, revenue]) => ({ category, revenue })),
  });
});

// GET /api/dashboard/subscription
router.get("/dashboard/subscription", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant) { res.status(404).json({ error: "Tenant not found" }); return; }

  const tier = tenant.subscriptionTier;
  const limits = PLAN_LIMITS[tier] ?? PLAN_LIMITS.starter;

  const shop = await getMerchantShop(tenantId);

  const [productCount] = shop
    ? await db.select({ total: count() }).from(products).where(and(eq(products.tenantId, tenantId), eq(products.isActive, true)))
    : [{ total: 0 }];

  const staffRows = await db
    .select({ userId: userRoles.userId })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(users, eq(userRoles.userId, users.id))
    .where(
      and(
        eq(roles.name, "STAFF"),
        eq(users.tenantId, tenantId),
        eq(users.isActive, true)
      )
    );

  res.json({
    tier,
    status: tenant.status,
    planName: limits.name,
    monthlyPrice: limits.monthlyPrice,
    commissionRate: limits.commissionRate,
    productLimit: limits.productLimit,
    currentProductCount: Number(productCount?.total ?? 0),
    staffCount: staffRows.length,
    plans: Object.entries(PLAN_LIMITS).map(([t, p]) => ({
      tier: t,
      name: p.name,
      monthlyPrice: p.monthlyPrice,
      productLimit: p.productLimit,
      commissionRate: p.commissionRate,
    })),
  });
});

// GET /api/dashboard/staff
router.get("/dashboard/staff", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const staff = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(userRoles, eq(users.id, userRoles.userId))
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(
      and(
        eq(users.tenantId, tenantId),
        eq(roles.name, "STAFF"),
        eq(users.isActive, true)
      )
    );

  res.json({ staff });
});

// POST /api/dashboard/staff
router.post("/dashboard/staff", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const { name, email } = req.body as { name: string; email: string };
  if (!name || !email) { res.status(400).json({ error: "name and email are required" }); return; }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase()));
  if (existing) { res.status(409).json({ error: "Email already registered" }); return; }

  const bcrypt = await import("bcryptjs");
  const tempPassword = Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const [user] = await db.insert(users).values({
    tenantId,
    email: email.toLowerCase(),
    passwordHash,
    name,
  }).returning();

  const [staffRole] = await db.select({ id: roles.id }).from(roles).where(eq(roles.name, "STAFF"));
  if (staffRole) {
    await db.insert(userRoles).values({ userId: user.id, roleId: staffRole.id });
  }

  await writeAuditLog({ req, action: "staff.create", resource: "user", resourceId: user.id, metadata: { email } });
  res.status(201).json({ id: user.id, name: user.name, email: user.email, tempPassword });
});

// DELETE /api/dashboard/staff/:id
router.delete("/dashboard/staff/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const [user] = await db.select().from(users).where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
  if (!user) { res.status(404).json({ error: "Staff member not found" }); return; }

  await db.update(users).set({ isActive: false }).where(eq(users.id, id));
  await writeAuditLog({ req, action: "staff.delete", resource: "user", resourceId: id });
  res.json({ message: "Staff member removed" });
});

export default router;
