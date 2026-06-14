import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Store, 
  CreditCard, 
  Users, 
  LogOut,
  Settings,
  Tag,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useGetDashboardSubscription, useGetDashboardShop } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/shop", label: "Shop Profile", icon: Store },
  { href: "/dashboard/coupons", label: "Coupons", icon: Tag },
  { href: "/dashboard/store-categories", label: "Categories", icon: FolderOpen },
  { href: "/dashboard/staff", label: "Staff", icon: Users },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
];

export function DashboardSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: subscription } = useGetDashboardSubscription();
  const { data: shop } = useGetDashboardShop();

  return (
    <div className="w-64 border-r bg-sidebar h-[100dvh] flex flex-col sticky top-0">
      <div className="p-4 border-b h-auto min-h-16 flex flex-col justify-center">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight truncate max-w-[180px]">
            {shop?.name ?? "Merchant Portal"}
          </span>
        </Link>
        {subscription && (
          <div className="flex items-center gap-1.5 mt-1 ml-8">
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 capitalize">{subscription.tier}</Badge>
            <span className="text-xs text-sidebar-foreground/60">{subscription.planName} Plan</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {user?.roles.includes("TENANT_ADMIN") && (
            <Link href="/admin">
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer mt-4",
                  location.startsWith("/admin")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Tenant Admin
              </span>
            </Link>
          )}
        </nav>
      </div>

      <div className="p-4 border-t">
        {subscription && (
          <div className="px-3 py-1.5 mb-2 rounded-md bg-sidebar-accent/30">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{subscription.planName} Plan</p>
            <p className="text-xs text-sidebar-foreground/60">
              {subscription.currentProductCount}/{subscription.productLimit} products
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">{user?.displayName}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
