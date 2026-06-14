import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  orders,
  orderItems,
  coupons,
  users,
  shops,
  products,
  carts,
  cartItems,
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
// Atomic: resolve shopId → validate coupon → create order → increment coupon usedCount
//
// shopId resolution priority (server-side, not blindly trusting client):
//   1. Cart items  — if the user has items in DB, derive shopId from them
//                    (enforces single-shop invariant: all items must share one shop)
//   2. Coupon      — if coupon provided and cart is empty, use coupon.shopId
//   3. body.shopId — explicit fallback for empty-cart / coupon-free checkout
//
// NOTE: subtotal is currently client-supplied because the cart is a stub with no price data.
// Once products are added to cart items with price, compute it server-side from cart rows.
router.post(
  "/orders/checkout",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const {
      shopId: bodyShopId,
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

    // Validate subtotal (used as fallback only — server-side cart items take priority)
    if (typeof rawSubtotal !== "number" || rawSubtotal < 0 || rawSubtotal > 10_000_000) {
      res
        .status(400)
        .json({ error: "subtotal must be a non-negative number up to ¥10,000,000" });
      return;
    }
    let subtotal = Math.round(rawSubtotal);

    // ── Resolve shopId and fetch cart items ───────────────────────────────────
    // Priority 1: derive from user's DB cart items (authoritative, single-shop invariant)
    let resolvedShopId: string | null = null;

    type CartLineItem = {
      id: string;
      productId: string;
      quantity: number;
      price: number;
      name: string;
    };
    let cartLineItems: CartLineItem[] = [];
    let cartId: string | null = null;

    const userCart = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (userCart.length > 0) {
      cartId = userCart[0].id;
      const cartRows = await db
        .select({
          id: cartItems.id,
          shopId: cartItems.shopId,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          price: products.price,
          name: products.name,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.cartId, cartId));

      const shopIds = [...new Set(cartRows.map((r) => r.shopId))];
      if (shopIds.length > 1) {
        res.status(400).json({
          error: "Your cart contains items from multiple shops. Please checkout one shop at a time.",
        });
        return;
      }
      if (shopIds.length === 1) {
        resolvedShopId = shopIds[0];
        cartLineItems = cartRows.map((r) => ({
          id: r.id,
          productId: r.productId,
          quantity: r.quantity,
          price: r.price,
          name: r.name,
        }));
        // Compute server-side subtotal from actual cart prices
        subtotal = cartLineItems.reduce((s, item) => s + item.price * item.quantity, 0);
      }
    }

    // Priority 2: explicit body.shopId
    // Always apply when provided — including alongside a coupon so we can enforce
    // coupon.shopId === body.shopId inside the transaction.
    if (!resolvedShopId && bodyShopId) {
      resolvedShopId = bodyShopId;
    }

    // If we still have no shopId and no coupon, we can't proceed
    if (!resolvedShopId && !couponId) {
      res.status(400).json({
        error:
          "Unable to determine which shop to order from. Add items to your cart or select a shop.",
      });
      return;
    }

    // Verify the resolved shop exists and is active (server-side, not trusting client)
    let shop: { id: string; tenantId: string; isActive: boolean } | null = null;
    if (resolvedShopId) {
      const [row] = await db
        .select({ id: shops.id, tenantId: shops.tenantId, isActive: shops.isActive })
        .from(shops)
        .where(eq(shops.id, resolvedShopId))
        .limit(1);
      if (!row || !row.isActive) {
        res.status(404).json({ error: "Shop not found or inactive" });
        return;
      }
      shop = row;
    }

    // Fetch user for customerName fallback
    const [user] = await db
      .select({ email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId));
    const customerName =
      rawName || user?.name || user?.email?.split("@")[0] || "Customer";

    let discountAmount = 0;
    let resolvedCouponId: string | null = null;

    try {
      await db.transaction(async (tx) => {
        if (couponId) {
          const [coupon] = await tx
            .select()
            .from(coupons)
            .where(eq(coupons.id, couponId))
            .limit(1);

          if (!coupon || !coupon.isActive) {
            throw Object.assign(new Error("Coupon not found or inactive"), { status: 404 });
          }

          // If shopId was already resolved from cart items, ensure the coupon belongs to it
          if (resolvedShopId && coupon.shopId !== resolvedShopId) {
            throw Object.assign(
              new Error("This coupon is not valid for the selected shop"),
              { status: 400 }
            );
          }

          // Priority 2: use coupon's shop when cart is empty
          if (!resolvedShopId) {
            const [couponShop] = await tx
              .select({ id: shops.id, tenantId: shops.tenantId, isActive: shops.isActive })
              .from(shops)
              .where(eq(shops.id, coupon.shopId))
              .limit(1);
            if (!couponShop || !couponShop.isActive) {
              throw Object.assign(new Error("Coupon's shop is not active"), { status: 400 });
            }
            resolvedShopId = couponShop.id;
            shop = couponShop;
          }

          if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            throw Object.assign(new Error("This coupon has expired"), { status: 400 });
          }
          if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
            throw Object.assign(
              new Error("This coupon has reached its maximum uses"),
              { status: 400 }
            );
          }
          if (coupon.minOrderAmount != null && subtotal < coupon.minOrderAmount) {
            throw Object.assign(
              new Error(
                `Minimum order amount for this coupon is ¥${coupon.minOrderAmount.toLocaleString()}`
              ),
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

        if (!shop || !resolvedShopId) {
          throw Object.assign(new Error("Unable to determine shop for this order"), { status: 400 });
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
            paymentMethod: (paymentMethod ?? "cod") as
              | "cod"
              | "paypay"
              | "credit-card"
              | "bank-transfer",
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

        // Create order_items from cart line items
        if (cartLineItems.length > 0) {
          await tx.insert(orderItems).values(
            cartLineItems.map((item) => ({
              orderId: newOrder.id,
              productId: item.productId,
              productName: item.name,
              variantName: null,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            }))
          );
        }

        // Clear the cart after successful order
        if (cartId) {
          await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
        }

        res.status(201).json({
          order: newOrder,
          discountAmount,
          couponId: resolvedCouponId,
        });
      });
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (!res.headersSent) {
        res.status(e.status ?? 500).json({ error: e.message ?? "Checkout failed" });
      }
    }
  }
);

export default router;
