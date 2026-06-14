import { useEffect, useState } from "react";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import {
  useGetCart,
  useCreateOrder,
  useListShops,
  getGetCartQueryKey,
  type ValidateCouponResponse,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  CreditCard,
  ShoppingBag,
  Tag,
  CheckCircle2,
} from "lucide-react";

const CHECKOUT_CONTEXT_KEY = "shopsaas:checkout-context";

type CheckoutContext = {
  shopId: string;
  couponId?: string;
  appliedCoupon?: ValidateCouponResponse | null;
  discountAmount: number;
};

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "paypay", label: "PayPay" },
  { value: "credit-card", label: "Credit / Debit Card" },
  { value: "bank-transfer", label: "Bank Transfer" },
];

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: shopsData } = useListShops();
  const createOrderMutation = useCreateOrder();

  const [ctx, setCtx] = useState<CheckoutContext | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const raw = sessionStorage.getItem(CHECKOUT_CONTEXT_KEY);
    if (raw) {
      try {
        setCtx(JSON.parse(raw));
      } catch {
        navigate("/cart");
      }
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  if (!ctx) return null;

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = ctx.discountAmount;
  const total = Math.max(0, subtotal - discountAmount);

  const shopName =
    shopsData?.shops?.find((s) => s.id === ctx.shopId)?.name ?? "Selected shop";

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Delivery address required",
        description: "Please enter where you'd like your order delivered.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        data: {
          shopId: ctx.shopId,
          subtotal,
          ...(ctx.couponId ? { couponId: ctx.couponId } : {}),
          deliveryAddress: deliveryAddress.trim(),
          customerPhone: customerPhone.trim() || undefined,
          paymentMethod,
        },
      });

      sessionStorage.removeItem(CHECKOUT_CONTEXT_KEY);
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

      toast({
        title: "Order placed!",
        description:
          result.discountAmount > 0
            ? `Order ${result.order.orderNumber} — you saved ¥${result.discountAmount.toLocaleString()}.`
            : `Order ${result.order.orderNumber} placed successfully.`,
      });

      navigate(`/orders/${result.order.id}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Checkout failed. Please try again.";
      toast({ title: "Order failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="-ml-4 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-display font-bold mt-2">Checkout</h1>
          <p className="text-muted-foreground mt-1">
            Ordering from <span className="font-medium text-foreground">{shopName}</span>
          </p>
        </div>

        {cartLoading ? (
          <div className="space-y-4">
            <div className="h-48 bg-muted animate-pulse rounded-xl" />
            <div className="h-48 bg-muted animate-pulse rounded-xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <Link href="/shops">
              <Button>Browse Shops</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: delivery form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">
                      Address{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Building name, floor, room number&#10;Street / Town&#10;City, Prefecture, Postal code"
                      className="mt-1 resize-none"
                      rows={4}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Phone number{" "}
                      <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. 080-1234-5678"
                      className="mt-1"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {paymentMethod === "cod" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Pay with cash when your order arrives.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ¥{item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold shrink-0">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>¥{subtotal.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && ctx.appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {ctx.appliedCoupon.coupon.code}
                        </span>
                        <span>−¥{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-xs text-muted-foreground">Free</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span
                      className={
                        discountAmount > 0
                          ? "text-emerald-700 dark:text-emerald-400"
                          : ""
                      }
                    >
                      ¥{total.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      You save ¥{discountAmount.toLocaleString()} with this coupon
                    </p>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending || !deliveryAddress.trim()}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing order…
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  {!deliveryAddress.trim() && (
                    <p className="text-xs text-muted-foreground text-center">
                      Enter your delivery address to continue
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
