import { Router, type IRouter, type Request, type Response } from "express";
import { db, coupons, eq, and, sql } from "@workspace/db";

const router: IRouter = Router();

// POST /api/coupons/validate
// Public — no auth required. Validates a coupon code and returns discount info.
// shopId is optional — if omitted, matches the first active coupon across all shops.
// Redemption (incrementing usedCount) is handled atomically inside POST /api/orders/checkout.
router.post("/coupons/validate", async (req: Request, res: Response): Promise<void> => {
  const { code, shopId, orderAmount } = req.body as {
    code?: string;
    shopId?: string;
    orderAmount?: number;
  };

  if (!code) {
    res.status(400).json({ error: "code is required" });
    return;
  }
  if (typeof orderAmount !== "number" || orderAmount < 0) {
    res.status(400).json({ error: "orderAmount must be a non-negative number" });
    return;
  }

  const uppercaseCode = code.trim().toUpperCase();

  const whereClause = shopId
    ? and(eq(coupons.shopId, shopId), eq(sql`UPPER(${coupons.code})`, uppercaseCode), eq(coupons.isActive, true))
    : and(eq(sql`UPPER(${coupons.code})`, uppercaseCode), eq(coupons.isActive, true));

  const [coupon] = await db
    .select()
    .from(coupons)
    .where(whereClause)
    .limit(1);

  if (!coupon) {
    res.status(404).json({ error: "Invalid coupon code" });
    return;
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    res.status(400).json({ error: "This coupon has expired" });
    return;
  }

  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    res.status(400).json({ error: "This coupon has reached its maximum uses" });
    return;
  }

  if (coupon.minOrderAmount != null && orderAmount < coupon.minOrderAmount) {
    res.status(400).json({
      error: `Minimum order amount for this coupon is ¥${coupon.minOrderAmount.toLocaleString()}`,
    });
    return;
  }

  let discountAmount: number;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
  } else {
    discountAmount = Math.min(coupon.discountValue, orderAmount);
  }

  res.json({
    coupon: {
      id: coupon.id,
      code: coupon.code,
      shopId: coupon.shopId,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
    },
    discountAmount,
    finalAmount: orderAmount - discountAmount,
  });
});

export default router;
