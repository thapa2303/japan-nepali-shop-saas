import { ShopCard } from "@/components/shops/shop-card"
import type { Shop } from "@/lib/types"

interface ShopGridProps {
  shops: Shop[]
  compact?: boolean
}

export function ShopGrid({ shops, compact = false }: ShopGridProps) {
  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-lg">No shops found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Try adjusting your filters or search query to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${
      compact 
        ? "grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    }`}>
      {shops.map((shop, index) => (
        <ShopCard key={shop.id} shop={shop} compact={compact} priority={index < 3} />
      ))}
    </div>
  )
}
