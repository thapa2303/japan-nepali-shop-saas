import { Router, type IRouter } from "express";
import { db, products, shops, shopStoreCategories, eq, and, desc, count, asc } from "@workspace/db";

const router: IRouter = Router();

router.get("/shops/:shopSlug/store-categories", async (req, res): Promise<void> => {
  const [shop] = await db.select().from(shops).where(eq(shops.slug, req.params.shopSlug));
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const cats = await db
    .select()
    .from(shopStoreCategories)
    .where(and(eq(shopStoreCategories.shopId, shop.id), eq(shopStoreCategories.isVisible, true)))
    .orderBy(asc(shopStoreCategories.sortOrder), asc(shopStoreCategories.createdAt));

  const productCounts = await db
    .select({ storeCategory: products.storeCategory, total: count() })
    .from(products)
    .where(and(eq(products.shopId, shop.id), eq(products.isActive, true)))
    .groupBy(products.storeCategory);

  const countMap: Record<string, number> = {};
  for (const row of productCounts) {
    if (row.storeCategory) countMap[row.storeCategory] = Number(row.total);
  }

  res.json({
    categories: cats.map((c) => ({ ...c, productCount: countMap[c.name] ?? 0 })),
  });
});

router.get("/shops/:shopSlug/products", async (req, res): Promise<void> => {
  const [shop] = await db.select().from(shops).where(eq(shops.slug, req.params.shopSlug));
  if (!shop) { res.status(404).json({ error: "Shop not found" }); return; }

  const { page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(products).where(and(eq(products.shopId, shop.id), eq(products.isActive, true))).orderBy(desc(products.createdAt)).limit(limitNum).offset(offset),
    db.select({ total: count() }).from(products).where(and(eq(products.shopId, shop.id), eq(products.isActive, true))),
  ]);

  res.json({ products: rows, pagination: { page: pageNum, limit: limitNum, total: Number(total), pages: Math.ceil(Number(total) / limitNum) } });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const [product] = await db.select().from(products).where(and(eq(products.id, req.params.id), eq(products.isActive, true)));
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(product);
});

export default router;
