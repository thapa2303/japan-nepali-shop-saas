"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { OrderManager } from "@/components/dashboard/order-manager"
import type { DashboardOrder } from "@/lib/types"
import { fetchDashboardOrders } from "@/lib/api-client"

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDashboardOrders({ limit: "50" }).catch(() => null)
        if (data?.orders) {
          setOrders(data.orders.map((o) => ({
            id: String(o.id ?? ""),
            shopId: "",
            customerName: String(o.customerName ?? ""),
            customerPhone: String(o.customerPhone ?? ""),
            deliveryAddress: String(o.deliveryAddress ?? ""),
            items: ((o.items as unknown[]) ?? []).map((item: unknown) => {
              const i = item as Record<string, unknown>
              return {
                productId: String(i.productId ?? ""),
                name: String(i.name ?? ""),
                quantity: Number(i.quantity ?? 0),
                price: Number(i.price ?? 0),
              }
            }),
            subtotal: Number(o.subtotal ?? 0),
            deliveryFee: Number(o.deliveryFee ?? 0),
            total: Number(o.total ?? 0),
            status: (o.status ?? "pending") as DashboardOrder["status"],
            paymentMethod: (o.paymentMethod ?? "cod") as DashboardOrder["paymentMethod"],
            createdAt: typeof o.createdAt === "string" ? o.createdAt : String(o.createdAt ?? new Date().toISOString()),
          })))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <OrderManager initialOrders={orders} />
}
