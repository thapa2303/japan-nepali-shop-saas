"use client"

import { useState } from "react"
import { Check, Download, Star } from "lucide-react"

import type { MerchantSubscription, SubscriptionPlan } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { formatYen, formatDate } from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface BillingViewProps {
  subscription: MerchantSubscription
  plans: SubscriptionPlan[]
  productCount: number
}

const invoiceStatusClass: Record<string, string> = {
  paid: "bg-chart-2/20 text-foreground border-chart-2/50",
  pending: "bg-accent/30 text-accent-foreground border-accent",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
}

export function BillingView({ subscription, plans, productCount }: BillingViewProps) {
  const [currentTier, setCurrentTier] = useState(subscription.tier)
  const currentPlan = plans.find((p) => p.tier === currentTier)!

  const handleChangePlan = (plan: SubscriptionPlan) => {
    if (plan.tier === currentTier) return
    setCurrentTier(plan.tier)
    toast({
      title: `Switched to ${plan.name}`,
      description: `Your plan will update to ${formatYen(plan.monthlyPrice)}/month.`,
    })
  }

  const usagePct = Math.min(
    100,
    Math.round((productCount / currentPlan.productLimit) * 100)
  )

  return (
    <>
      <DashboardHeader
        title="Subscription & Billing"
        description="Manage your plan, monitor usage, and view past invoices."
      />

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">{currentPlan.name}</span>
                <Badge variant="secondary" className="capitalize">
                  {subscription.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatYen(currentPlan.monthlyPrice)}/month · {currentPlan.commissionRate}% commission · Renews{" "}
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-foreground">Products used</span>
              <span className="font-medium">
                {productCount} / {currentPlan.productLimit}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  usagePct > 90 ? "bg-destructive" : "bg-primary"
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Available plans</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.tier === currentTier
            return (
              <Card
                key={plan.tier}
                className={cn(
                  "relative flex flex-col",
                  plan.highlighted && "border-primary shadow-sm"
                )}
              >
                {plan.highlighted ? (
                  <Badge className="absolute -top-2 left-4">Most popular</Badge>
                ) : null}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">
                      {formatYen(plan.monthlyPrice)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-4 w-full"
                    variant={isCurrent ? "secondary" : plan.highlighted ? "default" : "outline"}
                    disabled={isCurrent}
                    onClick={() => handleChangePlan(plan)}
                  >
                    {isCurrent ? "Current plan" : `Switch to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscription.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.date)}
                    </TableCell>
                    <TableCell>{invoice.plan}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize", invoiceStatusClass[invoice.status])}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatYen(invoice.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Download receipt">
                        <Download className="h-4 w-4" />
                      </Button>
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
