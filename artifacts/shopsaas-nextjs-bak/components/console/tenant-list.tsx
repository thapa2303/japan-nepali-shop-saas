"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Building2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tenants, tenantStatusConfig } from "@/lib/mock-data/console"
import { tierConfig, formatYen, formatDate } from "@/lib/dashboard-utils"

const statusFilters = ["all", "active", "trial", "past-due", "suspended"] as const

export function TenantList() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("all")

  const filtered = tenants.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.region.toLowerCase().includes(query.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === "all" || t.status === status
    return matchesQuery && matchesStatus
  })

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
            placeholder="Search tenants, region, owner"
            className="pl-10"
          />
        </div>
        <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <TabsList>
            {statusFilters.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {s === "all" ? "All" : tenantStatusConfig[s]?.label ?? s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <Link key={t.id} href={`/console/tenants/${t.id}`}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.region}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={tenantStatusConfig[t.status].className}>
                    {tenantStatusConfig[t.status].label}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={tierConfig[t.plan].className}>
                    {tierConfig[t.plan].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Since {formatDate(t.createdAt)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
                  <div>
                    <p className="text-sm font-semibold">{t.merchants}</p>
                    <p className="text-[11px] text-muted-foreground">Merchants</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.customers.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">Customers</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{formatYen(t.mrr)}</p>
                    <p className="text-[11px] text-muted-foreground">MRR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No tenants match your filters.
        </div>
      ) : null}
    </div>
  )
}
