import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchShops } from "@/lib/api-client"

export async function NearbyShops() {
  let shops: Awaited<ReturnType<typeof fetchShops>>["shops"] = []
  try {
    const res = await fetchShops({ limit: "6" })
    shops = res.shops
  } catch {
    shops = []
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Shops Near You</h2>
            <p className="mt-1 text-muted-foreground">
              Popular Nepali shops across Japan
            </p>
          </div>
          <Link
            href="/shops?view=map"
            className="hidden sm:block text-sm font-medium text-primary hover:underline"
          >
            View on map
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.slug}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={shop.coverImage}
                        alt={shop.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {shop.name}
                        </h3>
                        {shop.isOpen ? (
                          <Badge variant="outline" className="text-green-600 border-green-600 shrink-0">
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">
                            Closed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {shop.category.replace("-", " ")}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{shop.rating}</span>
                        </div>
                        {shop.deliveryTime && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-xs">{shop.deliveryTime}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{(shop as unknown as { location?: { area?: string; city?: string; prefecture?: string } }).location?.area || (shop as unknown as { location?: { area?: string; city?: string; prefecture?: string } }).location?.city || "Japan"}</span>
                      </div>
                    </div>
                  </div>

                  {shop.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {shop.features.slice(0, 3).map((feature) => (
                        <Badge key={String(feature)} variant="secondary" className="text-xs font-normal">
                          {String(feature).replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/shops">View All Shops</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
