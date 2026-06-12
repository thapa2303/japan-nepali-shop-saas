"use client"

import { usePathname } from "next/navigation"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  )
}
