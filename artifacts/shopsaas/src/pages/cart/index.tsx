import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useGetCart, useRemoveCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function CartPage() {
  const { data: cart, isLoading } = useGetCart();
  const removeItem = useRemoveCartItem();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRemove = async (id: string) => {
    try {
      await removeItem.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      toast({ title: "Item removed" });
    } catch (error) {
      toast({ title: "Error removing item", variant: "destructive" });
    }
  };

  const handleCheckout = () => {
    toast({
      title: "Order placed!",
      description: "Your order has been successfully placed. (Checkout flow is out of scope for this demo)",
    });
  };

  const total = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-8">Your Cart</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded-lg"></div>
            <div className="h-24 bg-muted animate-pulse rounded-lg"></div>
          </div>
        ) : cart?.items?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
            <Link href="/shops">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart?.items?.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold">¥{(item.price * item.quantity).toLocaleString()}</p>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 px-2 mt-1" onClick={() => handleRemove(item.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>¥{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>¥{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
