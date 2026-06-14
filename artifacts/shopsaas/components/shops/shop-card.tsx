"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, MapPin, Star, Navigation, ShoppingCart, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { Shop } from "@/lib/types"

interface ShopCardProps {
  shop: Shop
  compact?: boolean
  priority?: boolean
}

const categoryLabels: Record<string, string> = {
  groceries: "Grocery Hub",
  "food-beverages": "Authentic Dining",
  fashion: "Fashion & Tailoring",
  handicrafts: "E-commerce & Imports",
  "health-beauty": "Beauty & Wellness",
  electronics: "Electronics & SIM",
  jewelry: "Jewelry House",
}

export function ShopCard({ shop, compact = false, priority = false }: ShopCardProps) {
  const router = useRouter()

  if (compact) {
    return (
      <Link href={`/shops/${shop.slug}`}>
        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image src={shop.coverImage} alt={shop.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {shop.name}
                  </h3>
                  {shop.isOpen ? (
                    <span className="text-xs text-green-600 shrink-0">Open</span>
                  ) : (
                    <span className="text-xs text-muted-foreground shrink-0">Closed</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{shop.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {shop.category.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  const typeLabel = categoryLabels[shop.category] ?? shop.category.replace("-", " ")

  const handleViewOnMaps = () => {
    if (shop.googleMapsUrl) {
      window.open(shop.googleMapsUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleShopOnline = () => {
    toast({
      title: "Opening online store",
      description: `Redirecting you to ${shop.name}'s official digital marketplace...`,
    })
    setTimeout(() => {
      router.push(shop.onlineStoreUrl ?? `/shops/${shop.slug}`)
    }, 1200)
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50">
      <Link href={`/shops/${shop.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={shop.coverImage}
            alt={shop.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
          {shop.isOpen ? (
            <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-600">Open Now</Badge>
          ) : (
            <Badge variant="secondary" className="absolute top-3 left-3">
              Closed
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground hover:bg-primary">
            {typeLabel}
          </Badge>
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col p-4">
        {/* Physical Presence */}
        <Link href={`/shops/${shop.slug}`} className="block">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-background">
              <Image src={shop.logo} alt={`${shop.name} logo`} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-1 transition-colors group-hover:text-primary">
                {shop.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">
                  {shop.location.area}, {shop.location.prefecture}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{shop.rating}</span>
            <span className="text-muted-foreground">({shop.reviewCount})</span>
          </div>
          {shop.deliveryTime && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{shop.deliveryTime}</span>
            </div>
          )}
        </div>

        {shop.googleMapsTag && (
          <div className="mt-3 flex items-center gap-1.5">
            <Badge variant="outline" className="gap-1 border-primary/30 text-xs font-normal text-primary">
              <MapPin className="h-3 w-3" />
              Google Maps Registered
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">{shop.googleMapsTag}</span>
          </div>
        )}

        {/* Connected Online Merchant Store */}
        <div className="mt-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <ShoppingCart className="h-3.5 w-3.5" />
            Connected Online Merchant Store
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            Shop {typeLabel.toLowerCase()} products directly from {shop.name}&apos;s own digital storefront.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleViewOnMaps}
            disabled={!shop.googleMapsUrl}
          >
            <Navigation className="h-4 w-4" />
            View on Maps
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" onClick={handleShopOnline}>
            <Store className="h-4 w-4" />
            Shop Online
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
