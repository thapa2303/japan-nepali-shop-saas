import { useState } from "react";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import {
  useGetCart,
  useRemoveCartItem,
  useValidateCoupon,
  useListShops,
  getGetCartQueryKey,
  type ValidateCouponResponse,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, ShoppingBag, Tag, X, Loader2, Store, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";

const CHECKOUT_CONTEXT_KEY = "shopsaas:checkout-context";

export default function CartPage() {
  const { data: cart, isLoading } = useGetCart();
  const { data: shopsData } = useListShops();
  const removeItem = useRemoveCartItem();
  const validateCoupon = useValidateCoupon();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const shops = shopsData?.shops ?? [];
  const activeShopId = appliedCoupon?.coupon.shopId ?? selectedShopId;

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal - discountAmount;

  const handleRemove = async (id: string) => {
    try {
      await removeItem.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCode("");
        toast({ title: "Item removed", description: "Coupon cleared — re-apply if still valid." });
      } else {
        toast({ title: "Item removed" });
      }
    } catch {
      toast({ title: "Error removing item", variant: "destructive" });
    }
  };

  const handleShopChange = (shopId: string) => {
    setSelectedShopId(shopId);
    // Clear coupon when shop changes — coupon must belong to the selected shop
    if (appliedCoupon && appliedCoupon.coupon.shopId !== shopId) {
      setAppliedCoupon(null);
      setCouponCode("");
      toast({ title: "Coupon removed", description: "Coupon was for a different shop." });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!activeShopId) {
      toast({
        title: "Select a shop first",
        description: "Choose which shop you're ordering from before applying a coupon.",
        variant: "destructive",
      });
      return;
    }
    setIsApplying(true);
    try {
      const result = await validateCoupon.mutateAsync({
        data: { code: couponCode.trim(), shopId: activeShopId, orderAmount: subtotal },
      });
      setAppliedCoupon(result);
      // Sync the shop selector to match the coupon's shop
      setSelectedShopId(result.coupon.shopId);
      toast({
        title: "Coupon applied!",
        description: `${result.coupon.code} — saving ¥${result.discountAmount.toLocaleString()}`,
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Invalid or expired coupon code.";
      toast({ title: "Coupon not valid", description: msg, variant: "destructive" });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({ title: "Coupon removed" });
  };

  const handleProceedToCheckout = () => {
    if (!activeShopId) {
      toast({
        title: "Select a shop",
        description: "Choose which shop you're ordering from before checking out.",
        variant: "destructive",
      });
      return;
    }
    sessionStorage.setItem(
      CHECKOUT_CONTEXT_KEY,
      JSON.stringify({
        shopId: activeShopId,
        couponId: appliedCoupon?.coupon.id ?? undefined,
        appliedCoupon: appliedCoupon ?? null,
        discountAmount,
      })
    );
    navigate("/checkout");
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-8">Your Cart</h1>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : cart?.items?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link href="/shops">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart items */}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-8 px-2 mt-1"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-5">
                  <h3 className="font-semibold text-lg">Order Summary</h3>

                  {/* Shop selector */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <Store className="h-3.5 w-3.5" /> Ordering from
                    </p>
                    {appliedCoupon ? (
                      <div className="text-sm font-medium px-3 py-2 rounded-md border bg-muted/50">
                        {shops.find((s) => s.id === appliedCoupon.coupon.shopId)?.name ??
                          "Selected shop"}
                      </div>
                    ) : (
                      <Select
                        value={selectedShopId}
                        onValueChange={handleShopChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a shop…" />
                        </SelectTrigger>
                        <SelectContent>
                          {shops.map((shop) => (
                            <SelectItem key={shop.id} value={shop.id}>
                              {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Coupon input or applied badge */}
                  {!appliedCoupon ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" /> Have a coupon code?
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          className="uppercase tracking-widest text-sm font-mono"
                          disabled={isApplying}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || isApplying}
                          className="shrink-0"
                        >
                          {isApplying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 p-3 flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <Badge
                            variant="secondary"
                            className="mb-1 font-mono text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                          >
                            {appliedCoupon.coupon.code}
                          </Badge>
                          {appliedCoupon.coupon.description && (
                            <p className="text-xs text-muted-foreground">
                              {appliedCoupon.coupon.description}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                            −¥{appliedCoupon.discountAmount.toLocaleString()} off
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label="Remove coupon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Line items */}
                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>¥{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Discount ({appliedCoupon.coupon.code})</span>
                        <span>−¥{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-xs text-muted-foreground">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span
                        className={
                          appliedCoupon ? "text-emerald-700 dark:text-emerald-400" : ""
                        }
                      >
                        ¥{total.toLocaleString()}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                        You save ¥{discountAmount.toLocaleString()} with this coupon
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleProceedToCheckout}
                    disabled={!activeShopId}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {!activeShopId && (
                    <p className="text-xs text-muted-foreground text-center">
                      Select a shop above to enable checkout
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
