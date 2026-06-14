import { Router, type IRouter } from "express";
import { db, shops, eq } from "@workspace/db";
import { count } from "@workspace/db";

const router: IRouter = Router();

const CATEGORY_META: Record<string, { name: string; nameNepali: string; icon: string; image: string; description: string }> = {
  groceries: {
    name: "Groceries",
    nameNepali: "किराना सामान",
    icon: "🛒",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    description: "Authentic Nepali groceries, spices, and daily essentials",
  },
  "food-beverages": {
    name: "Food & Beverages",
    nameNepali: "खाना र पेय",
    icon: "🍜",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    description: "Authentic Nepali restaurants and food delivery",
  },
  fashion: {
    name: "Fashion",
    nameNepali: "फेसन",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
    description: "Traditional Nepali clothing, sarees, and festival wear",
  },
  electronics: {
    name: "Electronics",
    nameNepali: "इलेक्ट्रोनिक्स",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    description: "SIM cards, electronics, and mobile accessories",
  },
  "health-beauty": {
    name: "Health & Beauty",
    nameNepali: "स्वास्थ्य र सौन्दर्य",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    description: "Ayurvedic products, herbal remedies, and beauty essentials",
  },
  handicrafts: {
    name: "Handicrafts",
    nameNepali: "हस्तकला",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop",
    description: "Handmade Nepali crafts, Thangka, and souvenirs",
  },
  jewelry: {
    name: "Jewelry",
    nameNepali: "गहना",
    icon: "💎",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    description: "Traditional Nepali gold and silver jewelry",
  },
  "home-decor": {
    name: "Home & Decor",
    nameNepali: "घर सजावट",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    description: "Nepali home goods, decor, and household items",
  },
  "books-stationery": {
    name: "Books & Stationery",
    nameNepali: "पुस्तक र स्टेशनरी",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
    description: "Nepali books, magazines, and educational materials",
  },
  "sports-fitness": {
    name: "Sports & Fitness",
    nameNepali: "खेलकुद",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    description: "Sports equipment and fitness accessories",
  },
};

// GET /api/categories — public list of browse categories with shop counts
router.get("/categories", async (_req, res): Promise<void> => {
  const shopCounts = await db
    .select({
      category: shops.category,
      count: count(),
    })
    .from(shops)
    .where(eq(shops.isActive, true))
    .groupBy(shops.category);

  const countMap: Record<string, number> = {};
  for (const row of shopCounts) {
    countMap[row.category] = Number(row.count);
  }

  const allCategories = Object.entries(CATEGORY_META)
    .filter(([slug]) => (countMap[slug] ?? 0) > 0)
    .map(([slug, meta], i) => ({
      id: `cat-${slug}`,
      slug,
      ...meta,
      shopCount: countMap[slug] ?? 0,
      sortOrder: i,
    }));

  res.json({ categories: allCategories });
});

export default router;
