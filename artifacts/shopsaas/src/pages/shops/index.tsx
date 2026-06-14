import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useListShops } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ShopsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListShops();

  return (
    <StorefrontLayout>
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Discover Shops
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Find authentic Nepali products from local merchants.
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search shops by name or category..." 
              className="pl-10 h-12 text-base bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-shops"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <CardContent className="p-5">
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
        ) : (data?.shops?.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase())))?.length === 0 ? (
          <div className="text-center py-20">
            <Store className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No shops found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.shops?.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase())).map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border group h-full flex flex-col" data-testid={`card-shop-${shop.id}`}>
                  <div className="h-40 bg-muted relative overflow-hidden flex items-center justify-center shrink-0">
                    {shop.coverImage ? (
                      <img 
                        src={shop.coverImage} 
                        alt={shop.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <Store className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors line-clamp-1">{shop.name}</h3>
                      {shop.nameNepali && <p className="text-sm text-muted-foreground mb-2">{shop.nameNepali}</p>}
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-3">
                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <span className="truncate">{shop.area || "Japan"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-border/50">
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal text-xs">
                        {shop.category}
                      </Badge>
                      {shop.deliveryFee !== undefined && shop.deliveryFee !== null && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          Del: ¥{shop.deliveryFee.toLocaleString()}
                        </span>
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
