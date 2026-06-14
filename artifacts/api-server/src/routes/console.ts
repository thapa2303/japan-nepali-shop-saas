import { Router, type IRouter, type Request, type Response } from "express";
import bcryptHash from "bcryptjs";
import {
  db,
  users,
  roles,
  userRoles,
  tenants,
  shops,
  orders,
  products,
  auditLogs,
  eq,
  and,
  desc,
  sql,
  count,
  sum,
  or,
  ilike,
} from "@workspace/db";
import { authenticate, signToken } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { writeAuditLog } from "../lib/audit.js";
import { getAllPlans } from "../lib/plan-limits.js";

const router: IRouter = Router();
const AUTH = [authenticate, authorize("PSA")] as const;

// GET /api/console/tenants
router.get("/tenants", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const { q, status, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const statusFilter = status
    ? eq(tenants.status, status as typeof tenants.$inferSelect["status"])
    : undefined;

  const tenantList = await db
    .select()
    .from(tenants)
    .where(statusFilter)
    .orderBy(desc(tenants.createdAt))
    .limit(limitNum)
    .offset(offset);

  const tenantIds = tenantList.map((t) => t.id);

  const [shopCounts, orderCounts, productCounts, userCounts] = await Promise.all([
    tenantIds.length
      ? db.select({ tenantId: shops.tenantId, cnt: count() }).from(shops).where(sql`${shops.tenantId} = ANY(ARRAY[${sql.raw(tenantIds.map((id) => `'${id}'`).join(","))}]::uuid[])`).groupBy(shops.tenantId)
      : Promise.resolve([]),
    tenantIds.length
      ? db.select({ tenantId: orders.tenantId, total: count(), revenue: sum(orders.total) }).from(orders).where(sql`${orders.tenantId} = ANY(ARRAY[${sql.raw(tenantIds.map((id) => `'${id}'`).join(","))}]::uuid[])`).groupBy(orders.tenantId)
      : Promise.resolve([]),
    tenantIds.length
      ? db.select({ tenantId: products.tenantId, cnt: count() }).from(products).where(and(sql`${products.tenantId} = ANY(ARRAY[${sql.raw(tenantIds.map((id) => `'${id}'`).join(","))}]::uuid[])`, eq(products.isActive, true))).groupBy(products.tenantId)
      : Promise.resolve([]),
    tenantIds.length
      ? db.select({ tenantId: users.tenantId, cnt: count() }).from(users).where(and(sql`${users.tenantId} = ANY(ARRAY[${sql.raw(tenantIds.map((id) => `'${id}'`).join(","))}]::uuid[])`, eq(users.isActive, true))).groupBy(users.tenantId)
      : Promise.resolve([]),
  ]);

  const shopMap: Record<string, number> = {};
  const orderMap: Record<string, { orders: number; revenue: number }> = {};
  const productMap: Record<string, number> = {};
  const userMap: Record<string, number> = {};

  for (const r of shopCounts) if (r.tenantId) shopMap[r.tenantId] = Number(r.cnt);
  for (const r of orderCounts) if (r.tenantId) orderMap[r.tenantId] = { orders: Number(r.total), revenue: Number(r.revenue ?? 0) };
  for (const r of productCounts) if (r.tenantId) productMap[r.tenantId] = Number(r.cnt);
  for (const r of userCounts) if (r.tenantId) userMap[r.tenantId] = Number(r.cnt);

  const allPlans = await getAllPlans();
  const planPriceMap: Record<string, number> = Object.fromEntries(allPlans.map((p) => [p.tier, p.monthlyPrice]));

  const result = tenantList.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    status: t.status,
    subscriptionTier: t.subscriptionTier,
    createdAt: t.createdAt,
    shopCount: shopMap[t.id] ?? 0,
    productCount: productMap[t.id] ?? 0,
    userCount: userMap[t.id] ?? 0,
    orderCount: orderMap[t.id]?.orders ?? 0,
    revenue: orderMap[t.id]?.revenue ?? 0,
    mrr: planPriceMap[t.subscriptionTier] ?? 0,
  }));

  res.json({ tenants: result, pagination: { page: pageNum, limit: limitNum } });
});

