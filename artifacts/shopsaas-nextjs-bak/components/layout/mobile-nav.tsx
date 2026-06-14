"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MapPin, ShoppingCart, Store, User } from "lucide-react"
import { useCart } from "@/lib/contexts/cart-context"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/shops?view=map", label: "Map", icon: MapPin },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "#", label: "Account", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/"
          const isCart = item.label === "Cart"

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
