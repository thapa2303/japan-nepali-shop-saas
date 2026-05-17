import Link from "next/link"
import {
  ShoppingBasket,
  Shirt,
  Smartphone,
  Home,
  Heart,
  BookOpen,
  Dumbbell,
  UtensilsCrossed,
  Palette,
  Gem,
} from "lucide-react"
import { categories } from "@/lib/mock-data/categories"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingBasket,
  Shirt,
  Smartphone,
  Home,
  Heart,
  BookOpen,
  Dumbbell,
  UtensilsCrossed,
  Palette,
  Gem,
}

export function CategoriesGrid() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Browse by Category</h2>
            <p className="mt-1 text-muted-foreground">
              Find exactly what you&apos;re looking for
            </p>
          </div>
          <Link
            href="/shops"
            className="hidden sm:block text-sm font-medium text-primary hover:underline"
          >
            View all categories
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || ShoppingBasket
            
            return (
              <Link
                key={category.id}
                href={`/shops?category=${category.slug}`}
                className="group relative flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.shopCount} shops
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <Link
          href="/shops"
          className="mt-6 block text-center text-sm font-medium text-primary hover:underline sm:hidden"
        >
          View all categories
        </Link>
      </div>
    </section>
  )
}
