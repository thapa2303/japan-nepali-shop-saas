import { Router, type IRouter } from "express";
import { db, shops, eq, and, desc, sql, count } from "@workspace/db";

const router: IRouter = Router();

router.get("/shops", async (req, res): Promise<void> => {
  const { category, location, page = "1", limit = "12" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, parseInt(limit) || 12);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(shops.isActive, true)];
  if (category) conditions.push(eq(shops.category, category as typeof shops.$inferSelect["category"]));

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(shops).where(and(...conditions)).orderBy(desc(shops.createdAt)).limit(limitNum).offset(offset),
    db.select({ total: count() }).from(shops).where(and(...conditions)),
  ]);

  res.json({ shops: rows, pagination: { page: pageNum, limit: limitNum, total: Number(total), pages: Math.ceil(Number(total) / limitNum) } });
});

router.get("/shops/:slug", async (req, res): Promise<void> => {
  const [shop] = await db.select().from(shops).where(eq(shops.slug, req.params.slug));
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }
  res.json(shop);
});

export default router;
