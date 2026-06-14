import { Link, useLocation } from "wouter";
import { 
  Activity, 
  Users, 
  LogOut,
  Settings,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Tenant Overview", icon: Activity },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 border-r bg-sidebar h-[100dvh] flex flex-col sticky top-0">
      <div className="p-4 border-b h-16 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors">
          <Settings className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight">Tenant Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(`${item.href}/`) && item.href !== "/admin");
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full justify-start mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
