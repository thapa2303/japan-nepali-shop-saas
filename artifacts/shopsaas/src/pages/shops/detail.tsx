import { useParams, Link } from "wouter";
import { useGetShop, useGetProductsByShop, useAddCartItem, getGetCartQueryKey, getGetShopQueryKey, getGetProductsByShopQueryKey } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Clock, Plus, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useQueryClient } from "@tanstack/react-query";

export default function ShopDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shop, isLoading: isShopLoading } = useGetShop(slug || "", {
    query: { queryKey: getGetShopQueryKey(slug || ""), enabled: !!slug }
  });

  const { data: productsData, isLoading: isProductsLoading } = useGetProductsByShop(slug || "", undefined, {
    query: { queryKey: getGetProductsByShopQueryKey(slug || ""), enabled: !!slug }
  });

  const addCartItem = useAddCartItem();

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to log in to add items to your cart", variant: "destructive" });
      return;
    }
    
    try {
      await addCartItem.mutateAsync({ data: { productId, quantity: 1 } });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      toast({ title: "Added to cart", description: "Item has been added to your cart." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add item to cart.", variant: "destructive" });
    }
  };

  if (isShopLoading) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </StorefrontLayout>
    );
  }

  if (!shop) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Shop not found</h1>
          <p className="text-muted-foreground mb-6">The shop you're looking for doesn't exist.</p>
          <Link href="/shops">
            <Button>Browse Shops</Button>
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="bg-muted relative">
        <div className="h-64 md:h-80 w-full overflow-hidden">
          {shop.coverImage ? (
            <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Store className="h-24 w-24 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative -mt-20 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="h-32 w-32 rounded-xl border-4 border-background bg-card overflow-hidden shrink-0 shadow-lg">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Store className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant="secondary">{shop.category}</Badge>
                {shop.isActive ? (
                  <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">Open</Badge>
                ) : (
                  <Badge variant="destructive">Closed</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">{shop.name}</h1>
              {shop.nameNepali && <p className="text-xl text-muted-foreground mb-3">{shop.nameNepali}</p>}
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                {shop.area && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    {shop.area}
                  </div>
                )}
                {shop.deliveryTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {shop.deliveryTime} delivery
                  </div>
                )}
                {shop.minOrder !== undefined && shop.minOrder !== null && (
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1.5" />
                    Min order: ¥{shop.minOrder.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {shop.description && (
            <div className="mt-8 max-w-3xl">
              <p className="text-foreground/80 leading-relaxed">{shop.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-display font-bold mb-6">Products</h2>
        
        {isProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : productsData?.products?.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No products found</h3>
            <p className="text-muted-foreground">This shop hasn't added any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {productsData?.products?.map((product) => (
              <Card key={product.id} className="overflow-hidden group flex flex-col">
                <div className="p-4 flex-1">
                  <div className="mb-2 flex justify-between items-start">
                    <div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                      </Link>
                      {product.nameNepali && <p className="text-xs text-muted-foreground">{product.nameNepali}</p>}
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="font-bold text-lg">¥{product.price.toLocaleString()}</span>
                    {product.unit && <span className="text-xs text-muted-foreground mb-1">/ {product.unit}</span>}
                  </div>
                </div>
                <div className="p-4 pt-0 mt-auto">
                  <Button 
                    className="w-full" 
                    variant={product.inStock ? "default" : "secondary"}
                    disabled={!product.inStock || addCartItem.isPending}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    {product.inStock ? (
                      <>
                        <Plus className="h-4 w-4 mr-2" /> Add to Cart
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}

// Ensure the icon is imported
import { Package } from "lucide-react";
