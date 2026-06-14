"use client"

import { useState } from "react"
import { ChevronDown, Phone, MapPin, ArrowRight, X } from "lucide-react"

import type { DashboardOrder, OrderStatus } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge"
import {
  formatYen,
  formatDateTime,
  paymentMethodLabels,
  getNextStatus,
  orderStatusConfig,
} from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const filterTabs: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out-for-delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function OrderManager({ initialOrders }: { initialOrders: DashboardOrder[] }) {
  const [orders, setOrders] = useState<DashboardOrder[]>(initialOrders)
  const [filter, setFilter] = useState<OrderStatus | "all">("all")
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const advance = (order: DashboardOrder) => {
    const next = getNextStatus(order.status)
    if (!next) return
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    )
    toast({
      title: `Order ${order.id} updated`,
      description: `Status changed to ${orderStatusConfig[next].label}.`,
    })
  }

  const cancel = (order: DashboardOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" } : o))
    )
    toast({ title: `Order ${order.id} cancelled`, variant: "destructive" })
  }

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <>
      <DashboardHeader
        title="Orders"
        description="Track and fulfill incoming orders from your customers."
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as OrderStatus | "all")}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {filterTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              {tab.label}
              <span className="rounded bg-muted px-1.5 text-xs text-muted-foreground">
                {tab.value === "all" ? orders.length : counts[tab.value] ?? 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3">
        {filtered.map((order) => {
          const next = getNextStatus(order.status)
          const isOpen = openId === order.id
          const canCancel = order.status !== "delivered" && order.status !== "cancelled"
          return (
            <Card key={order.id}>
              <Collapsible open={isOpen} onOpenChange={(o) => setOpenId(o ? order.id : null)}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                          />
                          <span className="sr-only">Toggle details</span>
                        </Button>
                      </CollapsibleTrigger>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{order.id}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {order.customerName} · {order.items.length} item
                          {order.items.length === 1 ? "" : "s"} · {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-11 sm:pl-0">
                      <span className="font-semibold">{formatYen(order.total)}</span>
                      {next ? (
                        <Button size="sm" onClick={() => advance(order)}>
                          Mark {orderStatusConfig[next].label}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <CollapsibleContent>
                    <Separator className="my-4" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-muted-foreground">Customer</p>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" /> {order.customerPhone}
                        </p>
                        <p className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {order.deliveryAddress}
                        </p>
                        <p className="text-muted-foreground">
                          Payment: {paymentMethodLabels[order.paymentMethod]}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-muted-foreground">Items</p>
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between gap-2">
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span className="text-muted-foreground">
                              {formatYen(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>{formatYen(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Delivery</span>
                          <span>{formatYen(order.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatYen(order.total)}</span>
                        </div>
                      </div>
                    </div>
                    {canCancel ? (
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancel(order)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="mr-1 h-4 w-4" /> Cancel order
                        </Button>
                      </div>
                    ) : null}
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          )
        })}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No orders in this category.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  )
}
