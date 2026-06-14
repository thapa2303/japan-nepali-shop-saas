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
  coupons,
  shopStoreCategories,
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
import { getPlanForTier, getAllPlans } from "../lib/plan-limits.js";

const router: IRouter = Router();

const AUTH = [authenticate, authorize("MERCHANT")] as const;

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
router.get("/shop", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }
  res.json(shop);
});

// PUT /api/dashboard/shop
router.put("/shop", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.get("/products", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.post("/products", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  const tier = tenant?.subscriptionTier ?? "starter";
  const limits = await getPlanForTier(tier);

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
router.put("/products/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.delete("/products/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.get("/orders", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.get("/orders/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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

router.put("/orders/:id/status", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.get("/analytics", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.get("/subscription", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant) { res.status(404).json({ error: "Tenant not found" }); return; }

  const tier = tenant.subscriptionTier;
  const [limits, allPlans] = await Promise.all([
    getPlanForTier(tier),
    getAllPlans(),
  ]);

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
    plans: allPlans.map((p) => ({
      tier: p.tier,
      name: p.name,
      monthlyPrice: p.monthlyPrice,
      productLimit: p.productLimit,
      commissionRate: p.commissionRate,
    })),
  });
});

// GET /api/dashboard/staff
router.get("/staff", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.post("/staff", ...AUTH, async (req: Request, res: Response): Promise<void> => {
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
router.delete("/staff/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const [user] = await db.select().from(users).where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
  if (!user) { res.status(404).json({ error: "Staff member not found" }); return; }

  await db.update(users).set({ isActive: false }).where(eq(users.id, id));
  await writeAuditLog({ req, action: "staff.delete", resource: "user", resourceId: id });
  res.json({ message: "Staff member removed" });
});

// GET /api/dashboard/coupons
router.get("/coupons", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const rows = await db
    .select()
    .from(coupons)
    .where(eq(coupons.shopId, shop.id))
    .orderBy(desc(coupons.createdAt));

  res.json({ coupons: rows });
});

// POST /api/dashboard/coupons
router.post("/coupons", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const { code, description, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body as {
    code: string;
    description?: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount?: number;
    maxUses?: number;
    expiresAt?: string;
  };

  if (!code || !discountType || discountValue == null) {
    res.status(400).json({ error: "code, discountType, and discountValue are required" });
    return;
  }
  if (!["percentage", "fixed"].includes(discountType)) {
    res.status(400).json({ error: "discountType must be percentage or fixed" });
    return;
  }
  if (discountType === "percentage" && (discountValue < 1 || discountValue > 100)) {
    res.status(400).json({ error: "Percentage discount must be between 1 and 100" });
    return;
  }

  const [coupon] = await db.insert(coupons).values({
    tenantId,
    shopId: shop.id,
    code: code.toUpperCase().trim(),
    description: description ?? null,
    discountType,
    discountValue: Number(discountValue),
    minOrderAmount: minOrderAmount != null ? Number(minOrderAmount) : null,
    maxUses: maxUses != null ? Number(maxUses) : null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  }).returning();

  await writeAuditLog({ req, action: "coupon.create", resource: "coupon", resourceId: coupon.id, metadata: { code } });
  res.status(201).json(coupon);
});

// GET /api/dashboard/coupons/redemptions — all redemptions for this shop (optional ?code= filter)
router.get("/coupons/redemptions", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const { code } = req.query as { code?: string };

  const conditions = [eq(orders.shopId, shop.id), eq(orders.tenantId, tenantId)];
  if (code && code.trim()) {
    conditions.push(eq(sql`UPPER(${coupons.code})`, code.trim().toUpperCase()));
  }

  const redemptions = await db
    .select({
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      orderDate: orders.createdAt,
      discountAmount: orders.discountAmount,
      couponCode: coupons.code,
      couponId: coupons.id,
    })
    .from(orders)
    .innerJoin(coupons, eq(orders.couponId, coupons.id))
    .where(and(...conditions))
    .orderBy(desc(orders.createdAt));

  res.json({ redemptions });
});

// GET /api/dashboard/coupons/:id/redemptions
router.get("/coupons/:id/redemptions", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [existing] = await db.select().from(coupons).where(and(eq(coupons.id, id), eq(coupons.shopId, shop.id)));
  if (!existing) { res.status(404).json({ error: "Coupon not found" }); return; }

  const redemptions = await db
    .select({
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      orderDate: orders.createdAt,
      discountAmount: orders.discountAmount,
    })
    .from(orders)
    .where(and(eq(orders.couponId, id), eq(orders.shopId, shop.id), eq(orders.tenantId, tenantId)))
    .orderBy(desc(orders.createdAt));

  res.json({ redemptions });
});

// PUT /api/dashboard/coupons/:id
router.put("/coupons/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [existing] = await db.select().from(coupons).where(and(eq(coupons.id, id), eq(coupons.shopId, shop.id)));
  if (!existing) { res.status(404).json({ error: "Coupon not found" }); return; }

  const { isActive, expiresAt } = req.body as { isActive?: boolean; expiresAt?: string | null };

  const updates: Partial<typeof coupons.$inferInsert> = {};
  if (isActive !== undefined) updates.isActive = Boolean(isActive);
  if ("expiresAt" in req.body) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;

  const [updated] = await db.update(coupons).set(updates).where(eq(coupons.id, id)).returning();
  await writeAuditLog({ req, action: "coupon.update", resource: "coupon", resourceId: id, metadata: { isActive: updates.isActive, expiresAt: updates.expiresAt } });
  res.json(updated);
});

// DELETE /api/dashboard/coupons/:id
router.delete("/coupons/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [existing] = await db.select().from(coupons).where(and(eq(coupons.id, id), eq(coupons.shopId, shop.id)));
  if (!existing) { res.status(404).json({ error: "Coupon not found" }); return; }

  await db.delete(coupons).where(eq(coupons.id, id));
  await writeAuditLog({ req, action: "coupon.delete", resource: "coupon", resourceId: id, metadata: { code: existing.code } });
  res.json({ message: "Coupon deleted" });
});

// GET /api/dashboard/store-categories
router.get("/store-categories", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const cats = await db
    .select()
    .from(shopStoreCategories)
    .where(eq(shopStoreCategories.shopId, shop.id))
    .orderBy(asc(shopStoreCategories.sortOrder), asc(shopStoreCategories.createdAt));

  const productCounts = await db
    .select({
      storeCategory: products.storeCategory,
      total: count(),
    })
    .from(products)
    .where(and(eq(products.shopId, shop.id), eq(products.isActive, true)))
    .groupBy(products.storeCategory);

  const countMap: Record<string, number> = {};
  for (const row of productCounts) {
    if (row.storeCategory) countMap[row.storeCategory] = Number(row.total);
  }

  res.json({
    categories: cats.map((c) => ({
      ...c,
      productCount: countMap[c.name] ?? 0,
    })),
  });
});

