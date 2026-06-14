"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  CheckCircle2,
  Ban,
  RotateCcw,
  MapPin,
  Star,
  MoreHorizontal,
  Eye,
  Loader2,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { MerchantStatusBadge, TierBadge } from "@/components/admin/admin-badges"
import { formatYen, formatDate } from "@/lib/dashboard-utils"
import { fetchConsoleTenants, updateConsoleTenant } from "@/lib/api-client"
import type { MerchantStatus } from "@/lib/types"

type FilterStatus = "all" | MerchantStatus

interface Merchant {
  id: string
  name: string
  subscriptionTier: string
  status: string
  createdAt: string
  orderCount: number
  productCount: number
  revenue: number
  mrr: number
}

const filters: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
]

export function MerchantManager() {
  const { toast } = useToast()
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [reviewing, setReviewing] = useState<Merchant | null>(null)

  useEffect(() => {
    fetchConsoleTenants({ limit: "100" })
      .then((data) => setMerchants(data.tenants ?? []))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return merchants.filter((m) => {
      const matchesStatus = statusFilter === "all" || m.status === statusFilter
      const matchesSearch =
        !search || m.name.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [merchants, search, statusFilter])

  async function updateStatus(id: string, status: MerchantStatus) {
    try {
      await updateConsoleTenant(id, { status })
      setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
      const merchant = merchants.find((m) => m.id === id)
      const labels: Record<MerchantStatus, string> = {
        active: "approved and is now live",
        suspended: "suspended",
        pending: "moved back to pending review",
      }
      toast({
        title: merchant?.name ?? "Merchant",
        description: `Merchant ${labels[status]}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update merchant status",
        variant: "destructive",
      })
    }
    setReviewing(null)
  }

  const counts = {
    all: merchants.length,
    active: merchants.filter((m) => m.status === "active").length,
    pending: merchants.filter((m) => m.status === "pending").length,
    suspended: merchants.filter((m) => m.status === "suspended").length,
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
          <TabsList>
            {filters.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="gap-1.5">
                {f.label}
                <span className="rounded bg-muted-foreground/15 px-1.5 text-xs">
                  {counts[f.value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search merchants"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No merchants match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((merchant) => (
            <Card key={merchant.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">{merchant.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{merchant.name}</span>
                    <TierBadge tier={merchant.subscriptionTier as "starter" | "growth" | "premium"} />
                    <MerchantStatusBadge status={merchant.status as MerchantStatus} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>Joined {formatDate(typeof merchant.createdAt === "string" ? merchant.createdAt : new Date(merchant.createdAt).toISOString())}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center sm:flex sm:gap-6">
                  <div>
                    <p className="text-sm font-semibold">{formatYen(merchant.revenue)}</p>
                    <p className="text-[11px] text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{merchant.orderCount}</p>
                    <p className="text-[11px] text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{merchant.productCount}</p>
                    <p className="text-[11px] text-muted-foreground">Products</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {merchant.status === "pending" ? (
                    <Button size="sm" onClick={() => setReviewing(merchant)}>
                      Review
                    </Button>
                  ) : null}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Merchant actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setReviewing(merchant)}>
                        <Eye className="h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {merchant.status !== "active" ? (
                        <DropdownMenuItem onClick={() => updateStatus(merchant.id, "active")}>
                          <CheckCircle2 className="h-4 w-4" />
                          {merchant.status === "pending" ? "Approve" : "Reactivate"}
                        </DropdownMenuItem>
                      ) : null}
                      {merchant.status !== "suspended" ? (
                        <DropdownMenuItem
                          onClick={() => updateStatus(merchant.id, "suspended")}
                          className="text-destructive focus:text-destructive"
                        >
                          <Ban className="h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => updateStatus(merchant.id, "pending")}>
                          <RotateCcw className="h-4 w-4" />
                          Move to pending
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!reviewing} onOpenChange={(open) => !open && setReviewing(null)}>
        <DialogContent>
          {reviewing ? (
            <>
              <DialogHeader>
                <DialogTitle>{reviewing.name}</DialogTitle>
                <DialogDescription>Tenant ID: {reviewing.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <MerchantStatusBadge status={reviewing.status as MerchantStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <TierBadge tier={reviewing.subscriptionTier as "starter" | "growth" | "premium"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products listed</span>
                  <span>{reviewing.productCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total revenue</span>
                  <span>{formatYen(reviewing.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MRR</span>
                  <span>{formatYen(reviewing.mrr)}</span>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                {reviewing.status !== "suspended" ? (
                  <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => updateStatus(reviewing.id, "suspended")}
                  >
                    <Ban className="h-4 w-4" />
                    Suspend
                  </Button>
                ) : null}
                {reviewing.status !== "active" ? (
                  <Button onClick={() => updateStatus(reviewing.id, "active")}>
                    <CheckCircle2 className="h-4 w-4" />
                    {reviewing.status === "pending" ? "Approve merchant" : "Reactivate"}
                  </Button>
                ) : null}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
