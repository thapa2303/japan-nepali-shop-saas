"use client"

import { useMemo, useState } from "react"
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
import { platformMerchants } from "@/lib/mock-data/platform"
import { getShopById } from "@/lib/mock-data/shops"
import { formatYen, formatDate } from "@/lib/dashboard-utils"
import type { MerchantStatus, PlatformMerchant } from "@/lib/types"

type FilterStatus = "all" | MerchantStatus

const filters: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
]

export function MerchantManager() {
  const { toast } = useToast()
  const [merchants, setMerchants] = useState<PlatformMerchant[]>(platformMerchants)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [reviewing, setReviewing] = useState<PlatformMerchant | null>(null)

  const filtered = useMemo(() => {
    return merchants.filter((m) => {
      const shop = getShopById(m.shopId)
      const matchesStatus = statusFilter === "all" || m.status === statusFilter
      const matchesSearch =
        !search ||
        shop?.name.toLowerCase().includes(search.toLowerCase()) ||
        shop?.location.prefecture.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [merchants, search, statusFilter])

  function updateStatus(shopId: string, status: MerchantStatus) {
    setMerchants((prev) =>
      prev.map((m) => (m.shopId === shopId ? { ...m, status } : m))
    )
    const shop = getShopById(shopId)
    const labels: Record<MerchantStatus, string> = {
      active: "approved and is now live",
      suspended: "suspended",
      pending: "moved back to pending review",
    }
    toast({
      title: `${shop?.name}`,
      description: `Merchant ${labels[status]}.`,
    })
    setReviewing(null)
  }

  const counts = {
    all: merchants.length,
    active: merchants.filter((m) => m.status === "active").length,
    pending: merchants.filter((m) => m.status === "pending").length,
    suspended: merchants.filter((m) => m.status === "suspended").length,
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
            placeholder="Search merchants or prefecture"
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
          {filtered.map((merchant) => {
            const shop = getShopById(merchant.shopId)
            if (!shop) return null
            return (
              <Card key={merchant.shopId}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={shop.logo || "/placeholder.svg"}
                      alt={shop.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{shop.name}</span>
                      <TierBadge tier={merchant.tier} />
                      <MerchantStatusBadge status={merchant.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {shop.location.area}, {shop.location.prefecture}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-accent-foreground" />
                        {shop.rating} ({shop.reviewCount})
                      </span>
                      <span>Joined {formatDate(merchant.joinedAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center sm:flex sm:gap-6">
                    <div>
                      <p className="text-sm font-semibold">{formatYen(merchant.monthlyRevenue)}</p>
                      <p className="text-[11px] text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{merchant.totalOrders}</p>
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
                          <DropdownMenuItem onClick={() => updateStatus(merchant.shopId, "active")}>
                            <CheckCircle2 className="h-4 w-4" />
                            {merchant.status === "pending" ? "Approve" : "Reactivate"}
                          </DropdownMenuItem>
                        ) : null}
                        {merchant.status !== "suspended" ? (
                          <DropdownMenuItem
                            onClick={() => updateStatus(merchant.shopId, "suspended")}
                            className="text-destructive focus:text-destructive"
                          >
                            <Ban className="h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateStatus(merchant.shopId, "pending")}>
                            <RotateCcw className="h-4 w-4" />
                            Move to pending
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={!!reviewing} onOpenChange={(open) => !open && setReviewing(null)}>
        <DialogContent>
          {reviewing
            ? (() => {
                const shop = getShopById(reviewing.shopId)
                if (!shop) return null
                return (
                  <>
                    <DialogHeader>
                      <DialogTitle>{shop.name}</DialogTitle>
                      <DialogDescription>{shop.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <MerchantStatusBadge status={reviewing.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <TierBadge tier={reviewing.tier} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>
                          {shop.location.area}, {shop.location.city}, {shop.location.prefecture}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact</span>
                        <span>{shop.contact.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Products listed</span>
                        <span>{reviewing.productCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly revenue</span>
                        <span>{formatYen(reviewing.monthlyRevenue)}</span>
                      </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-2">
                      {reviewing.status !== "suspended" ? (
                        <Button
                          variant="outline"
                          className="text-destructive"
                          onClick={() => updateStatus(reviewing.shopId, "suspended")}
                        >
                          <Ban className="h-4 w-4" />
                          Suspend
                        </Button>
                      ) : null}
                      {reviewing.status !== "active" ? (
                        <Button onClick={() => updateStatus(reviewing.shopId, "active")}>
                          <CheckCircle2 className="h-4 w-4" />
                          {reviewing.status === "pending" ? "Approve merchant" : "Reactivate"}
                        </Button>
                      ) : null}
                    </DialogFooter>
                  </>
                )
              })()
            : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