// POST /api/dashboard/store-categories
router.post("/store-categories", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const { name } = req.body as { name: string };
  if (!name?.trim()) { res.status(400).json({ error: "name is required" }); return; }

  const [cat] = await db.insert(shopStoreCategories).values({
    tenantId,
    shopId: shop.id,
    name: name.trim(),
  }).returning();

  await writeAuditLog({ req, action: "store_category.create", resource: "store_category", resourceId: cat.id, metadata: { name } });
  res.status(201).json({ ...cat, productCount: 0 });
});

// PUT /api/dashboard/store-categories/:id
router.put("/store-categories/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [existing] = await db.select().from(shopStoreCategories).where(and(eq(shopStoreCategories.id, id), eq(shopStoreCategories.shopId, shop.id)));
  if (!existing) { res.status(404).json({ error: "Category not found" }); return; }

  const { isVisible, sortOrder } = req.body as { isVisible?: boolean; sortOrder?: number };
  const updates: Partial<typeof shopStoreCategories.$inferInsert> = {};
  if (isVisible !== undefined) updates.isVisible = isVisible;
  if (sortOrder !== undefined) updates.sortOrder = Number(sortOrder);

  const [updated] = await db.update(shopStoreCategories).set(updates).where(eq(shopStoreCategories.id, id)).returning();
  res.json({ ...updated, productCount: 0 });
});

// DELETE /api/dashboard/store-categories/:id
router.delete("/store-categories/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const id = String(req.params.id);

  const shop = await getMerchantShop(tenantId);
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const [existing] = await db.select().from(shopStoreCategories).where(and(eq(shopStoreCategories.id, id), eq(shopStoreCategories.shopId, shop.id)));
  if (!existing) { res.status(404).json({ error: "Category not found" }); return; }

  await db.delete(shopStoreCategories).where(eq(shopStoreCategories.id, id));
  await writeAuditLog({ req, action: "store_category.delete", resource: "store_category", resourceId: id, metadata: { name: existing.name } });
  res.json({ message: "Category deleted" });
});

export default router;
