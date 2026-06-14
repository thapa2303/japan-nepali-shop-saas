"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { tenantMonthly } from "@/lib/mock-data/console"

const mrrConfig = {
  mrr: { label: "MRR", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ConsoleMrrChart() {
  return (
    <ChartContainer config={mrrConfig} className="h-[280px] w-full">
      <AreaChart data={tenantMonthly} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillConsoleMrr" x1="0" y1="0" x2="0" y2="1">
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
          width={52}
          tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => `¥${Number(value).toLocaleString()}`} />}
        />
        <Area
          dataKey="mrr"
          type="monotone"
          stroke="var(--color-mrr)"
          strokeWidth={2}
          fill="url(#fillConsoleMrr)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
