import type { Metadata } from "next"
import Link from "next/link"
import { Building2, DollarSign, Store, Users, ArrowUpRight, AlertTriangle } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { consoleStats, tenants, tenantStatusConfig } from "@/lib/mock-data/console"
import { tierConfig, formatYen } from "@/lib/dashboard-utils"
import { ConsoleMrrChart } from "@/components/console/console-mrr-chart"

export const metadata: Metadata = {
  title: "Platform Overview | Console",
}

export default function ConsoleOverviewPage() {
  const stats = [
    { label: "Total MRR", value: formatYen(consoleStats.totalMrr), icon: DollarSign, hint: "+12.4% vs last month" },
    { label: "Active tenants", value: `${consoleStats.activeTenants} / ${consoleStats.totalTenants}`, icon: Building2, hint: `${consoleStats.trialTenants} on trial` },
    { label: "Total merchants", value: consoleStats.totalMerchants.toLocaleString(), icon: Store, hint: "Across all tenants" },
    { label: "Total customers", value: consoleStats.totalCustomers.toLocaleString(), icon: Users, hint: "Platform-wide" },
  ]

  const needsAttention = tenants.filter((t) => t.status === "past-due" || t.status === "suspended")

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
            <CardTitle>Recurring revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsoleMrrChart />
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
            {needsAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground">All tenants are healthy.</p>
            ) : (
              needsAttention.map((t) => (
                <Link
                  key={t.id}
                  href={`/console/tenants/${t.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.region}</p>
                  </div>
                  <Badge variant="outline" className={tenantStatusConfig[t.status].className}>
                    {tenantStatusConfig[t.status].label}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Tenants</CardTitle>
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
                  <th className="hidden pb-2 font-medium sm:table-cell">Merchants</th>
                  <th className="pb-2 text-right font-medium">MRR</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3">
                      <Link href={`/console/tenants/${t.id}`} className="font-medium hover:text-primary">
                        {t.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{t.region}</p>
                    </td>
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
                    <td className="hidden py-3 sm:table-cell">{t.merchants}</td>
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
