"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { BillingView } from "@/components/dashboard/billing-view"
import type { MerchantSubscription, SubscriptionPlan } from "@/lib/types"
import { fetchDashboardSubscription } from "@/lib/api-client"

export default function DashboardSubscriptionPage() {
  const [subscription, setSubscription] = useState<MerchantSubscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardSubscription()
      .then((data) => {
        const sub: MerchantSubscription = {
          shopId: "",
          tier: data.tier as "starter" | "growth" | "premium",
          status: data.status === "active" ? "active" : "trialing",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          invoices: [],
        }
        setSubscription(sub)
        setProductCount(data.currentProductCount ?? 0)
        setPlans(
          (data.plans ?? []).map((p: { tier: string; name: string; monthlyPrice: number; productLimit: number; commissionRate: number }) => ({
            tier: p.tier as "starter" | "growth" | "premium",
            name: p.name,
            monthlyPrice: p.monthlyPrice,
            productLimit: p.productLimit,
            commissionRate: p.commissionRate,
            features: [],
          }))
        )
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!subscription || plans.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
        Unable to load subscription data.
      </div>
    )
  }

  return (
    <BillingView
      subscription={subscription}
      plans={plans}
      productCount={productCount}
    />
  )
}
