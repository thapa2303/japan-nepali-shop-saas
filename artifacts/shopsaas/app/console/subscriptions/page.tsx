"use client"

import { useEffect, useState } from "react"
import { DollarSign, TrendingUp, AlertCircle, Clock, Loader2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { tierConfig, formatYen } from "@/lib/dashboard-utils"
import { fetchConsoleAnalytics, fetchConsoleTenants, type ConsoleAnalytics, type ConsoleTenant } from "@/lib/api-client"

const statusConfig: Record<string, { label: string; className: string }> = {
  active:    { label: "Active",    className: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  pending:   { label: "Pending",   className: "border-amber-300 text-amber-700 bg-amber-50" },
  suspended: { label: "Suspended", className: "border-red-300 text-red-700 bg-red-50" },
}

export default function SubscriptionsPage() {
  const [analytics, setAnalytics] = useState<ConsoleAnalytics | null>(null)
  const [tenants, setTenants] = useState<ConsoleTenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchConsoleAnalytics().catch(() => null),
      fetchConsoleTenants({ limit: "100" }).catch(() => ({ tenants: [] })),
    ]).then(([a, t]) => {
      if (a) setAnalytics(a)
      setTenants(t.tenants ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const tierBreakdown = (["starter", "growth", "premium"] as const).map((tier) => {
    const group = tenants.filter((t) => t.subscriptionTier === tier)
    return {
      tier,
      count: group.length,
      mrr: group.reduce((sum, t) => sum + (t.mrr ?? 0), 0),
    }
  })

  const stats = analytics ? [
    { label: "Total MRR", value: formatYen(analytics.mrr), icon: DollarSign },
    { label: "Paying merchants", value: tenants.filter((t) => t.mrr > 0).length, icon: TrendingUp },
    { label: "Active", value: analytics.activeMerchants, icon: Clock },
    { label: "Suspended", value: analytics.suspendedMerchants, icon: AlertCircle },
  ] : []

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
        title="Subscriptions"
        description="Plan distribution, recurring revenue, and billing health across merchants."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-bold">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tierBreakdown.map((t) => (
          <Card key={t.tier}>
            <CardContent className="flex flex-col gap-2 p-5">
              <Badge variant="outline" className={`w-fit ${tierConfig[t.tier]?.className ?? ""}`}>
                {tierConfig[t.tier]?.label ?? t.tier}
              </Badge>
              <p className="text-2xl font-bold">{formatYen(t.mrr)}</p>
              <p className="text-xs text-muted-foreground">{t.count} merchants</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing by merchant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Merchant</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">MRR</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{t.name}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={tierConfig[t.subscriptionTier]?.className ?? ""}>
                        {tierConfig[t.subscriptionTier]?.label ?? t.subscriptionTier}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={statusConfig[t.status]?.className ?? ""}>
                        {statusConfig[t.status]?.label ?? t.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-medium">{formatYen(t.mrr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tenants.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No merchants found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
