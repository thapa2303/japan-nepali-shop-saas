"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories } from "@/lib/mock-data/categories"
import { prefectures } from "@/lib/mock-data/locations"
import type { ShopCategory, ShopFeature } from "@/lib/types"

const features: { value: ShopFeature; label: string }[] = [
  { value: "delivery", label: "Delivery" },
  { value: "pickup", label: "Pickup" },
  { value: "cash-on-delivery", label: "Cash on Delivery" },
  { value: "digital-payment", label: "Digital Payment" },
]

const sortOptions = [
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name (A-Z)" },
  { value: "newest", label: "Newest First" },
]

interface ShopFiltersProps {
  totalCount: number
}

export function ShopFilters({ totalCount }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get("category") as ShopCategory | null
  const selectedDistrict = searchParams.get("district")
  const selectedFeatures = searchParams.get("features")?.split(",").filter(Boolean) || []
  const sortBy = searchParams.get("sort") || "rating"
  const isOpenOnly = searchParams.get("open") === "true"

  const activeFiltersCount = [
    selectedCategory,
    selectedDistrict,
    selectedFeatures.length > 0,
    isOpenOnly,
  ].filter(Boolean).length

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shops?${params.toString()}`)
  }

  const toggleFeature = (feature: ShopFeature) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature]
    
    updateParams("features", newFeatures.length > 0 ? newFeatures.join(",") : null)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const q = searchParams.get("q")
    const view = searchParams.get("view")
    if (q) params.set("q", q)
    if (view) params.set("view", view)
    router.push(`/shops?${params.toString()}`)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <Label className="text-sm font-semibold">Category</Label>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => updateParams("category", value === "all" ? null : value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Location Filter */}
      <div>
        <Label className="text-sm font-semibold">Prefecture</Label>
        <Select
          value={selectedDistrict || "all"}
          onValueChange={(value) => updateParams("district", value === "all" ? null : value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All Prefectures" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prefectures</SelectItem>
            {prefectures.map((prefecture) => (
              <SelectItem key={prefecture.id} value={prefecture.id}>
                {prefecture.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Open Now Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="open-now"
          checked={isOpenOnly}
          onCheckedChange={(checked) => updateParams("open", checked ? "true" : null)}
        />
        <Label htmlFor="open-now" className="text-sm font-medium cursor-pointer">
          Open Now Only
        </Label>
      </div>

      <Separator />

      {/* Features Filter */}
      <div>
        <Label className="text-sm font-semibold">Features</Label>
        <div className="mt-3 space-y-3">
          {features.map((feature) => (
            <div key={feature.value} className="flex items-center space-x-2">
              <Checkbox
                id={feature.value}
                checked={selectedFeatures.includes(feature.value)}
                onCheckedChange={() => toggleFeature(feature.value)}
              />
              <Label htmlFor={feature.value} className="text-sm cursor-pointer">
                {feature.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalCount}</span> shops found
        </p>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value) => updateParams("sort", value)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => updateParams("category", null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedDistrict && (
            <Badge variant="secondary" className="gap-1">
              {prefectures.find((d) => d.id === selectedDistrict)?.name}
              <button onClick={() => updateParams("district", null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {isOpenOnly && (
            <Badge variant="secondary" className="gap-1">
              Open Now
              <button onClick={() => updateParams("open", null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedFeatures.map((feature) => (
            <Badge key={feature} variant="secondary" className="gap-1">
              {features.find((f) => f.value === feature)?.label}
              <button onClick={() => toggleFeature(feature as ShopFeature)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Desktop Sidebar Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </div>
  )
}
