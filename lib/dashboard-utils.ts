import type { OrderStatus, MerchantStatus, CustomerStatus, SubscriptionTier } from "@/lib/types"

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString()}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-accent/30 text-accent-foreground border-accent",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-chart-2/15 text-foreground border-chart-2/40",
  },
  preparing: {
    label: "Preparing",
    className: "bg-chart-5/20 text-foreground border-chart-5/40",
  },
  "out-for-delivery": {
    label: "Out for delivery",
    className: "bg-primary/15 text-primary border-primary/40",
  },
  delivered: {
    label: "Delivered",
    className: "bg-chart-2/20 text-foreground border-chart-2/50",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
}

export const paymentMethodLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  paypay: "PayPay",
  "credit-card": "Credit / Debit Card",
  "bank-transfer": "Bank Transfer",
}

// Ordered flow used for advancing an order to its next status.
export const orderStatusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "delivered",
]

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  const idx = orderStatusFlow.indexOf(status)
  if (idx === -1 || idx === orderStatusFlow.length - 1) return null
  return orderStatusFlow[idx + 1]
}

// ---------- Platform admin status config ----------

export const merchantStatusConfig: Record<
  MerchantStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-chart-2/20 text-foreground border-chart-2/50",
  },
  pending: {
    label: "Pending review",
    className: "bg-accent/30 text-accent-foreground border-accent",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
}

export const customerStatusConfig: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-chart-2/20 text-foreground border-chart-2/50",
  },
  blocked: {
    label: "Blocked",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
}

export const tierConfig: Record<
  SubscriptionTier,
  { label: string; className: string }
> = {
  starter: {
    label: "Starter",
    className: "bg-muted text-muted-foreground border-border",
  },
  growth: {
    label: "Growth",
    className: "bg-primary/15 text-primary border-primary/40",
  },
  premium: {
    label: "Premium",
    className: "bg-chart-5/20 text-foreground border-chart-5/40",
  },
}
