"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ToggleRight,
  Users,
  UserCog,
  ScrollText,
  Settings,
  ChevronLeft,
  Boxes,
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
import { consoleStats } from "@/lib/mock-data/console"

const navItems = [
  { title: "Platform Overview", href: "/console", icon: LayoutDashboard },
  { title: "Tenants", href: "/console/tenants", icon: Building2 },
  { title: "Subscriptions", href: "/console/subscriptions", icon: CreditCard },
  { title: "Feature Toggles", href: "/console/features", icon: ToggleRight },
  { title: "RBAC", href: "/console/rbac", icon: UserCog },
  { title: "Impersonation", href: "/console/impersonation", icon: Users },
  { title: "Audit Logs", href: "/console/audit", icon: ScrollText },
  { title: "System Settings", href: "/console/settings", icon: Settings },
]

export function ConsoleSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">Platform Console</span>
            <span className="truncate text-xs text-muted-foreground">SaaS Operator</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/console"
                    ? pathname === "/console"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.title === "Tenants" ? (
                          <Badge className="ml-auto h-5 min-w-5 justify-center px-1 text-[10px] group-data-[collapsible=icon]:hidden">
                            {consoleStats.totalTenants}
                          </Badge>
                        ) : null}
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
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{consoleStats.activeTenants} active</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              of {consoleStats.totalTenants}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tenants on the platform</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to admin">
              <Link href="/admin">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
