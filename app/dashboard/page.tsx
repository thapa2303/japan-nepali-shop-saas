import Link from "next/link"
import { DollarSign, ShoppingBag, Package, Clock, ArrowRight } from "lucide-react"

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
import { getShopById } from "@/lib/mock-data/shops"
import { getProductsByShopId } from "@/lib/mock-data/products"
import {
  CURRENT_MERCHANT_SHOP_ID,
  getOrdersByShopId,
  monthlySales,
} from "@/lib/mock-data/merchant"
import { formatYen, formatDateTime } from "@/lib/dashboard-utils"

export default function DashboardOverviewPage() {
  const shop = getShopById(CURRENT_MERCHANT_SHOP_ID)
  const orders = getOrdersByShopId(CURRENT_MERCHANT_SHOP_ID)
  const products = getProductsByShopId(CURRENT_MERCHANT_SHOP_ID)

  const thisMonth = monthlySales[monthlySales.length - 1]
  const lastMonth = monthlySales[monthlySales.length - 2]
  const revenueChange = Math.round(
    ((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100
  )
  const orderChange = Math.round(
    ((thisMonth.orders - lastMonth.orders) / lastMonth.orders) * 100
  )

  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
  ).length
  const lowStock = products.filter((p) => (p.stockCount ?? 0) < 50).length
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${shop?.name?.split(" ")[0]}`}
        description="Here's how your shop is performing this month."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (Jun)"
          value={formatYen(thisMonth.revenue)}
          icon={DollarSign}
          change={revenueChange}
          changeLabel="vs last month"
        />
        <StatCard
          title="Orders (Jun)"
          value={String(thisMonth.orders)}
          icon={ShoppingBag}
          change={orderChange}
          changeLabel="vs last month"
        />
        <StatCard
          title="Active Products"
          value={String(products.length)}
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
            <RevenueChart />
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
            <div className="mt-2 rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="font-medium">
                {lowStock} product{lowStock === 1 ? "" : "s"} low on stock
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Restock items below 50 units to avoid missed sales.
              </p>
            </div>
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
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatYen(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
