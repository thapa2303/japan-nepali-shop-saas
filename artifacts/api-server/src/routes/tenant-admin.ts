import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  users,
  shops,
  products,
  orders,
  eq,
  and,
  desc,
  count,
  sum,
  ilike,
  or,
  sql,
} from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router: IRouter = Router();
const AUTH = [authenticate, authorize("TENANT_ADMIN")] as const;

// GET /api/admin/customers - customers who have ordered from this tenant's shops
router.get("/customers", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }
  const { q, page = "1", limit = "20" } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const shopRows = await db
    .select({ id: shops.id })
    .from(shops)
    .where(eq(shops.tenantId, tenantId));
  const shopIds = shopRows.map((s) => s.id);

  if (shopIds.length === 0) {
    res.json({ customers: [], pagination: { page: pageNum, limit: limitNum, total: 0, pages: 0 } });
    return;
  }

  const shopIdList = shopIds.map((id) => `'${id}'`).join(",");

  const customerRows = await db
    .select({ customerId: orders.customerId })
    .from(orders)
    .where(sql`${orders.shopId} = ANY(ARRAY[${sql.raw(shopIdList)}]::uuid[])`)
    .groupBy(orders.customerId);

  const customerIds = customerRows.map((r) => r.customerId).filter(Boolean) as string[];

  if (customerIds.length === 0) {
    res.json({ customers: [], pagination: { page: pageNum, limit: limitNum, total: 0, pages: 0 } });
    return;
  }

  const customerIdList = customerIds.map((id) => `'${id}'`).join(",");
  const baseWhere = sql`${users.id} = ANY(ARRAY[${sql.raw(customerIdList)}]::uuid[])`;

  const customerList = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .where(
      q
        ? and(baseWhere, or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`))!)
        : baseWhere
    )
    .orderBy(desc(users.createdAt))
    .limit(limitNum)
    .offset(offset);

  res.json({
    customers: customerList,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: customerIds.length,
      pages: Math.ceil(customerIds.length / limitNum),
    },
  });
});

// GET /api/admin/overview
router.get("/overview", ...AUTH, async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) { res.status(403).json({ error: "No tenant" }); return; }

  const shopList = await db
    .select({ id: shops.id })
    .from(shops)
    .where(eq(shops.tenantId, tenantId));
  const shopIds = shopList.map((s) => s.id);

  const [productCount, orderStats] = await Promise.all([
    db
      .select({ total: count() })
      .from(products)
      .where(and(eq(products.tenantId, tenantId), eq(products.isActive, true))),
    shopIds.length > 0
      ? db
          .select({ total: count(), revenue: sum(orders.total) })
          .from(orders)
          .where(sql`${orders.shopId} = ANY(ARRAY[${sql.raw(shopIds.map((id) => `'${id}'`).join(","))}]::uuid[])`)
      : Promise.resolve([{ total: 0, revenue: 0 }]),
  ]);

  const orderResult = orderStats[0] ?? { total: 0, revenue: 0 };
  res.json({
    shopCount: shopList.length,
    productCount: Number(productCount[0]?.total ?? 0),
    orderCount: Number(orderResult.total),
    revenue: Number(orderResult.revenue ?? 0),
  });
});

export default router;
