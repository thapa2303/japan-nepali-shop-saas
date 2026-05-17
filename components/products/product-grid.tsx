import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  shopSlug: string
}

export function ProductGrid({ products, shopSlug }: ProductGridProps) {
  if (products.length === 0) {
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-lg">No products found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This shop hasn&apos;t added any products in this category yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} shopSlug={shopSlug} />
      ))}
    </div>
  )
}
