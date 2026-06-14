"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, DollarSign, Store, Users, ArrowUpRight, AlertTriangle, Loader2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { tierConfig, formatYen } from "@/lib/dashboard-utils"
import { ConsoleMrrChart } from "@/components/console/console-mrr-chart"
import { fetchConsoleAnalytics, fetchConsoleTenants, type ConsoleAnalytics, type ConsoleTenant } from "@/lib/api-client"

const statusConfig: Record<string, { label: string; className: string }> = {
  active:    { label: "Active",    className: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  pending:   { label: "Pending",   className: "border-amber-300 text-amber-700 bg-amber-50" },
  suspended: { label: "Suspended", className: "border-red-300 text-red-700 bg-red-50" },
}

function getStatusConfig(status: string) {
  return statusConfig[status] ?? { label: status, className: "" }
}

export default function ConsoleOverviewPage() {
  const [analytics, setAnalytics] = useState<ConsoleAnalytics | null>(null)
  const [tenants, setTenants] = useState<ConsoleTenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchConsoleAnalytics().catch(() => null),
      fetchConsoleTenants({ limit: "10" }).catch(() => ({ tenants: [] })),
    ]).then(([a, t]) => {
      if (a) setAnalytics(a)
      setTenants(t.tenants ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const stats = analytics ? [
    { label: "MRR", value: formatYen(analytics.mrr), icon: DollarSign, hint: "Monthly recurring revenue" },
    { label: "Active merchants", value: `${analytics.activeMerchants} / ${analytics.totalMerchants}`, icon: Building2, hint: `${analytics.suspendedMerchants} suspended` },
    { label: "GMV", value: formatYen(analytics.gmv), icon: Store, hint: "Gross merchandise value" },
    { label: "Customers", value: analytics.totalCustomers.toLocaleString(), icon: Users, hint: "Platform-wide" },
  ] : []

  const suspended = tenants.filter((t) => t.status === "suspended")

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Platform Overview"
        description="Bird's-eye view of every marketplace running on the platform."
      >
        <Button asChild>
          <Link href="/console/tenants/new">Create tenant</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.hint}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tier distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.tierDistribution && analytics.tierDistribution.length > 0 ? (
              <div className="space-y-3">
                {analytics.tierDistribution.map((td) => (
                  <div key={td.tier} className="flex items-center gap-3">
                    <Badge variant="outline" className={tierConfig[td.tier]?.className ?? ""}>
                      {tierConfig[td.tier]?.label ?? td.tier}
                    </Badge>
                    <div className="flex-1 rounded-full bg-muted h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: analytics.totalMerchants > 0 ? `${(td.merchants / analytics.totalMerchants) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{td.merchants}</span>
                  </div>
                ))}
              </div>
            ) : (
              <ConsoleMrrChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suspended.length === 0 ? (
              <p className="text-sm text-muted-foreground">All merchants are healthy.</p>
            ) : (
              suspended.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.slug}</p>
                  </div>
                  <Badge variant="outline" className={getStatusConfig(t.status).className}>
                    {getStatusConfig(t.status).label}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent tenants</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/console/tenants">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Tenant</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="hidden pb-2 font-medium sm:table-cell">Orders</th>
                  <th className="pb-2 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.slug}</p>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={tierConfig[t.subscriptionTier]?.className ?? ""}>
                        {tierConfig[t.subscriptionTier]?.label ?? t.subscriptionTier}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={getStatusConfig(t.status).className}>
                        {getStatusConfig(t.status).label}
                      </Badge>
                    </td>
                    <td className="hidden py-3 sm:table-cell">{t.orderCount}</td>
                    <td className="py-3 text-right font-medium">{formatYen(t.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tenants.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No tenants found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
