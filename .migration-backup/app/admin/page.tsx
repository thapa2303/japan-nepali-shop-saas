"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp, Store, ShoppingBag, Wallet, ArrowUpRight, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { TierBadge } from "@/components/admin/admin-badges"
import { formatYen } from "@/lib/dashboard-utils"
import { fetchConsoleAnalytics, fetchConsoleTenants, type ConsoleAnalytics } from "@/lib/api-client"

interface TopTenant {
  id: string
  name: string
  subscriptionTier: string
  orderCount: number
  productCount: number
  revenue: number
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<ConsoleAnalytics | null>(null)
  const [topTenants, setTopTenants] = useState<TopTenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, tenantsData] = await Promise.all([
          fetchConsoleAnalytics().catch(() => null),
          fetchConsoleTenants({ limit: "20" }).catch(() => null),
        ])
        if (analyticsData) setAnalytics(analyticsData)
        if (tenantsData?.tenants) {
          const sorted = [...tenantsData.tenants]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
          setTopTenants(sorted)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const mrr = analytics?.mrr ?? 0
  const gmv = analytics?.gmv ?? 0
  const activeMerchants = analytics?.activeMerchants ?? 0
  const totalMerchants = analytics?.totalMerchants ?? 0
  const totalOrders = analytics?.totalOrders ?? 0

  const tierDistribution = analytics?.tierDistribution ?? []
  const totalTierMerchants = tierDistribution.reduce((s, t) => s + t.merchants, 0)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Platform Analytics"
        description="Marketplace-wide performance across all merchants."
      >
        <Button asChild variant="outline">
          <Link href="/admin/merchants">Manage merchants</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Monthly GMV" value={formatYen(gmv)} icon={TrendingUp} />
        <StatCard title="Monthly Recurring Revenue" value={formatYen(mrr)} icon={Wallet} />
        <StatCard
          title="Active Merchants"
          value={`${activeMerchants}`}
          icon={Store}
          changeLabel={`${totalMerchants} total`}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingBag}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Merchants</CardTitle>
            <CardDescription>Ranked by total revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {topTenants.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No tenant data yet.</p>
            ) : (
              topTenants.map((tenant, index) => (
                <div key={tenant.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tenant.orderCount} orders · {tenant.productCount} products
                    </p>
                  </div>
                  <TierBadge tier={tenant.subscriptionTier as "starter" | "growth" | "premium"} />
                  <div className="hidden text-right sm:block">
                    <p className="font-semibold">{formatYen(tenant.revenue)}</p>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-end pt-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/merchants" className="gap-1">
                  View all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merchants by Plan</CardTitle>
            <CardDescription>Subscription tier distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tierDistribution.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
            ) : (
              tierDistribution.map((item) => {
                const pct = totalTierMerchants > 0 ? (item.merchants / totalTierMerchants) * 100 : 0
                return (
                  <div key={item.tier} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{item.tier}</span>
                      <span className="text-muted-foreground">{item.merchants} merchants</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
