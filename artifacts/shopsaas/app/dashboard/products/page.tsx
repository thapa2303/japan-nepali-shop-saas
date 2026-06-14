"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { ProductManager } from "@/components/dashboard/product-manager"
import type { Product } from "@/lib/types"
import { fetchDashboardProducts, fetchDashboardSubscription } from "@/lib/api-client"

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [shopId, setShopId] = useState("")
  const [productLimit, setProductLimit] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [productsData, subData] = await Promise.all([
          fetchDashboardProducts().catch(() => null),
          fetchDashboardSubscription().catch(() => null),
        ])
        if (productsData?.products) {
          setProducts(productsData.products.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            shopId: p.shopId as string,
            name: p.name as string,
            nameNepali: p.nameNepali as string | undefined,
            description: p.description as string,
            price: p.price as number,
            compareAtPrice: p.compareAtPrice as number | undefined,
            images: (p.images as string[]) ?? [],
            category: p.category as string,
            browseCategory: p.browseCategory as string | undefined,
            storeCategory: p.storeCategory as string | undefined,
            inStock: p.inStock as boolean,
            stockCount: p.stockCount as number | undefined,
            unit: p.unit as string | undefined,
            featured: p.featured as boolean | undefined,
          })))
          if (productsData.products.length > 0) {
            setShopId((productsData.products[0] as Record<string, unknown>).shopId as string)
          }
        }
        if (subData) {
          setProductLimit(subData.productLimit ?? 30)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ProductManager
      initialProducts={products}
      shopId={shopId}
      productLimit={productLimit}
    />
  )
}
