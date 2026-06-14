"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/contexts/cart-context"

export default function CartPage() {
  const { getShopCarts, updateQuantity, removeItem, getSubtotal, getItemCount, clearCart } = useCart()
  
  const shopCarts = getShopCarts()
  const subtotal = getSubtotal()
  const itemCount = getItemCount()

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`

  // Calculate total delivery fee
  const totalDeliveryFee = shopCarts.reduce((total, cart) => total + cart.deliveryFee, 0)
  const grandTotal = subtotal + totalDeliveryFee

  if (shopCarts.length === 0) {
    return (
      <div className="container px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-full bg-muted p-8 w-fit mx-auto mb-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/shops">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">
            {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/shops">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {shopCarts.map((shopCart) => (
            <Card key={shopCart.shopId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/shops/${shopCart.shopSlug}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {shopCart.shopName}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {shopCart.items.length} item{shopCart.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {shopCart.items.map((item) => {
                  const price = item.variant?.price || item.product.price
                  const itemKey = `${item.product.id}-${item.variant?.id || "default"}`

                  return (
                    <div key={itemKey} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/shops/${shopCart.shopSlug}/products/${item.product.id}`}
                              className="font-medium hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant && (
                              <p className="text-sm text-muted-foreground">
                                {item.variant.name}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(price)} each
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.variant?.id
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.variant?.id
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(shopCart.subtotal)}</span>
                  </div>
                  {shopCart.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(shopCart.deliveryFee)}</span>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={clearCart}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatPrice(totalDeliveryFee)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Taxes calculated at checkout
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
