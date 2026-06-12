"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Store,
  CreditCard,
  ChevronLeft,
  Star,
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
import { getShopById } from "@/lib/mock-data/shops"
import { CURRENT_MERCHANT_SHOP_ID, merchantSubscription, getPlanByTier } from "@/lib/mock-data/merchant"

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Shop Profile", href: "/dashboard/profile", icon: Store },
  { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const shop = getShopById(CURRENT_MERCHANT_SHOP_ID)
  const plan = getPlanByTier(merchantSubscription.tier)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={shop?.logo || "/placeholder.svg"}
              alt={shop?.name || "Shop"}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">{shop?.name}</span>
            <span className="truncate text-xs text-muted-foreground">Merchant Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
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
        <div className="rounded-lg bg-sidebar-accent p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{plan?.name} Plan</span>
            <Badge variant="secondary" className="ml-auto text-[10px] capitalize">
              {merchantSubscription.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Renews {new Date(merchantSubscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        </div>
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
