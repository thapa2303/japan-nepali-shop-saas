import { Router, type IRouter } from "express";
import { db, users, eq } from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";

const router: IRouter = Router();

router.get("/account", authenticate, async (req, res): Promise<void> => {
  const [user] = await db.select({ id: users.id, email: users.email, name: users.name, phone: users.phone, createdAt: users.createdAt }).from(users).where(eq(users.id, req.user!.id));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

router.put("/account", authenticate, async (req, res): Promise<void> => {
  const { name, phone } = req.body as { name?: string; phone?: string };
  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No updates" }); return; }
  const [updated] = await db.update(users).set(updates as Partial<typeof users.$inferInsert>).where(eq(users.id, req.user!.id)).returning();
  res.json(updated);
});

export default router;
