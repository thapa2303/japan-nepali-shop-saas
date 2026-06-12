"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Grid3X3, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShopGrid } from "@/components/shops/shop-grid"
import { ShopFilters } from "@/components/shops/shop-filters"
import { shops as allShops } from "@/lib/mock-data/shops"
import { prefectures } from "@/lib/mock-data/locations"
import type { Shop, ShopCategory, ShopFeature } from "@/lib/types"

// Dynamically import map component to avoid SSR issues
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
    )
  }
)

function ShopsContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"grid" | "list" | "map">(
    (searchParams.get("view") as "grid" | "list" | "map") || "grid"
  )

  // Get filter values from URL
  const query = searchParams.get("q")?.toLowerCase()
  const category = searchParams.get("category") as ShopCategory | null
  const district = searchParams.get("district")
  const selectedFeatures = searchParams.get("features")?.split(",").filter(Boolean) || []
  const isOpenOnly = searchParams.get("open") === "true"
  const sortBy = searchParams.get("sort") || "rating"

  // Filter shops based on search params
  const filteredShops = useMemo(() => {
    let result = [...allShops]

    // Search query
    if (query) {
      result = result.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.nameNepali?.includes(query) ||
          shop.description.toLowerCase().includes(query) ||
          shop.category.includes(query)
      )
    }

    // Category filter
    if (category) {
      result = result.filter((shop) => shop.category === category)
    }

    // Prefecture filter
    if (district) {
      const prefectureName = prefectures.find((d) => d.id === district)?.name
      if (prefectureName) {
        result = result.filter((shop) => 
          shop.location.prefecture.toLowerCase().includes(prefectureName.toLowerCase())
        )
      }
    }

    // Open now filter
    if (isOpenOnly) {
      result = result.filter((shop) => shop.isOpen)
    }

    // Features filter
    if (selectedFeatures.length > 0) {
      result = result.filter((shop) =>
        selectedFeatures.every((feature) => 
          shop.features.includes(feature as ShopFeature)
        )
      )
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        // For MVP, just reverse the order
        result.reverse()
        break
    }

    return result
  }, [query, category, district, isOpenOnly, selectedFeatures, sortBy])

  return (
    <div className="container px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")} Shops`
            : query
            ? `Search results for "${query}"`
            : "Browse Shops"
          }
        </h1>
        <p className="mt-1 text-muted-foreground">
          Discover Nepali-owned shops across Japan
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <ShopFilters totalCount={filteredShops.length} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* View Toggle & Mobile Filters */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="lg:hidden flex-1">
              <ShopFilters totalCount={filteredShops.length} />
            </div>
            
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="hidden sm:block">
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

          {/* Content based on view */}
          {view === "map" ? (
            <div className="h-[calc(100vh-280px)] min-h-[400px] rounded-lg overflow-hidden border">
              <ShopMap shops={filteredShops} />
            </div>
          ) : (
            <ShopGrid shops={filteredShops} compact={view === "list"} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShopsPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ShopsContent />
    </Suspense>
  )
}
