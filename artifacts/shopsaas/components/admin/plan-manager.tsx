"use client"

import { useState } from "react"
import { Pencil, Check, X, Users, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { subscriptionPlans } from "@/lib/mock-data/merchant"
import { tierDistribution } from "@/lib/mock-data/platform"
import { formatYen } from "@/lib/dashboard-utils"
import type { SubscriptionPlan } from "@/lib/types"

export function PlanManager() {
  const { toast } = useToast()
  const [plans, setPlans] = useState<SubscriptionPlan[]>(subscriptionPlans)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ monthlyPrice: number; productLimit: number; commissionRate: number }>({
    monthlyPrice: 0,
    productLimit: 0,
    commissionRate: 0,
  })

  const merchantsOnTier = (tier: string) =>
    tierDistribution.find((t) => t.tier === tier)?.merchants ?? 0

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingTier(plan.tier)
    setDraft({
      monthlyPrice: plan.monthlyPrice,
      productLimit: plan.productLimit,
      commissionRate: plan.commissionRate,
    })
  }

  const saveEdit = (tier: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.tier === tier ? { ...p, ...draft } : p)),
    )
    setEditingTier(null)
    toast({
      title: "Plan updated",
      description: "Subscription plan changes have been saved.",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {plans.length} active plans offered to merchants
        </p>
        <Button variant="outline" size="sm" disabled>
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isEditing = editingTier === plan.tier
          return (
            <Card
              key={plan.tier}
              className={plan.highlighted ? "border-primary shadow-sm" : undefined}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.highlighted ? <Badge>Popular</Badge> : null}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {merchantsOnTier(plan.tier)} merchants
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`price-${plan.tier}`}>Monthly price (¥)</Label>
                      <Input
                        id={`price-${plan.tier}`}
                        type="number"
                        value={draft.monthlyPrice}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, monthlyPrice: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`limit-${plan.tier}`}>Product limit</Label>
                      <Input
                        id={`limit-${plan.tier}`}
                        type="number"
                        value={draft.productLimit}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, productLimit: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`comm-${plan.tier}`}>Commission rate (%)</Label>
                      <Input
                        id={`comm-${plan.tier}`}
                        type="number"
                        value={draft.commissionRate}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, commissionRate: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => saveEdit(plan.tier)}>
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingTier(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-3xl font-bold">{formatYen(plan.monthlyPrice)}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <dl className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Product limit</dt>
                        <dd className="font-medium">
                          {plan.productLimit >= 999 ? "Unlimited" : plan.productLimit}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Commission</dt>
                        <dd className="font-medium">{plan.commissionRate}%</dd>
                      </div>
                    </dl>
                    <ul className="flex flex-col gap-2 border-t pt-3 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" onClick={() => startEdit(plan)}>
                      <Pencil className="h-4 w-4" />
                      Edit plan
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
