import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Shop } from "@/lib/types"

interface ShopCardProps {
  shop: Shop
  compact?: boolean
}

export function ShopCard({ shop, compact = false }: ShopCardProps) {
  if (compact) {
    return (
      <Link href={`/shops/${shop.slug}`}>
        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={shop.coverImage}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
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

  return (
    <Link href={`/shops/${shop.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={shop.coverImage}
            alt={shop.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {shop.isOpen ? (
            <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-600">
              Open Now
            </Badge>
          ) : (
            <Badge variant="secondary" className="absolute top-3 left-3">
              Closed
            </Badge>
          )}
          {shop.featured && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground hover:bg-accent">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-background">
              <Image
                src={shop.logo}
                alt={`${shop.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {shop.name}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {shop.category.replace("-", " ")}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {shop.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{shop.rating}</span>
              <span className="text-muted-foreground">
                ({shop.reviewCount})
              </span>
            </div>
            {shop.deliveryTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{shop.deliveryTime}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{shop.location.address}</span>
          </div>

          {shop.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {shop.features.slice(0, 3).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs font-normal">
                  {feature.replace("-", " ")}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
