"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Menu, ShoppingBag, Store, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchBar } from "@/components/layout/search-bar"
import { CartIcon } from "@/components/cart/cart-icon"
import { useState } from "react"

const navLinks = [
  { href: "/shops", label: "Browse Shops", icon: Store },
  { href: "/shops?view=map", label: "Map View", icon: MapPin },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-semibold text-lg sm:inline-block">
            Shop<span className="text-primary">SaaS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href || pathname.startsWith(link.href.split("?")[0])
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <CartIcon />

          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <Link href="/dashboard">
              <Store className="h-4 w-4" />
              Merchant
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link href="/auth">
              <User className="h-5 w-5" />
              <span className="sr-only">Sign In / Register</span>
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6 pt-6">
                <SearchBar onSearch={() => setMobileMenuOpen(false)} />
                
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 text-base font-medium transition-colors hover:text-primary ${
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="border-t pt-4 flex flex-col gap-3">
                  <Button asChild variant="outline" className="w-full justify-start gap-3">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Store className="h-5 w-5" />
                      Merchant Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start gap-3">
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-5 w-5" />
                      Sign In / Register
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="container px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  )
}
