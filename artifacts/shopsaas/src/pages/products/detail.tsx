import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useParams, Link } from "wouter";
import { useGetProduct, useAddCartItem, getGetCartQueryKey, getGetProductQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useGetProduct(id || "", {
    query: { queryKey: getGetProductQueryKey(id || ""), enabled: !!id }
  });

  const addCartItem = useAddCartItem();

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to log in to add items to your cart", variant: "destructive" });
      return;
    }
    
    if (!id) return;

    try {
      await addCartItem.mutateAsync({ data: { productId: id, quantity: 1 } });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      toast({ title: "Added to cart", description: "Item has been added to your cart." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add item to cart.", variant: "destructive" });
    }
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : !product ? (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link href="/shops">
              <Button>Browse Shops</Button>
            </Link>
          </div>
        ) : (
          <div>
            <Link href={`/shops/${product.shopId}`}>
              <Button variant="ghost" className="mb-6 -ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-muted rounded-xl h-96 md:h-[500px] flex items-center justify-center border">
                <span className="text-muted-foreground">Product Image</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Badge className="mb-3">{product.category}</Badge>
                  <h1 className="text-4xl font-display font-bold text-foreground mb-2">{product.name}</h1>
                  {product.nameNepali && <p className="text-xl text-muted-foreground mb-4">{product.nameNepali}</p>}
                </div>
                
                <div className="flex items-end gap-3 pb-6 border-b">
                  <span className="text-4xl font-bold">¥{product.price.toLocaleString()}</span>
                  {product.unit && <span className="text-muted-foreground pb-1">/ {product.unit}</span>}
                </div>
                
                {product.description && (
                  <div className="py-4 text-foreground/80 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg" 
                    variant={product.inStock ? "default" : "secondary"}
                    disabled={!product.inStock || addCartItem.isPending}
                    onClick={handleAddToCart}
                  >
                    {product.inStock ? (
                      <>
                        <Plus className="h-5 w-5 mr-2" /> Add to Cart
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
