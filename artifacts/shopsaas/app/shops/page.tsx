"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Grid3X3, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShopGrid } from "@/components/shops/shop-grid"
import { ShopFilters } from "@/components/shops/shop-filters"
import { fetchShops } from "@/lib/api-client"
import type { Shop } from "@/lib/types"

const ShopMap = dynamic(
  () => import("@/components/shops/shop-map").then((mod) => mod.ShopMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
)

function ShopsContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"grid" | "list" | "map">(
    (searchParams.get("view") as "grid" | "list" | "map") || "grid"
  )
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const query = searchParams.get("q") ?? undefined
  const category = searchParams.get("category") ?? undefined
  const district = searchParams.get("district") ?? undefined
  const features = searchParams.get("features") ?? undefined
  const isOpenOnly = searchParams.get("open") === "true"
  const sortBy = searchParams.get("sort") || "rating"

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = { limit: "50" }
    if (query) params.q = query
    if (category) params.category = category
    if (district) params.prefecture = district
    if (features) params.features = features
    if (isOpenOnly) params.open = "true"

    fetchShops(params)
      .then((res) => {
        let result = res.shops
        if (sortBy === "name") {
          result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortBy === "newest") {
          result = [...result].reverse()
        }
        setShops(result)
        setTotal(res.pagination.total)
      })
      .catch(() => setShops([]))
      .finally(() => setLoading(false))
  }, [query, category, district, features, isOpenOnly, sortBy])

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")} Shops`
            : query
            ? `Search results for "${query}"`
            : "Browse Shops"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Discover Nepali-owned shops across Japan
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <ShopFilters totalCount={shops.length} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="lg:hidden flex-1">
              <ShopFilters totalCount={shops.length} />
            </div>

            <Tabs
              value={view}
              onValueChange={(v) => setView(v as typeof view)}
              className="hidden sm:block"
            >
              <TabsList>
                <TabsTrigger value="grid" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden md:inline">Grid</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden md:inline">List</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden md:inline">Map</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : view === "map" ? (
            <div className="h-[calc(100vh-280px)] min-h-[400px] rounded-lg overflow-hidden border">
              <ShopMap shops={shops} />
            </div>
          ) : (
            <ShopGrid shops={shops} compact={view === "list"} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShopsPage() {
  return (
    <Suspense
      fallback={
        <div className="container px-4 py-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <ShopsContent />
    </Suspense>
  )
}
