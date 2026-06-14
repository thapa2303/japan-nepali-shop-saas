"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Building2, Globe, Calendar, Store, Users, DollarSign, Package, Loader2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { tierConfig, formatYen, formatDate } from "@/lib/dashboard-utils"
import { TenantActions } from "@/components/console/tenant-actions"
import type { TenantStatus } from "@/lib/types"
import { fetchConsoleTenant, type ConsoleTenant } from "@/lib/api-client"

const statusConfig: Record<string, { label: string; className: string }> = {
  active:    { label: "Active",    className: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  pending:   { label: "Pending",   className: "border-amber-300 text-amber-700 bg-amber-50" },
  suspended: { label: "Suspended", className: "border-red-300 text-red-700 bg-red-50" },
}

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<ConsoleTenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    fetchConsoleTenant(params.id)
      .then(setTenant)
      .catch(() => setMissing(true))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (missing || !tenant) return notFound()

  const overview = [
    { label: "Shops", value: tenant.shopCount.toLocaleString(), icon: Store },
    { label: "Users", value: tenant.userCount.toLocaleString(), icon: Users },
    { label: "Orders", value: tenant.orderCount.toLocaleString(), icon: Package },
    { label: "Revenue", value: formatYen(tenant.revenue), icon: DollarSign },
  ]

  const details = [
    { label: "Slug", value: tenant.slug, icon: Globe },
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
        <TenantActions tenantName={tenant.name} status={tenant.status as TenantStatus} />
      </DashboardHeader>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={statusConfig[tenant.status]?.className ?? ""}>
          {statusConfig[tenant.status]?.label ?? tenant.status}
        </Badge>
        <Badge variant="outline" className={tierConfig[tenant.subscriptionTier]?.className ?? ""}>
          {tierConfig[tenant.subscriptionTier]?.label ?? tenant.subscriptionTier} plan
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={`text-sm px-3 py-1 ${tierConfig[tenant.subscriptionTier]?.className ?? ""}`}>
                {tierConfig[tenant.subscriptionTier]?.label ?? tenant.subscriptionTier}
              </Badge>
              <div>
                <p className="text-2xl font-bold">{formatYen(tenant.mrr)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <div>
                <p className="text-muted-foreground">Products</p>
                <p className="font-medium">{tenant.productCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total orders</p>
                <p className="font-medium">{tenant.orderCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
