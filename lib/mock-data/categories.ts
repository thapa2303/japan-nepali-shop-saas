import type { Category } from "@/lib/types"

export const categories: Category[] = [
  {
    id: "1",
    name: "Groceries",
    nameNepali: "किराना",
    slug: "groceries",
    icon: "ShoppingBasket",
    description: "Daily essentials, fresh produce, and pantry items",
    shopCount: 45,
  },
  {
    id: "2",
    name: "Fashion",
    nameNepali: "फेसन",
    slug: "fashion",
    icon: "Shirt",
    description: "Clothing, accessories, and traditional wear",
    shopCount: 32,
  },
  {
    id: "3",
    name: "Electronics",
    nameNepali: "इलेक्ट्रोनिक्स",
    slug: "electronics",
    icon: "Smartphone",
    description: "Phones, computers, gadgets, and accessories",
    shopCount: 18,
  },
  {
    id: "4",
    name: "Home & Decor",
    nameNepali: "घर सजावट",
    slug: "home-decor",
    icon: "Home",
    description: "Furniture, decorations, and household items",
    shopCount: 24,
  },
  {
    id: "5",
    name: "Health & Beauty",
    nameNepali: "स्वास्थ्य र सौन्दर्य",
    slug: "health-beauty",
    icon: "Heart",
    description: "Cosmetics, skincare, and wellness products",
    shopCount: 28,
  },
  {
    id: "6",
    name: "Books & Stationery",
    nameNepali: "किताब र स्टेशनरी",
    slug: "books-stationery",
    icon: "BookOpen",
    description: "Books, office supplies, and school essentials",
    shopCount: 15,
  },
  {
    id: "7",
    name: "Sports & Fitness",
    nameNepali: "खेलकुद",
    slug: "sports-fitness",
    icon: "Dumbbell",
    description: "Sports equipment, gym gear, and outdoor items",
    shopCount: 12,
  },
  {
    id: "8",
    name: "Food & Beverages",
    nameNepali: "खाना र पेय",
    slug: "food-beverages",
    icon: "UtensilsCrossed",
    description: "Ready-to-eat food, snacks, and beverages",
    shopCount: 38,
  },
  {
    id: "9",
    name: "Handicrafts",
    nameNepali: "हस्तकला",
    slug: "handicrafts",
    icon: "Palette",
    description: "Traditional Nepali crafts and artisan goods",
    shopCount: 22,
  },
  {
    id: "10",
    name: "Jewelry",
    nameNepali: "गहना",
    slug: "jewelry",
    icon: "Gem",
    description: "Gold, silver, and traditional ornaments",
    shopCount: 16,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug)
}

export function getCategoryIcon(slug: string): string {
  const category = getCategoryBySlug(slug)
  return category?.icon || "Store"
}
