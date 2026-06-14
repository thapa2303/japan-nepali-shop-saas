import type { ReactNode } from "react"
import { AccountNav } from "@/components/account/account-nav"

export const metadata = {
  title: "My Account | ShopSaaS",
  description: "Manage your profile, orders, addresses, and account settings.",
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance">My Account</h1>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Manage your profile, track orders, and update your preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <AccountNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
