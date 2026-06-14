"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const ordersConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

const categoryConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const categoryColors = [
  "var(--chart-1)",
  "var(--chart-4)",
  "var(--chart-2)",
  "var(--chart-5)",
]

interface OrdersBarChartProps {
  data?: { month?: string; date?: string; orders: number }[]
}

export function OrdersBarChart({ data }: OrdersBarChartProps) {
  const chartData = (data ?? []).map((d) => ({
    month: d.month ?? d.date ?? "",
    orders: d.orders,
  }))

  if (chartData.length === 0) {
    return <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">No data yet</div>
  }

  return (
    <ChartContainer config={ordersConfig} className="h-[260px] w-full">
      <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

interface CategoryBarChartProps {
  data?: { category: string; revenue: number }[]
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const chartData = data ?? []

  if (chartData.length === 0) {
    return <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">No data yet</div>
  }

  return (
    <ChartContainer config={categoryConfig} className="h-[260px] w-full">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 8, right: 16 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="category"
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `¥${Number(value).toLocaleString()}`}
            />
          }
        />
        <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={categoryColors[index % categoryColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
