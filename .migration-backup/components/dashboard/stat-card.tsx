import type { LucideIcon } from "lucide-react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  change?: number
  changeLabel?: string
}

export function StatCard({ title, value, icon: Icon, change, changeLabel }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
        {change !== undefined ? (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                isPositive ? "text-chart-2" : "text-destructive"
              )}
            >
              {isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </span>
            {changeLabel ? (
              <span className="text-muted-foreground">{changeLabel}</span>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
