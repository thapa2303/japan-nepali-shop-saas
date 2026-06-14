import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSearch } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Package, Search as SearchIcon, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const { data, isLoading } = useSearch({ q: query }, { query: { queryKey: ["/api/search", query], enabled: query.length > 2 } });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <StorefrontLayout>
      <div className="bg-primary/5 border-b border-primary/10 py-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-3xl font-display font-bold mb-6">Search</h1>
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search shops or products..." 
              className="pl-10 h-12 text-base bg-background"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="input-search"
            />
            <Button type="submit" className="absolute right-1 top-1 bottom-1">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {query.length <= 2 ? (
          <div className="text-center py-20 text-muted-foreground">
            Enter at least 3 characters to search
          </div>
        ) : isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Searching...</div>
        ) : data?.shops?.length === 0 && data?.products?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No results found for "{query}"</div>
        ) : (
          <div className="space-y-12">
            {data?.shops && data.shops.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Store className="mr-2 h-6 w-6" /> Shops
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.shops.map((shop) => (
                    <Link key={shop.id} href={`/shops/${shop.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col group">
                        <div className="h-32 bg-muted relative flex items-center justify-center shrink-0 overflow-hidden">
                          {shop.coverImage ? (
                            <img src={shop.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <Store className="h-10 w-10 text-muted-foreground/30" />
                          )}
                        </div>
                        <CardContent className="p-4 flex-1">
                          <h3 className="font-bold font-display truncate group-hover:text-primary transition-colors">{shop.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> {shop.area || "Japan"}
                          </p>
                          <Badge variant="secondary" className="text-[10px]">{shop.category}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data?.products && data.products.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Package className="mr-2 h-6 w-6" /> Products
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {data.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden flex flex-col group">
                      <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                          </Link>
                          {product.nameNepali && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.nameNepali}</p>}
                        </div>
                        <div className="font-bold mt-4">¥{product.price.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
