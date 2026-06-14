import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  merchantStatusConfig,
  customerStatusConfig,
  tierConfig,
} from "@/lib/dashboard-utils"
import type { MerchantStatus, CustomerStatus, SubscriptionTier } from "@/lib/types"

export function MerchantStatusBadge({ status }: { status: MerchantStatus }) {
  const cfg = merchantStatusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const cfg = customerStatusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

export function TierBadge({ tier }: { tier: SubscriptionTier }) {
  const cfg = tierConfig[tier]
  return (
    <Badge variant="outline" className={cn("font-medium", cfg.className)}>
      {cfg.label}
    </Badge>
  )
}
