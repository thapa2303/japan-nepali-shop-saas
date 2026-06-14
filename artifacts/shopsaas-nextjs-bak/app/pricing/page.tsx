import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { subscriptionPlans } from "@/lib/mock-data/merchant"
import { formatYen } from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pricing Plans | ShopSaaS",
  description: "Simple, transparent pricing for merchants selling on ShopSaaS.",
}

export default function PricingPage() {
  return (
    <PageShell
      title="Pricing Plans"
      description="Choose the plan that fits your shop. Upgrade or downgrade anytime from your dashboard."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.tier}
            className={cn("relative flex flex-col", plan.highlighted && "border-primary shadow-sm")}
          >
            {plan.highlighted ? <Badge className="absolute -top-2 left-4">Most popular</Badge> : null}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">{formatYen(plan.monthlyPrice)}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                {plan.commissionRate}% commission · up to {plan.productLimit} products
              </p>
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
              <Button asChild className="mt-4 w-full" variant={plan.highlighted ? "default" : "outline"}>
                <Link href="/auth">Get started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
