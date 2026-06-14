import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  shops,
  shopLocations,
  shopOpeningHours,
  products,
  productImages,
  productVariants,
  tenants,
  eq,
  and,
  desc,
  count,
} from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { writeAuditLog } from "../lib/audit.js";
import { getPlanForTier } from "../lib/plan-limits.js";

const router: IRouter = Router();

const AUTH = [authenticate, authorize("MERCHANT")] as const;

async function getMerchantShop(tenantId: string) {
  const [shop] = await db
    .select()
    .from(shops)
    .where(and(eq(shops.tenantId, tenantId), eq(shops.isActive, true)));
  return shop ?? null;
}

// ─── Shop routes ──────────────────────────────────────────────────────────────

// POST /api/merchant/shops — create a new shop for this merchant's tenant
router.post(
  "/merchant/shops",
  ...AUTH,
  async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(403).json({ error: "No tenant" });
      return;
    }

    const existing = await getMerchantShop(tenantId);
    if (existing) {
      res.status(409).json({ error: "This tenant already has an active shop" });
      return;
    }

    const {
      slug,
      name,
      nameNepali,
      description,
      category,
      coverImage,
      logo,
      features,
      minOrder,
      deliveryFee,
      deliveryTime,
      contactPhone,
      contactWhatsapp,
      contactEmail,
      googleMapsUrl,
      onlineStoreUrl,
      location,
      openingHours,
    } = req.body as {
      slug: string;
      name: string;
      nameNepali?: string;
      description?: string;
      category: typeof shops.$inferInsert["category"];
      coverImage?: string;
      logo?: string;
      features?: typeof shops.$inferInsert["features"];
      minOrder?: number;
      deliveryFee?: number;
      deliveryTime?: string;
      contactPhone?: string;
      contactWhatsapp?: string;
      contactEmail?: string;
      googleMapsUrl?: string;
      onlineStoreUrl?: string;
      location?: {
        address?: string;
        area?: string;
        city?: string;
        prefecture?: string;
        postalCode?: string;
        lat?: number;
        lng?: number;
      };
      openingHours?: Array<{
        dayOfWeek: string;
        openTime?: string;
        closeTime?: string;
        isClosed?: boolean;
      }>;
    };

    if (!slug || !name || !category) {
      res.status(400).json({ error: "slug, name, and category are required" });
      return;
    }

    const [shop] = await db
      .insert(shops)
      .values({
        tenantId,
        slug,
        name,
        nameNepali: nameNepali ?? null,
        description: description ?? "",
        category,
        coverImage: coverImage ?? null,
        logo: logo ?? null,
        features: features ? [...features] : [],
        minOrder: minOrder != null ? Number(minOrder) : null,
        deliveryFee: deliveryFee != null ? Number(deliveryFee) : null,
        deliveryTime: deliveryTime ?? null,
        contactPhone: contactPhone ?? null,
        contactWhatsapp: contactWhatsapp ?? null,
        contactEmail: contactEmail ?? null,
        googleMapsUrl: googleMapsUrl ?? null,
        onlineStoreUrl: onlineStoreUrl ?? null,
      })
      .returning();

    if (location) {
      await db.insert(shopLocations).values({
        shopId: shop.id,
        address: location.address ?? null,
        area: location.area ?? null,
        city: location.city ?? null,
        prefecture: location.prefecture ?? null,
        postalCode: location.postalCode ?? null,
        lat: location.lat ?? null,
        lng: location.lng ?? null,
      });
    }

    if (openingHours && openingHours.length > 0) {
      await db.insert(shopOpeningHours).values(
        openingHours.map((h) => ({
          shopId: shop.id,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime ?? null,
          closeTime: h.closeTime ?? null,
          isClosed: h.isClosed ?? false,
        })),
      );
    }

    await writeAuditLog({
      req,
      action: "shop.create",
      resource: "shop",
      resourceId: shop.id,
      metadata: { slug, name },
    });

    res.status(201).json(shop);
  },
);

