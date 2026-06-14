"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Tags,
  Settings,
  ChevronLeft,
  ShieldCheck,
  ShoppingBag,
  Package,
  FileBarChart,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { fetchConsoleAnalytics, type ConsoleAnalytics } from "@/lib/api-client"

const navItems = [
  { title: "Analytics", href: "/admin", icon: LayoutDashboard },
  { title: "Merchants", href: "/admin/merchants", icon: Store },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Plans", href: "/admin/plans", icon: CreditCard },
  { title: "Categories", href: "/admin/categories", icon: Tags },
  { title: "Reports", href: "/admin/reports", icon: FileBarChart },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [stats, setStats] = useState<ConsoleAnalytics | null>(null)

  useEffect(() => {
    fetchConsoleAnalytics()
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">Platform Admin</span>
            <span className="truncate text-xs text-muted-foreground">Nepali Shops Japan</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {stats && (
          <div className="rounded-lg bg-sidebar-accent p-3 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{stats.activeMerchants} active</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                of {stats.totalMerchants}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Merchants on the platform</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to storefront">
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to storefront</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
