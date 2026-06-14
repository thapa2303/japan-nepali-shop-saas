"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { ShopProfileForm } from "@/components/dashboard/shop-profile-form"
import { fetchDashboardShop } from "@/lib/api-client"
import type { Shop } from "@/lib/types"

export default function DashboardProfilePage() {
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardShop()
      .then((data) => setShop(data as unknown as Shop))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No shop found. Create a shop first.
      </div>
    )
  }

  return <ShopProfileForm shop={shop} />
}