// PUT /api/merchant/shops/:id — update a shop (tenant-scoped)
router.put(
  "/merchant/shops/:id",
  ...AUTH,
  async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(403).json({ error: "No tenant" });
      return;
    }

    const id = String(req.params.id);
    const [existing] = await db
      .select()
      .from(shops)
      .where(and(eq(shops.id, id), eq(shops.tenantId, tenantId)));

    if (!existing) {
      res.status(404).json({ error: "Shop not found" });
      return;
    }

    const ALLOWED_SHOP_FIELDS = [
      "name",
      "nameNepali",
      "description",
      "category",
      "coverImage",
      "logo",
      "features",
      "minOrder",
      "deliveryFee",
      "deliveryTime",
      "contactPhone",
      "contactWhatsapp",
      "contactEmail",
      "googleMapsUrl",
      "onlineStoreUrl",
      "isOpen",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of ALLOWED_SHOP_FIELDS) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if (updates.features) updates.features = [...(updates.features as string[])];
    if (updates.minOrder != null) updates.minOrder = Number(updates.minOrder);
    if (updates.deliveryFee != null) updates.deliveryFee = Number(updates.deliveryFee);

    const [updated] = await db
      .update(shops)
      .set(updates as Partial<typeof shops.$inferInsert>)
      .where(eq(shops.id, id))
      .returning();

    // Update location if provided
    const { location, openingHours } = req.body as {
      location?: {
        address?: string;
        area?: string;
        city?: string;
        prefecture?: string;
        postalCode?: string;
        lat?: number;
        lng?: number;
      };
      openingHours?: Array<{
        dayOfWeek: string;
        openTime?: string;
        closeTime?: string;
        isClosed?: boolean;
      }>;
    };

    if (location !== undefined) {
      const [existingLoc] = await db
        .select({ id: shopLocations.id })
        .from(shopLocations)
        .where(eq(shopLocations.shopId, id));

      if (existingLoc) {
        await db
          .update(shopLocations)
          .set({
            address: location.address ?? null,
            area: location.area ?? null,
            city: location.city ?? null,
            prefecture: location.prefecture ?? null,
            postalCode: location.postalCode ?? null,
            lat: location.lat ?? null,
            lng: location.lng ?? null,
          })
          .where(eq(shopLocations.shopId, id));
      } else {
        await db.insert(shopLocations).values({
          shopId: id,
          address: location.address ?? null,
          area: location.area ?? null,
          city: location.city ?? null,
          prefecture: location.prefecture ?? null,
          postalCode: location.postalCode ?? null,
          lat: location.lat ?? null,
          lng: location.lng ?? null,
        });
      }
    }

    if (openingHours && openingHours.length > 0) {
      await db.delete(shopOpeningHours).where(eq(shopOpeningHours.shopId, id));
      await db.insert(shopOpeningHours).values(
        openingHours.map((h) => ({
          shopId: id,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime ?? null,
          closeTime: h.closeTime ?? null,
          isClosed: h.isClosed ?? false,
        })),
      );
    }

    await writeAuditLog({
      req,
      action: "shop.update",
      resource: "shop",
      resourceId: id,
      metadata: updates,
    });

    res.json(updated);
  },
);

// DELETE /api/merchant/shops/:id — soft-delete (deactivate) a shop
router.delete(
  "/merchant/shops/:id",
  ...AUTH,
  async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(403).json({ error: "No tenant" });
      return;
    }

    const id = String(req.params.id);
    const [existing] = await db
      .select()
      .from(shops)
      .where(and(eq(shops.id, id), eq(shops.tenantId, tenantId)));

    if (!existing) {
      res.status(404).json({ error: "Shop not found" });
      return;
    }

    await db.update(shops).set({ isActive: false }).where(eq(shops.id, id));

    await writeAuditLog({
      req,
      action: "shop.delete",
      resource: "shop",
      resourceId: id,
      metadata: { name: existing.name },
    });

    res.json({ message: "Shop deactivated" });
  },
);

// ─── Product routes ────────────────────────────────────────────────────────────

