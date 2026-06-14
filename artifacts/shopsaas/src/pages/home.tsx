import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useListShops } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data, isLoading } = useListShops({ limit: "6" });

  return (
    <StorefrontLayout>
      <div className="bg-primary/5 py-24 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
            A taste of home,<br className="hidden md:block" /> anywhere in Japan.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover authentic Nepali groceries, spices, and fresh products from lovingly curated neighborhood markets near you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shops">
              <Button size="lg" className="w-full sm:w-auto font-medium" data-testid="button-browse-shops">
                Browse Shops
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium" data-testid="button-search-products">
                Search Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-foreground">Featured Shops</h2>
          <Link href="/shops" className="text-primary hover:underline font-medium">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.shops?.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border group" data-testid={`card-shop-${shop.id}`}>
                  <div className="h-48 bg-muted relative overflow-hidden flex items-center justify-center">
                    {shop.coverImage ? (
                      <img 
                        src={shop.coverImage} 
                        alt={shop.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <Store className="h-16 w-16 text-muted-foreground/30" />
                    )}
                    {shop.logo && (
                      <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-lg border-4 border-card bg-background overflow-hidden shadow-sm">
                        <img src={shop.logo} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-8 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{shop.name}</h3>
                        {shop.nameNepali && <p className="text-sm text-muted-foreground">{shop.nameNepali}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-4 mb-6">
                      <MapPin className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">{shop.area || "Japan"}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal">
                        {shop.category}
                      </Badge>
                      {shop.minOrder && (
                        <Badge variant="outline" className="font-normal text-muted-foreground border-border">
                          Min ¥{shop.minOrder.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
