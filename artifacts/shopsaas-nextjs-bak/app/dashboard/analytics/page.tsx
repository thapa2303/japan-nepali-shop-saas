import { DollarSign, ShoppingBag, TrendingUp, Receipt } from "lucide-react"

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
import { monthlySales, topProducts } from "@/lib/mock-data/merchant"
import { formatYen } from "@/lib/dashboard-utils"

export default function DashboardAnalyticsPage() {
  const totalRevenue = monthlySales.reduce((sum, m) => sum + m.revenue, 0)
  const totalOrders = monthlySales.reduce((sum, m) => sum + m.orders, 0)
  const avgOrderValue = Math.round(totalRevenue / totalOrders)

  const thisMonth = monthlySales[monthlySales.length - 1]
  const lastMonth = monthlySales[monthlySales.length - 2]
  const revenueChange = Math.round(
    ((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100
  )

  return (
    <>
      <DashboardHeader
        title="Sales Analytics"
        description="Understand your revenue, orders, and best-selling products over the last 6 months."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue (6mo)"
          value={formatYen(totalRevenue)}
          icon={DollarSign}
          change={revenueChange}
          changeLabel="MoM"
        />
        <StatCard title="Total Orders (6mo)" value={String(totalOrders)} icon={ShoppingBag} />
        <StatCard title="Avg. Order Value" value={formatYen(avgOrderValue)} icon={Receipt} />
        <StatCard title="Best Month" value={formatYen(thisMonth.revenue)} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue over time</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders per month</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarChart />
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
                {topProducts.map((product, index) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
