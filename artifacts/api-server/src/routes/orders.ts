import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  orders,
  orderItems,
  coupons,
  users,
  shops,
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
// shopId MUST be supplied by the client and verified server-side (tenantId is always derived from
// the DB shop row — the client never provides tenantId).
// NOTE: subtotal is currently client-supplied because the server-side cart is a stub.  Once a
// real server-side cart is implemented this should be replaced by summing cart items in the DB.
router.post("/orders/checkout", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const {
    shopId,
    couponId,
    subtotal: rawSubtotal,
    customerName: rawName,
    customerPhone = "N/A",
    deliveryAddress = "TBD",
    paymentMethod = "cod",
  } = req.body as {
    shopId?: string;
    couponId?: string;
    subtotal?: number;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    paymentMethod?: "cod" | "paypay" | "credit-card" | "bank-transfer";
  };

  // shopId is required — the client must tell us which shop this order is for.
  if (!shopId) {
    res.status(400).json({ error: "shopId is required" });
    return;
  }

  // subtotal must be a positive integer (yen)
  if (typeof rawSubtotal !== "number" || rawSubtotal < 0 || rawSubtotal > 10_000_000) {
    res.status(400).json({ error: "subtotal must be a non-negative number up to ¥10,000,000" });
    return;
  }
  const subtotal = Math.round(rawSubtotal);

  // Verify the shop exists server-side and retrieve its tenantId — client never supplies tenantId.
  const [shop] = await db
    .select({ id: shops.id, tenantId: shops.tenantId, isActive: shops.isActive })
    .from(shops)
    .where(eq(shops.id, shopId))
    .limit(1);

  if (!shop || !shop.isActive) {
    res.status(404).json({ error: "Shop not found or inactive" });
    return;
  }

  // Fetch user for customerName fallback
  const [user] = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId));
  const customerName = rawName || user?.name || user?.email?.split("@")[0] || "Customer";

  let discountAmount = 0;
  let resolvedCouponId: string | null = null;

  try {
    await db.transaction(async (tx) => {
      if (couponId) {
        // Re-validate inside the transaction for race-condition safety
        const [coupon] = await tx.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);

        if (!coupon || !coupon.isActive) {
          throw Object.assign(new Error("Coupon not found or inactive"), { status: 404 });
        }

        // Enforce that the coupon belongs to the shop being ordered from — prevents cross-shop coupon abuse
        if (coupon.shopId !== shopId) {
          throw Object.assign(
            new Error("This coupon is not valid for the selected shop"),
            { status: 400 }
          );
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

        if (coupon.discountType === "percentage") {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }

        resolvedCouponId = coupon.id;
      }

      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const total = Math.max(0, subtotal - discountAmount);

      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          tenantId: shop.tenantId,
          shopId: shop.id,
          customerId: userId,
          customerName,
          customerPhone,
          deliveryAddress,
          subtotal,
          deliveryFee: 0,
          total,
          paymentMethod: (paymentMethod ?? "cod") as "cod" | "paypay" | "credit-card" | "bank-transfer",
          couponId: resolvedCouponId,
          discountAmount,
        })
        .returning();

      // Atomically increment coupon usedCount using SQL expression (safe under concurrency)
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
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status ?? 500).json({ error: e.message ?? "Checkout failed" });
  }
});

export default router;
