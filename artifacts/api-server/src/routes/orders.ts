import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  orders,
  orderItems,
  coupons,
  users,
  eq,
  and,
  desc,
  sql,
} from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";

const router: IRouter = Router();

// GET /api/orders/:id — fetch a single order (customer-scoped)
router.get("/orders/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, String(req.params.id)), eq(orders.customerId, userId)));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  res.json({ ...order, items });
});

// GET /api/orders — list customer orders
router.get("/orders", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(20);
  res.json({ orders: rows });
});

// POST /api/orders/checkout
// Atomic: validate coupon → create order → increment coupon usedCount — all in one transaction.
// If any step fails the whole transaction rolls back and the user sees the error.
router.post("/orders/checkout", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const {
    couponId,
    subtotal: rawSubtotal,
    customerName: rawName,
    customerPhone = "N/A",
    deliveryAddress = "TBD",
    paymentMethod = "cod",
  } = req.body as {
    couponId?: string;
    subtotal?: number;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    paymentMethod?: "cod" | "paypay" | "credit-card" | "bank-transfer";
  };

  const subtotal = typeof rawSubtotal === "number" && rawSubtotal >= 0 ? rawSubtotal : 0;

  // Fetch user for customerName fallback
  const [user] = await db.select({ email: users.email, name: users.name }).from(users).where(eq(users.id, userId));
  const customerName = rawName || user?.name || user?.email?.split("@")[0] || "Customer";

  // We need a tenantId + shopId for the order row (both NOT NULL).
  // These come from the coupon if one is applied, or from the user's tenant otherwise.
  let tenantId: string | null = null;
  let shopId: string | null = null;
  let discountAmount = 0;
  let resolvedCouponId: string | null = null;

  await db.transaction(async (tx) => {
    if (couponId) {
      // Re-validate inside the transaction for race-condition safety
      const [coupon] = await tx.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);

      if (!coupon || !coupon.isActive) {
        throw Object.assign(new Error("Coupon not found or inactive"), { status: 404 });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        throw Object.assign(new Error("This coupon has expired"), { status: 400 });
      }
      if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
        throw Object.assign(new Error("This coupon has reached its maximum uses"), { status: 400 });
      }
      if (coupon.minOrderAmount != null && subtotal < coupon.minOrderAmount) {
        throw Object.assign(
          new Error(`Minimum order amount for this coupon is ¥${coupon.minOrderAmount.toLocaleString()}`),
          { status: 400 }
        );
      }

      // Calculate discount
      if (coupon.discountType === "percentage") {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      } else {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      }

      tenantId = coupon.tenantId;
      shopId = coupon.shopId;
      resolvedCouponId = coupon.id;
    }

    // Fallback: look up the user's primary tenant/shop if no coupon provided
    if (!tenantId || !shopId) {
      const shopRow = await tx
        .execute(sql`SELECT id, tenant_id FROM shops WHERE is_active = true LIMIT 1`);
      const row = (shopRow.rows as Array<{ id: string; tenant_id: string }>)[0];
      if (!row) {
        throw Object.assign(new Error("No active shop available for checkout"), { status: 400 });
      }
      tenantId = row.tenant_id;
      shopId = row.id;
    }

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const total = Math.max(0, subtotal - discountAmount);

    const [newOrder] = await tx
      .insert(orders)
      .values({
        orderNumber,
        tenantId: tenantId!,
        shopId: shopId!,
        customerId: userId,
        customerName,
        customerPhone,
        deliveryAddress,
        subtotal,
        deliveryFee: 0,
        total,
        paymentMethod: (paymentMethod ?? "cod") as "cod" | "paypay" | "credit-card" | "bank-transfer",
        // @ts-expect-error — column added via SQL migration, not yet in Drizzle schema
        couponId: resolvedCouponId,
        // @ts-expect-error — column added via SQL migration, not yet in Drizzle schema
        discountAmount,
      })
      .returning();

    // Atomically increment coupon usedCount
    if (resolvedCouponId) {
      await tx
        .update(coupons)
        .set({ usedCount: sql`${coupons.usedCount} + 1` })
        .where(eq(coupons.id, resolvedCouponId));
    }

    res.status(201).json({
      order: newOrder,
      discountAmount,
      couponId: resolvedCouponId,
    });
  });
});

export default router;
