"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Search, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchSearch } from "@/lib/api-client"
import type { Shop, Product } from "@/lib/types"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<{ shops: Shop[]; products: Array<Product & { shop?: { id: string; name: string; slug: string } }> }>({ shops: [], products: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults({ shops: [], products: [] })
      return
    }
    setLoading(true)
    fetchSearch(query)
      .then((res) => setResults({ shops: res.shops as Shop[], products: res.products as Array<Product & { shop?: { id: string; name: string; slug: string } }> }))
      .catch(() => setResults({ shops: [], products: [] }))
      .finally(() => setLoading(false))
  }, [query])

  const totalResults = results.shops.length + results.products.length

  if (!query.trim()) {
    return (
      <div className="container px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Search ShopSaaS</h1>
          <p className="mt-2 text-muted-foreground">
            Enter a search term to find shops and products
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="mt-1 text-muted-foreground">
          Found {totalResults} result{totalResults !== 1 ? "s" : ""}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No results found</h2>
          <p className="mt-2 text-muted-foreground">
            Try different keywords or browse our categories
          </p>
          <Link
            href="/shops"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Browse all shops
          </Link>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({totalResults})
            </TabsTrigger>
            <TabsTrigger value="shops">
              Shops ({results.shops.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Products ({results.products.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {results.shops.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Shops</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.shops.slice(0, 3).map((shop) => (
                    <Link key={shop.id} href={`/shops/${shop.slug}`}>
                      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={shop.coverImage}
                            alt={shop.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {shop.isOpen && (
                            <Badge className="absolute top-3 left-3 bg-green-600">
                              Open
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {shop.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{shop.rating}</span>
                            <span className="text-muted-foreground">
                              ({shop.reviewCount})
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {results.shops.length > 3 && (
                  <Link
                    href={`/shops?q=${encodeURIComponent(query)}`}
                    className="inline-block mt-4 text-primary hover:underline text-sm"
                  >
                    View all {results.shops.length} shops
                  </Link>
                )}
              </div>
            )}

            {results.products.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Products</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {results.products.slice(0, 4).map((product) => {
                    const shop = (product as { shop?: { id: string; name: string; slug: string } }).shop
                    return (
                      <Link
                        key={product.id}
                        href={`/shops/${shop?.slug ?? ""}/products/${product.id}`}
                      >
                        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={product.images?.[0] ?? ""}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {shop?.name}
                            </p>
                            <p className="font-semibold mt-2">
                              ¥{product.price.toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="shops" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.shops.map((shop) => (
                <Link key={shop.id} href={`/shops/${shop.slug}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={shop.coverImage}
                        alt={shop.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {shop.isOpen && (
                        <Badge className="absolute top-3 left-3 bg-green-600">
                          Open
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {shop.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {shop.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{shop.rating}</span>
                        </div>
                        {shop.deliveryTime && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{shop.deliveryTime}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {results.products.map((product) => {
                const shop = (product as { shop?: { id: string; name: string; slug: string } }).shop
                return (
                  <Link
                    key={product.id}
                    href={`/shops/${shop?.slug ?? ""}/products/${product.id}`}
                  >
                    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.images?.[0] ?? "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {product.compareAtPrice && (
                          <Badge className="absolute top-2 right-2 bg-destructive">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {shop?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="font-semibold">
                            ¥{product.price.toLocaleString()}
                          </p>
                          {product.compareAtPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              ¥{product.compareAtPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
