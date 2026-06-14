import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Building2, Mail, User, Globe, Calendar, Store, Users, DollarSign } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTenantById, tenantStatusConfig, featureFlags } from "@/lib/mock-data/console"
import { tierConfig, formatYen, formatDate } from "@/lib/dashboard-utils"
import { TenantActions } from "@/components/console/tenant-actions"

export const metadata: Metadata = {
  title: "Tenant Detail | Console",
}

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tenant = getTenantById(id)
  if (!tenant) notFound()

  const overview = [
    { label: "Merchants", value: tenant.merchants.toLocaleString(), icon: Store },
    { label: "Customers", value: tenant.customers.toLocaleString(), icon: Users },
    { label: "MRR", value: formatYen(tenant.mrr), icon: DollarSign },
  ]

  const details = [
    { label: "Owner", value: tenant.ownerName, icon: User },
    { label: "Email", value: tenant.ownerEmail, icon: Mail },
    { label: "Region", value: tenant.region, icon: Globe },
    { label: "Created", value: formatDate(tenant.createdAt), icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/console/tenants">
          <ChevronLeft className="h-4 w-4" />
          Back to tenants
        </Link>
      </Button>

      <DashboardHeader title={tenant.name} description={`${tenant.slug}.platform.app`}>
        <TenantActions tenantName={tenant.name} status={tenant.status} />
      </DashboardHeader>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={tenantStatusConfig[tenant.status].className}>
          {tenantStatusConfig[tenant.status].label}
        </Badge>
        <Badge variant="outline" className={tierConfig[tenant.plan].className}>
          {tierConfig[tenant.plan].label} plan
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {overview.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <d.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="truncate text-sm font-medium">{d.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enabled features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureFlags.map((f) => {
                const enabled = tenant.features[f.key] ?? false
                return (
                  <div key={f.key} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{f.category}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        enabled
                          ? "bg-chart-2/20 text-foreground border-chart-2/50"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {enabled ? "On" : "Off"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