// POST /api/merchant/products — create a product (with plan limit check)
router.post(
  "/merchant/products",
  ...AUTH,
  async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(403).json({ error: "No tenant" });
      return;
    }

    const shop = await getMerchantShop(tenantId);
    if (!shop) {
      res.status(404).json({ error: "Shop not found" });
      return;
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId));
    const tier = tenant?.subscriptionTier ?? "starter";
    const limits = await getPlanForTier(tier);

    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(and(eq(products.tenantId, tenantId), eq(products.isActive, true)));

    if (Number(total) >= limits.productLimit) {
      res.status(403).json({
        error: `Plan limit reached. Your ${limits.name} plan allows up to ${limits.productLimit} products.`,
      });
      return;
    }

    const {
      name,
      nameNepali,
      description,
      price,
      compareAtPrice,
      category,
      browseCategory,
      storeCategory,
      inStock,
      stockCount,
      unit,
      featured,
      images,
      variants,
    } = req.body as {
      name: string;
      nameNepali?: string;
      description?: string;
      price: number;
      compareAtPrice?: number;
      category: string;
      browseCategory?: string;
      storeCategory?: string;
      inStock?: boolean;
      stockCount?: number;
      unit?: string;
      featured?: boolean;
      images?: Array<{ url: string; altText?: string; sortOrder?: number }>;
      variants?: Array<{ name: string; price: number; inStock?: boolean; sortOrder?: number }>;
    };

    if (!name || !price || !category) {
      res.status(400).json({ error: "name, price, and category are required" });
      return;
    }

    const [product] = await db
      .insert(products)
      .values({
        tenantId,
        shopId: shop.id,
        name,
        nameNepali: nameNepali ?? null,
        description: description ?? "",
        price: Number(price),
        compareAtPrice: compareAtPrice != null ? Number(compareAtPrice) : null,
        category,
        browseCategory: browseCategory ?? null,
        storeCategory: storeCategory ?? null,
        inStock: inStock ?? true,
        stockCount: stockCount != null ? Number(stockCount) : null,
        unit: unit ?? null,
        featured: featured ?? false,
      })
      .returning();

    if (images && images.length > 0) {
      await db.insert(productImages).values(
        images.map((img, i) => ({
          productId: product.id,
          url: img.url,
          altText: img.altText ?? null,
          sortOrder: img.sortOrder ?? i,
        })),
      );
    }

    if (variants && variants.length > 0) {
      await db.insert(productVariants).values(
        variants.map((v, i) => ({
          productId: product.id,
          name: v.name,
          price: Number(v.price),
          inStock: v.inStock ?? true,
          sortOrder: v.sortOrder ?? i,
        })),
      );
    }

    await writeAuditLog({
      req,
      action: "product.create",
      resource: "product",
      resourceId: product.id,
      metadata: { name },
    });

    res.status(201).json(product);
  },
);

// PUT /api/merchant/products/:id — update a product (tenant-scoped)
router.put(
  "/merchant/products/:id",
  ...AUTH,
  async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(403).json({ error: "No tenant" });
      return;
    }

    const id = String(req.params.id);
    const [existing] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.tenantId, tenantId)));

    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const ALLOWED_PRODUCT_FIELDS = [
      "name",
      "nameNepali",
      "description",
      "price",
      "compareAtPrice",
      "category",
      "browseCategory",
      "storeCategory",
      "inStock",
      "stockCount",
      "unit",
      "featured",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of ALLOWED_PRODUCT_FIELDS) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if (updates.price != null) updates.price = Number(updates.price);
    if (updates.compareAtPrice != null) updates.compareAtPrice = Number(updates.compareAtPrice);
    if (updates.stockCount != null) updates.stockCount = Number(updates.stockCount);

    const [updated] = await db
      .update(products)
      .set(updates as Partial<typeof products.$inferInsert>)
      .where(eq(products.id, id))
      .returning();

    // Replace images if provided
    const { images, variants } = req.body as {
      images?: Array<{ url: string; altText?: string; sortOrder?: number }>;
      variants?: Array<{ name: string; price: number; inStock?: boolean; sortOrder?: number }>;
    };

    if (images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (images.length > 0) {
        await db.insert(productImages).values(
          images.map((img, i) => ({
            productId: id,
            url: img.url,
            altText: img.altText ?? null,
            sortOrder: img.sortOrder ?? i,
          })),
        );
      }
    }

    if (variants !== undefined) {
      await db.delete(productVariants).where(eq(productVariants.productId, id));
      if (variants.length > 0) {
        await db.insert(productVariants).values(
          variants.map((v, i) => ({
            productId: id,
            name: v.name,
            price: Number(v.price),
            inStock: v.inStock ?? true,
            sortOrder: v.sortOrder ?? i,
          })),
        );
      }
    }

    await writeAuditLog({
      req,
      action: "product.update",
      resource: "product",
      resourceId: id,
      metadata: updates,
    });

    res.json(updated);
  },
);

// DELETE /api/merchant/products/:id — soft-delete a product (tenant-scoped)
router.delete(
  "/merchant/products/:id",
  ...AUTH,
  async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(403).json({ error: "No tenant" });
      return;
    }

    const id = String(req.params.id);
    const [existing] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.tenantId, tenantId)));

    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await db.update(products).set({ isActive: false }).where(eq(products.id, id));

    await writeAuditLog({
      req,
      action: "product.delete",
      resource: "product",
      resourceId: id,
      metadata: { name: existing.name },
    });

    res.json({ message: "Product deleted" });
  },
);

export default router;
