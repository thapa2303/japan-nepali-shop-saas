"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/contexts/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"

export function CartIcon() {
  const { getItemCount, toggleCart, isOpen } = useCart()
  const itemCount = getItemCount()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={toggleCart}
        aria-label={`Cart with ${itemCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>
      <CartDrawer open={isOpen} onOpenChange={toggleCart} />
    </>
  )
}
