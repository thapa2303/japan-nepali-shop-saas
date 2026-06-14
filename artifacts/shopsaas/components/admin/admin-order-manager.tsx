"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import {
  platformOrders,
  platformOrderStats,
  getOrderShopName,
} from "@/lib/mock-data/admin-operations"
import { formatYen, formatDateTime, orderStatusConfig, paymentMethodLabels } from "@/lib/dashboard-utils"
import type { OrderStatus } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function AdminOrderManager() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<OrderStatus | "all">("all")

  const filtered = platformOrders.filter((o) => {
    const matchesStatus = status === "all" || o.status === status
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      getOrderShopName(o.shopId).toLowerCase().includes(q)
    return matchesStatus && matchesQuery
  })

  const stats = [
    { label: "Total orders", value: platformOrderStats.total.toLocaleString() },
    { label: "Pending", value: platformOrderStats.pending },
    { label: "GMV", value: formatYen(platformOrderStats.gmv) },
    { label: "Commission", value: formatYen(platformOrderStats.commission) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order ID, customer, or shop"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "all")}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="out-for-delivery">Out for delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell className="text-muted-foreground">{getOrderShopName(o.shopId)}</TableCell>
                    <TableCell className="text-muted-foreground">{o.customerName}</TableCell>
                    <TableCell className="text-right font-medium">{formatYen(o.total)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatYen(o.commission)}</TableCell>
                    <TableCell className="text-muted-foreground">{paymentMethodLabels[o.paymentMethod]}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(orderStatusConfig[o.status].className)}>
                        {orderStatusConfig[o.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatDateTime(o.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No orders match your filters.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
