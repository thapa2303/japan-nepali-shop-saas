"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { platformMonthly, tierDistribution } from "@/lib/mock-data/platform"

const gmvConfig = {
  gmv: { label: "GMV", color: "var(--chart-1)" },
} satisfies ChartConfig

const mrrConfig = {
  mrr: { label: "MRR", color: "var(--chart-2)" },
} satisfies ChartConfig

const tierColors: Record<string, string> = {
  starter: "var(--chart-4)",
  growth: "var(--chart-1)",
  premium: "var(--chart-5)",
}

const tierConfig = {
  merchants: { label: "Merchants" },
} satisfies ChartConfig

export function GmvChart() {
  return (
    <ChartContainer config={gmvConfig} className="h-[280px] w-full">
      <AreaChart data={platformMonthly} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillGmv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-gmv)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-gmv)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={52}
          tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent formatter={(value) => `¥${Number(value).toLocaleString()}`} />
          }
        />
        <Area
          dataKey="gmv"
          type="monotone"
          stroke="var(--color-gmv)"
          strokeWidth={2}
          fill="url(#fillGmv)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function MrrChart() {
  return (
    <ChartContainer config={mrrConfig} className="h-[280px] w-full">
      <AreaChart data={platformMonthly} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillMrr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-mrr)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-mrr)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={48}
          tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent formatter={(value) => `¥${Number(value).toLocaleString()}`} />
          }
        />
        <Area
          dataKey="mrr"
          type="monotone"
          stroke="var(--color-mrr)"
          strokeWidth={2}
          fill="url(#fillMrr)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function TierDistributionChart() {
  return (
    <ChartContainer config={tierConfig} className="h-[240px] w-full">
      <BarChart
        data={tierDistribution}
        layout="vertical"
        margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="tier"
          tickLine={false}
          axisLine={false}
          width={72}
          tickFormatter={(value) => String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="merchants" radius={[0, 6, 6, 0]}>
          {tierDistribution.map((entry) => (
            <Cell key={entry.tier} fill={tierColors[entry.tier]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