// GET /api/console/tenants/:id
router.get("/tenants/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
  if (!tenant) { res.status(404).json({ error: "Tenant not found" }); return; }

  const [shopCount, orderData, productCount, userCount] = await Promise.all([
    db.select({ cnt: count() }).from(shops).where(eq(shops.tenantId, id)).then(r => Number(r[0]?.cnt ?? 0)),
    db.select({ total: count(), revenue: sum(orders.total) }).from(orders).where(eq(orders.tenantId, id)).then(r => ({ orders: Number(r[0]?.total ?? 0), revenue: Number(r[0]?.revenue ?? 0) })),
    db.select({ cnt: count() }).from(products).where(and(eq(products.tenantId, id), eq(products.isActive, true))).then(r => Number(r[0]?.cnt ?? 0)),
    db.select({ cnt: count() }).from(users).where(and(eq(users.tenantId, id), eq(users.isActive, true))).then(r => Number(r[0]?.cnt ?? 0)),
  ]);

  const allPlans = await getAllPlans();
  const planPriceMap: Record<string, number> = Object.fromEntries(allPlans.map((p) => [p.tier, p.monthlyPrice]));

  res.json({
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    status: tenant.status,
    subscriptionTier: tenant.subscriptionTier,
    createdAt: tenant.createdAt,
    shopCount,
    productCount,
    userCount,
    orderCount: orderData.orders,
    revenue: orderData.revenue,
    mrr: planPriceMap[tenant.subscriptionTier] ?? 0,
  });
});

// POST /api/console/tenants
router.post("/tenants", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const { tenantName, tenantSlug, ownerName, ownerEmail, ownerPassword, subscriptionTier = "starter" } = req.body as {
    tenantName: string;
    tenantSlug: string;
    ownerName: string;
    ownerEmail: string;
    ownerPassword?: string;
    subscriptionTier?: string;
  };

  if (!tenantName || !tenantSlug || !ownerName || !ownerEmail) {
    res.status(400).json({ error: "tenantName, tenantSlug, ownerName, ownerEmail are required" });
    return;
  }

  const [existingTenant] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, tenantSlug));
  if (existingTenant) { res.status(409).json({ error: "Tenant slug already taken" }); return; }

  const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, ownerEmail.toLowerCase()));
  if (existingUser) { res.status(409).json({ error: "Owner email already registered" }); return; }

  const password = ownerPassword ?? Math.random().toString(36).slice(-10);
  const passwordHash = await bcryptHash.hash(password, 12);

  const [tenant] = await db.insert(tenants).values({
    name: tenantName,
    slug: tenantSlug,
    subscriptionTier: subscriptionTier as typeof tenants.$inferInsert["subscriptionTier"],
  }).returning();

  const [user] = await db.insert(users).values({
    tenantId: tenant.id,
    email: ownerEmail.toLowerCase(),
    passwordHash,
    name: ownerName,
  }).returning();

  const roleList = await db.select().from(roles).where(or(eq(roles.name, "MERCHANT"), eq(roles.name, "TENANT_ADMIN"))!);
  for (const role of roleList) {
    await db.insert(userRoles).values({ userId: user.id, roleId: role.id });
  }

  await writeAuditLog({ req, action: "tenant.create", resource: "tenant", resourceId: tenant.id, metadata: { tenantName, tenantSlug } });
  res.status(201).json({ tenant, user: { id: user.id, email: user.email, name: user.name }, tempPassword: !ownerPassword ? password : undefined });
});

// PUT /api/console/tenants/:id
router.put("/tenants/:id", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const { status, subscriptionTier } = req.body as { status?: string; subscriptionTier?: string };

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
  if (!tenant) { res.status(404).json({ error: "Tenant not found" }); return; }

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (subscriptionTier) updates.subscriptionTier = subscriptionTier;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No updates provided" });
    return;
  }

  const [updated] = await db
    .update(tenants)
    .set(updates as Partial<typeof tenants.$inferInsert>)
    .where(eq(tenants.id, id))
    .returning();

  const action = status === "suspended" ? "tenant.suspend" : status === "active" ? "tenant.activate" : "tenant.update";
  await writeAuditLog({ req, action, resource: "tenant", resourceId: id, metadata: updates });
  res.json(updated);
});

// POST /api/console/tenants/:id/enter
router.post("/tenants/:id/enter", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
  if (!tenant) { res.status(404).json({ error: "Tenant not found" }); return; }

  const [tenantAdmin] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(userRoles, eq(users.id, userRoles.userId))
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(and(eq(users.tenantId, id), eq(roles.name, "TENANT_ADMIN"), eq(users.isActive, true)));

  if (!tenantAdmin) { res.status(404).json({ error: "No tenant admin found for this tenant" }); return; }

  const token = signToken({
    sub: tenantAdmin.user.id,
    tenantId: id,
    roles: ["TENANT_ADMIN", "MERCHANT"],
  });

  await writeAuditLog({
    req,
    action: "tenant.enter",
    resource: "tenant",
    resourceId: id,
    metadata: { originalAdminId: req.user!.id },
  });

  res.json({ token, tenantId: id, tenantName: tenant.name });
});

