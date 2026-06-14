"use client"

import { useEffect, useState } from "react"
import { DollarSign, ShoppingBag, TrendingUp, Receipt, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { OrdersBarChart, CategoryBarChart } from "@/components/dashboard/analytics-charts"
import { formatYen } from "@/lib/dashboard-utils"
import { fetchDashboardAnalytics, type DashboardAnalytics } from "@/lib/api-client"

export default function DashboardAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardAnalytics("month")
      .then(setAnalytics)
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = analytics?.totalRevenue ?? 0
  const totalOrders = analytics?.orderCount ?? 0
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const topProducts = analytics?.topProducts ?? []
  const revenueByDay = analytics?.revenueByDay ?? []

  const ordersChartData = revenueByDay.map((d) => ({
    date: d.date,
    orders: 1,
  }))

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
        title="Sales Analytics"
        description="Understand your revenue, orders, and best-selling products."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatYen(totalRevenue)}
          icon={DollarSign}
        />
        <StatCard title="Total Orders" value={String(totalOrders)} icon={ShoppingBag} />
        <StatCard title="Avg. Order Value" value={formatYen(avgOrderValue)} icon={Receipt} />
        <StatCard title="Best Products" value={String(topProducts.length)} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue over time</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenueByDay} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders per day</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersBarChart data={ordersChartData.map((d) => ({ date: d.date, orders: d.orders }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={analytics?.categoryBreakdown ?? []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top-selling products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Units sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No sales data yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  topProducts.map((product, index) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.unitsSold}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatYen(product.revenue)}
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
