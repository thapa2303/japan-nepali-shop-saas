"use client"

import Link from "next/link"
import Image from "next/image"
import { useCategories } from "@/lib/contexts/category-context"

export function CategoriesGrid() {
  const { categories } = useCategories()

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
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shops?category=${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-center transition-all hover:border-primary hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Image
                  src={category.image || "/placeholder.svg?height=240&width=240"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm leading-tight">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {category.shopCount} shops
                </p>
              </div>
            </Link>
          ))}
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
