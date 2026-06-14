import { Router, type IRouter } from "express";
import { db, products, shops, eq, and, ilike, or, desc } from "@workspace/db";

const router: IRouter = Router();

router.get("/search", async (req, res): Promise<void> => {
  const { q = "", type = "all" } = req.query as Record<string, string>;
  if (!q) { res.json({ shops: [], products: [] }); return; }

  const pattern = `%${q}%`;

  const [shopResults, productResults] = await Promise.all([
    type !== "products"
      ? db.select().from(shops).where(and(eq(shops.isActive, true), or(ilike(shops.name, pattern), ilike(shops.nameNepali ?? "", pattern))!)).limit(10)
      : Promise.resolve([]),
    type !== "shops"
      ? db.select().from(products).where(and(eq(products.isActive, true), or(ilike(products.name, pattern), ilike(products.description, pattern))!)).limit(20)
      : Promise.resolve([]),
  ]);

  res.json({ shops: shopResults, products: productResults });
});

export default router;
