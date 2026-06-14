import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Store, 
  CreditCard, 
  Users, 
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/shop", label: "Shop Profile", icon: Store },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/staff", label: "Staff", icon: Users },
];

export function DashboardSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 border-r bg-sidebar h-[100dvh] flex flex-col sticky top-0">
      <div className="p-4 border-b h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight">Merchant Portal</span>
        </Link>
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
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">{user?.displayName}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate w-40">{user?.email}</span>
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
