import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { ShoppingBag, Search, Menu, User, Store, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StorefrontNavbar() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: cart } = useGetCart({
    query: {
      queryKey: getGetCartQueryKey(),
      enabled: !!user,
    },
  });

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight text-primary">ShopSaaS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/shops" className="hover:text-foreground transition-colors">
              Shops
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/search")}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setLocation("/cart")}>
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {user.roles.includes("PLATFORM_SUPER_ADMIN") && (
                    <DropdownMenuItem onClick={() => setLocation("/console")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Platform Console
                    </DropdownMenuItem>
                  )}
                  
                  {(user.roles.includes("MERCHANT") || user.roles.includes("TENANT_ADMIN")) && (
                    <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                      <Store className="mr-2 h-4 w-4" />
                      Merchant Dashboard
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={() => setLocation("/account")}>
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/orders")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setLocation("/login")}>
                Log in
              </Button>
              <Button onClick={() => setLocation("/register")}>
                Become a Merchant
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
