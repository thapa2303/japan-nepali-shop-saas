"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/contexts/cart-context"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { getShopCarts, updateQuantity, removeItem, getSubtotal, getItemCount, closeCart } = useCart()
  
  const shopCarts = getShopCarts()
  const subtotal = getSubtotal()
  const itemCount = getItemCount()

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="space-y-0 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({itemCount})
            </SheetTitle>
          </div>
        </SheetHeader>

        {shopCarts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start shopping to add items to your cart
              </p>
            </div>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/shops">Browse Shops</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6">
                {shopCarts.map((shopCart) => (
                  <div key={shopCart.shopId} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/shops/${shopCart.shopSlug}`}
                        className="font-medium hover:text-primary transition-colors"
                        onClick={() => onOpenChange(false)}
                      >
                        {shopCart.shopName}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {shopCart.items.length} item{shopCart.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {shopCart.items.map((item) => {
                        const price = item.variant?.price || item.product.price
                        const itemKey = `${item.product.id}-${item.variant?.id || "default"}`

                        return (
                          <div key={itemKey} className="flex gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                                  <h4 className="text-sm font-medium line-clamp-1">
                                    {item.product.name}
                                  </h4>
                                  {item.variant && (
                                    <p className="text-xs text-muted-foreground">
                                      {item.variant.name}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeItem(item.product.id, item.variant?.id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                  aria-label="Remove item"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity - 1,
                                        item.variant?.id
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity + 1,
                                        item.variant?.id
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <span className="text-sm font-medium">
                                  {formatPrice(price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {shopCart.deliveryFee > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Delivery Fee</span>
                        <span>{formatPrice(shopCart.deliveryFee)}</span>
                      </div>
                    )}

                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fees calculated at checkout
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button className="flex-1" asChild onClick={() => onOpenChange(false)}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