// GET /api/console/analytics
router.get("/analytics", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const [tenantCount, orderStats, productCount, customerCount, tierStats] = await Promise.all([
    db.select({
      total: count(),
      active: sql<number>`count(*) filter (where ${tenants.status} = 'active')`,
      suspended: sql<number>`count(*) filter (where ${tenants.status} = 'suspended')`,
    }).from(tenants),
    db.select({
      total: count(),
      gmv: sum(orders.total),
    }).from(orders).where(sql`${orders.status} != 'cancelled'`),
    db.select({ total: count() }).from(products).where(eq(products.isActive, true)),
    db.select({ total: count() }).from(users).where(eq(users.isActive, true)),
    db
      .select({ tier: tenants.subscriptionTier, cnt: count() })
      .from(tenants)
      .groupBy(tenants.subscriptionTier),
  ]);

  const stats = tenantCount[0] ?? { total: 0, active: 0, suspended: 0 };
  const orderStat = orderStats[0] ?? { total: 0, gmv: 0 };

  const tierCounts: Record<string, number> = {};
  for (const t of tierStats) tierCounts[t.tier] = Number(t.cnt);

  const plans = await getAllPlans();
  const mrr = plans.reduce((s, p) => s + (tierCounts[p.tier] ?? 0) * p.monthlyPrice, 0);

  res.json({
    totalMerchants: Number(stats.total),
    activeMerchants: Number(stats.active),
    suspendedMerchants: Number(stats.suspended),
    totalOrders: Number(orderStat.total),
    gmv: Number(orderStat.gmv ?? 0),
    mrr,
    totalProducts: Number(productCount[0]?.total ?? 0),
    totalCustomers: Number(customerCount[0]?.total ?? 0),
    tierDistribution: Object.entries(tierCounts).map(([tier, merchants]) => ({ tier, merchants })),
  });
});

// GET /api/console/customers
router.get("/customers", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const { q, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const customerWhere = q
    ? and(eq(users.isActive, true), or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`)))
    : eq(users.isActive, true);

  const [customers, [{ total }]] = await Promise.all([
    db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
      tenantId: users.tenantId,
    }).from(users).where(customerWhere).orderBy(desc(users.createdAt)).limit(limitNum).offset(offset),
    db.select({ total: count() }).from(users).where(customerWhere),
  ]);

  const customerIds = customers.map((c) => c.id);
  const orderStats = customerIds.length
    ? await db
        .select({ customerId: orders.customerId, total: count(), revenue: sum(orders.total) })
        .from(orders)
        .where(sql`${orders.customerId} = ANY(ARRAY[${sql.raw(customerIds.map((id) => `'${id}'`).join(","))}]::uuid[])`)
        .groupBy(orders.customerId)
    : [];

  const orderMap: Record<string, { orders: number; revenue: number }> = {};
  for (const r of orderStats) if (r.customerId) orderMap[r.customerId] = { orders: Number(r.total), revenue: Number(r.revenue ?? 0) };

  res.json({
    customers: customers.map((c) => ({
      ...c,
      totalOrders: orderMap[c.id]?.orders ?? 0,
      totalSpent: orderMap[c.id]?.revenue ?? 0,
    })),
    pagination: { page: pageNum, limit: limitNum, total: Number(total), pages: Math.ceil(Number(total) / limitNum) },
  });
});

// GET /api/console/audit-logs
router.get("/audit-logs", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const { action, tenantId, page = "1", limit = "50" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(200, parseInt(limit) || 50);
  const offset = (pageNum - 1) * limitNum;

  const auditWhere = action && tenantId
    ? and(ilike(auditLogs.action, `%${action}%`), eq(auditLogs.tenantId, tenantId))
    : action
    ? ilike(auditLogs.action, `%${action}%`)
    : tenantId
    ? eq(auditLogs.tenantId, tenantId)
    : undefined;

  const [logs, [{ total }]] = await Promise.all([
    db
      .select()
      .from(auditLogs)
      .where(auditWhere)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limitNum)
      .offset(offset),
    db.select({ total: count() }).from(auditLogs).where(auditWhere),
  ]);

  res.json({
    logs: logs.map((l) => ({
      id: l.id,
      tenantId: l.tenantId,
      actorUserId: l.actorUserId,
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      metadata: l.newValue,
      ipAddress: l.ipAddress,
      createdAt: l.createdAt,
    })),
    pagination: { page: pageNum, limit: limitNum, total: Number(total), pages: Math.ceil(Number(total) / limitNum) },
  });
});

// GET /api/console/plans — list all subscription plans from the DB
router.get("/plans", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const plans = await getAllPlans();
  res.json({ plans });
});

export default router;
