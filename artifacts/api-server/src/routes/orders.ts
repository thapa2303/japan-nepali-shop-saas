import { Router, type IRouter } from "express";
import { db, orders, orderItems, eq, and, desc } from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";

const router: IRouter = Router();

router.get("/orders/:id", authenticate, async (req, res): Promise<void> => {
  const userId = req.user!.id;
  const [order] = await db.select().from(orders).where(and(eq(orders.id, String(req.params.id)), eq(orders.customerId, userId)));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  res.json({ ...order, items });
});

router.get("/orders", authenticate, async (req, res): Promise<void> => {
  const userId = req.user!.id;
  const rows = await db.select().from(orders).where(eq(orders.customerId, userId)).orderBy(desc(orders.createdAt)).limit(20);
  res.json({ orders: rows });
});

export default router;
