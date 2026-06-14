import { Router, type IRouter } from "express";
import {
  db,
  shops,
  shopLocations,
  shopOpeningHours,
  eq,
  and,
  ilike,
  desc,
  sql,
  count,
  or,
} from "@workspace/db";

const router: IRouter = Router();

// GET /api/shops — public listing with filters: category, prefecture, search, featured
router.get("/shops", async (req, res): Promise<void> => {
  const {
    category,
    prefecture,
    search,
    featured,
    page = "1",
    limit = "12",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, parseInt(limit) || 12);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(shops.isActive, true)];
  if (category) {
    conditions.push(
      eq(shops.category, category as typeof shops.$inferSelect["category"]),
    );
  }

  if (featured === "true") {
    conditions.push(eq(shops.featured, true));
  }

  if (search) {
    conditions.push(
      or(
        ilike(shops.name, `%${search}%`),
        ilike(shops.nameNepali ?? shops.name, `%${search}%`),
        ilike(shops.description, `%${search}%`),
      )!,
    );
  }

  if (prefecture) {
    const shopIdsInPrefecture = db
      .select({ shopId: shopLocations.shopId })
      .from(shopLocations)
      .where(ilike(shopLocations.prefecture, `%${prefecture}%`));

    conditions.push(sql`${shops.id} IN (${shopIdsInPrefecture})`);
  }

  const where = and(...conditions);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        shop: shops,
        location: shopLocations,
      })
      .from(shops)
      .leftJoin(shopLocations, eq(shopLocations.shopId, shops.id))
      .where(where)
      .orderBy(desc(shops.featured), desc(shops.createdAt))
      .limit(limitNum)
      .offset(offset),
    db.select({ total: count() }).from(shops).where(where),
  ]);

  res.json({
    shops: rows.map(({ shop, location }) => ({ ...shop, location: location ?? null })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: Number(total),
      pages: Math.ceil(Number(total) / limitNum),
    },
  });
});

// GET /api/shops/:slug — shop detail with location and opening hours
router.get("/shops/:slug", async (req, res): Promise<void> => {
  const [shop] = await db
    .select()
    .from(shops)
    .where(eq(shops.slug, req.params.slug));

  if (!shop) {
    res.status(404).json({ error: "Shop not found" });
    return;
  }

  const [location, openingHours] = await Promise.all([
    db
      .select()
      .from(shopLocations)
      .where(eq(shopLocations.shopId, shop.id))
      .then((rows) => rows[0] ?? null),
    db
      .select()
      .from(shopOpeningHours)
      .where(eq(shopOpeningHours.shopId, shop.id)),
  ]);

  res.json({ ...shop, location, openingHours });
});

export default router;
