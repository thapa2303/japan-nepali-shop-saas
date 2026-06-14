"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DollarSign, ShoppingBag, Package, Clock, ArrowRight, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge"
import { formatYen, formatDateTime } from "@/lib/dashboard-utils"
import { fetchDashboardAnalytics, fetchDashboardOrders, fetchDashboardShop, type DashboardAnalytics, type DashboardOrderItem } from "@/lib/api-client"

export default function DashboardOverviewPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [orders, setOrders] = useState<DashboardOrderItem[]>([])
  const [shopName, setShopName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, ordersData, shopData] = await Promise.all([
          fetchDashboardAnalytics("month").catch(() => null),
          fetchDashboardOrders({ limit: "20" }).catch(() => null),
          fetchDashboardShop().catch(() => null),
        ])
        if (analyticsData) setAnalytics(analyticsData)
        if (ordersData) {
          setOrders(ordersData.orders)
        }
        if (shopData) setShopName(String(shopData.name ?? ""))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
  ).length

  const revenue = analytics?.totalRevenue ?? 0
  const orderCount = analytics?.orderCount ?? 0

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title={shopName ? `Welcome back, ${shopName.split(" ")[0]}` : "Welcome back"}
        description="Here's how your shop is performing this month."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (This Month)"
          value={formatYen(revenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Orders (This Month)"
          value={String(orderCount)}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Products"
          value={String(analytics?.topProducts?.length ?? 0)}
          icon={Package}
        />
        <StatCard
          title="Orders to Fulfill"
          value={String(pendingOrders)}
          icon={Clock}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue trend</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/analytics">
                Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RevenueChart data={analytics?.revenueByDay ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="justify-between">
              <Link href="/dashboard/products">
                Manage products <Package className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-between">
              <Link href="/dashboard/orders">
                View orders <ShoppingBag className="h-4 w-4" />
              </Link>
            </Button>
            {pendingOrders > 0 && (
              <div className="mt-2 rounded-lg border bg-muted/40 p-3 text-sm">
                <p className="font-medium">
                  {pendingOrders} order{pendingOrders === 1 ? "" : "s"} to fulfill
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  Check your orders page to process pending deliveries.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/orders">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No orders yet. Share your shop to start receiving orders.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber ?? order.id.slice(0, 8)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {formatDateTime(typeof order.createdAt === "string" ? order.createdAt : order.createdAt.toISOString())}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status as never} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatYen(order.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
