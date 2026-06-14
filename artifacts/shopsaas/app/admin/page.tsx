import Link from "next/link"
import { TrendingUp, Store, ShoppingBag, Wallet, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { GmvChart, MrrChart, TierDistributionChart } from "@/components/admin/platform-charts"
import { MerchantStatusBadge, TierBadge } from "@/components/admin/admin-badges"
import {
  platformStats,
  platformMerchants,
  getShopName,
  planRevenue,
} from "@/lib/mock-data/platform"
import { formatYen } from "@/lib/dashboard-utils"

export default function AdminAnalyticsPage() {
  // Top merchants by monthly revenue (cross-merchant aggregation)
  const topMerchants = [...platformMerchants]
    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    .slice(0, 5)

  const totalPlanRevenue = planRevenue.reduce((sum, p) => sum + p.monthlyRevenue, 0)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Platform Analytics"
        description="Marketplace-wide performance across all merchants on Nepali Shops Japan."
      >
        <Button asChild variant="outline">
          <Link href="/admin/merchants">Manage merchants</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly GMV"
          value={formatYen(platformStats.monthlyGmv)}
          icon={TrendingUp}
          change={12.1}
          changeLabel="vs last month"
        />
        <StatCard
          title="Recurring Revenue (MRR)"
          value={formatYen(totalPlanRevenue + platformStats.monthlyCommission)}
          icon={Wallet}
          change={8.3}
          changeLabel="plans + commission"
        />
        <StatCard
          title="Active Merchants"
          value={`${platformStats.activeMerchants}`}
          icon={Store}
          change={9.4}
          changeLabel={`${platformStats.totalMerchants} total`}
        />
        <StatCard
          title="Total Orders"
          value={platformStats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          change={10.9}
          changeLabel="this month"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gross Merchandise Value</CardTitle>
            <CardDescription>Total value transacted across the marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <GmvChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Merchants by Plan</CardTitle>
            <CardDescription>Subscription tier distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <TierDistributionChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
            <CardDescription>Subscription fees collected from merchants</CardDescription>
          </CardHeader>
          <CardContent>
            <MrrChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plan Revenue Breakdown</CardTitle>
            <CardDescription>Monthly fees by tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {planRevenue.map((plan) => {
              const pct = totalPlanRevenue > 0 ? (plan.monthlyRevenue / totalPlanRevenue) * 100 : 0
              return (
                <div key={plan.tier} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{plan.tier}</span>
                    <span className="text-muted-foreground">{formatYen(plan.monthlyRevenue)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{plan.merchants} merchants</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Merchants</CardTitle>
            <CardDescription>Ranked by monthly revenue this period</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/merchants" className="gap-1">
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {topMerchants.map((merchant, index) => (
            <div
              key={merchant.shopId}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{getShopName(merchant.shopId)}</p>
                <p className="text-xs text-muted-foreground">
                  {merchant.totalOrders} orders · {merchant.productCount} products
                </p>
              </div>
              <TierBadge tier={merchant.tier} />
              <MerchantStatusBadge status={merchant.status} />
              <div className="hidden text-right sm:block">
                <p className="font-semibold">{formatYen(merchant.monthlyRevenue)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatYen(merchant.commissionEarned)} commission
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
