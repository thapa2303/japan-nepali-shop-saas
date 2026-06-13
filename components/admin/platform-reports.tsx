"use client"

import { TrendingUp, TrendingDown, Download } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import {
  categorySales,
  topMerchants,
} from "@/lib/mock-data/admin-operations"
import { getShopName, platformStats } from "@/lib/mock-data/platform"
import { formatYen } from "@/lib/dashboard-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function PlatformReports() {
  const exportReport = () =>
    toast({ title: "Report exported", description: "Your CSV download will begin shortly." })

  const totalCategoryRevenue = categorySales.reduce((sum, c) => sum + c.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="outline" onClick={exportReport}>
          <Download className="mr-1 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Monthly GMV</p>
            <p className="mt-1 text-2xl font-bold">{formatYen(platformStats.monthlyGmv)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Commission earned</p>
            <p className="mt-1 text-2xl font-bold">{formatYen(platformStats.monthlyCommission)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total orders</p>
            <p className="mt-1 text-2xl font-bold">{platformStats.totalOrders.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active merchants</p>
            <p className="mt-1 text-2xl font-bold">{platformStats.activeMerchants}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by category</CardTitle>
          <CardDescription>Gross merchandise value across platform categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={categorySales} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => String(v).split(" ")[0]}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={52}
                tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => `¥${Number(value).toLocaleString()}`} />}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="var(--color-revenue)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category breakdown</CardTitle>
            <CardDescription>Share of total platform revenue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySales.map((c) => {
              const pct = Math.round((c.revenue / totalCategoryRevenue) * 100)
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.category}</span>
                    <span className="text-muted-foreground">
                      {formatYen(c.revenue)} · {pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top merchants</CardTitle>
            <CardDescription>Highest revenue shops this month.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {topMerchants.map((m, i) => (
              <div key={m.shopId} className="flex items-center gap-3 px-6 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{getShopName(m.shopId)}</p>
                  <p className="text-sm text-muted-foreground">{m.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatYen(m.revenue)}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-0.5",
                      m.growth >= 0
                        ? "border-chart-2/50 bg-chart-2/20 text-foreground"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                    )}
                  >
                    {m.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(m.growth)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
