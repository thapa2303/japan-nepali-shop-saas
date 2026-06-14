import type { ReactNode } from "react"
import Link from "next/link"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ConsoleSidebar } from "@/components/console/console-sidebar"

export const metadata = {
  title: "Platform Console | Nepali Shops Japan",
  description: "Super admin control plane: tenants, subscriptions, feature flags, RBAC, and audit logs.",
}

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ConsoleSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">Super Admin Control Plane</span>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">Platform admin</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
