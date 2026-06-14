"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Plus, Building2, Loader2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchConsoleTenants, type ConsoleTenant } from "@/lib/api-client"
import { tierConfig, formatYen, formatDate } from "@/lib/dashboard-utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  active:    { label: "Active",    className: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  pending:   { label: "Pending",   className: "border-amber-300 text-amber-700 bg-amber-50" },
  suspended: { label: "Suspended", className: "border-red-300 text-red-700 bg-red-50" },
}

function getStatusConfig(status: string) {
  return statusConfig[status] ?? { label: status, className: "" }
}

const statusFilters = ["all", "active", "pending", "suspended"] as const

export function TenantList() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("all")
  const [tenants, setTenants] = useState<ConsoleTenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params: Record<string, string> = { limit: "50" }
    if (status !== "all") params.status = status
    fetchConsoleTenants(params)
      .then((r) => setTenants(r.tenants ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status])

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.slug.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <DashboardHeader title="Tenants" description="Every marketplace instance running on the platform.">
        <Button asChild>
          <Link href="/console/tenants/new">
            <Plus className="h-4 w-4" />
            Create tenant
          </Link>
        </Button>
      </DashboardHeader>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or slug"
            className="pl-10"
          />
        </div>
        <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <TabsList>
            {statusFilters.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {s === "all" ? "All" : (statusConfig[s]?.label ?? s)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="h-full transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.slug}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusConfig(t.status).className}>
                    {getStatusConfig(t.status).label}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={tierConfig[t.subscriptionTier]?.className ?? ""}>
                    {tierConfig[t.subscriptionTier]?.label ?? t.subscriptionTier}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Since {formatDate(t.createdAt)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
                  <div>
                    <p className="text-sm font-semibold">{t.productCount}</p>
                    <p className="text-[11px] text-muted-foreground">Products</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.orderCount}</p>
                    <p className="text-[11px] text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{formatYen(t.revenue)}</p>
                    <p className="text-[11px] text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No tenants match your filters.
        </div>
      ) : null}
    </div>
  )
}
