"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
