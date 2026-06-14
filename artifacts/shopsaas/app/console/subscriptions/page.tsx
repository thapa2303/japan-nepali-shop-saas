import type { Metadata } from "next"
import { DollarSign, TrendingUp, AlertCircle, Clock } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { tenants, consoleStats, tenantStatusConfig } from "@/lib/mock-data/console"
import { tierConfig, formatYen } from "@/lib/dashboard-utils"

export const metadata: Metadata = {
  title: "Subscriptions | Console",
}

export default function SubscriptionsPage() {
  const stats = [
    { label: "Total MRR", value: formatYen(consoleStats.totalMrr), icon: DollarSign },
    { label: "Paying tenants", value: tenants.filter((t) => t.mrr > 0).length, icon: TrendingUp },
    { label: "Trials", value: consoleStats.trialTenants, icon: Clock },
    { label: "Past due", value: consoleStats.pastDueTenants, icon: AlertCircle },
  ]

  const tierBreakdown = (["starter", "growth", "premium"] as const).map((tier) => {
    const group = tenants.filter((t) => t.plan === tier)
    return {
      tier,
      count: group.length,
      mrr: group.reduce((sum, t) => sum + t.mrr, 0),
    }
  })

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Subscriptions"
        description="Plan distribution, recurring revenue, and billing health across tenants."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-bold">{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tierBreakdown.map((t) => (
          <Card key={t.tier}>
            <CardContent className="flex flex-col gap-2 p-5">
              <Badge variant="outline" className={`w-fit ${tierConfig[t.tier].className}`}>
                {tierConfig[t.tier].label}
              </Badge>
              <p className="text-2xl font-bold">{formatYen(t.mrr)}</p>
              <p className="text-xs text-muted-foreground">{t.count} tenants</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing by tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Tenant</th>
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
                      <Badge variant="outline" className={tierConfig[t.plan].className}>
                        {tierConfig[t.plan].label}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={tenantStatusConfig[t.status].className}>
                        {tenantStatusConfig[t.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-medium">{formatYen(t.mrr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
