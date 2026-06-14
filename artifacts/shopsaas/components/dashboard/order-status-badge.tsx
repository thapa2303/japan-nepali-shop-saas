import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { orderStatusConfig } from "@/lib/dashboard-utils"
import type { OrderStatus } from "@/lib/types"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = orderStatusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}
