import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { fetchShops } from "@/lib/api-client"

export async function FeaturedShops() {
  let shops: Awaited<ReturnType<typeof fetchShops>>["shops"] = []
  try {
    const res = await fetchShops({ featured: "true", limit: "8" })
    shops = res.shops
  } catch {
    shops = []
  }

  if (shops.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Featured Shops</h2>
            <p className="mt-1 text-muted-foreground">
              Top-rated shops loved by the community
            </p>
          </div>
          <Link
            href="/shops?featured=true"
            className="hidden sm:block text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shops.map((shop, index) => (
            <Link key={shop.id} href={`/shops/${shop.slug}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={shop.coverImage}
                    alt={shop.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    priority={index < 2}
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
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-background">
                        <Image
                          src={shop.logo}
                          alt={`${shop.name} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {shop.name}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {shop.category.replace("-", " ")}
                        </p>
                      </div>
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
                    <span className="line-clamp-1">{shop.location.area || shop.location.city || shop.location.prefecture}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Link
          href="/shops?featured=true"
          className="mt-6 block text-center text-sm font-medium text-primary hover:underline sm:hidden"
        >
          View all featured shops
        </Link>
      </div>
    </section>
  )
}
