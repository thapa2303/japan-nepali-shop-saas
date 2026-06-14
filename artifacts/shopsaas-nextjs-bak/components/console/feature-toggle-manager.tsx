"use client"

import { useState } from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { featureFlags } from "@/lib/mock-data/console"
import { toast } from "@/hooks/use-toast"

export function FeatureToggleManager() {
  const [flags, setFlags] = useState<Record<string, boolean>>(
    Object.fromEntries(featureFlags.map((f) => [f.key, f.defaultEnabled])),
  )

  const categories = Array.from(new Set(featureFlags.map((f) => f.category)))

  const toggle = (key: string, name: string, value: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: value }))
    toast({
      title: value ? "Feature enabled" : "Feature disabled",
      description: `${name} is now ${value ? "on" : "off"} platform-wide.`,
    })
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Feature Toggles"
        description="Control platform-wide feature defaults. Per-tenant overrides apply on top of these."
      />

      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {category}
              {category === "Beta" ? (
                <Badge variant="outline" className="bg-accent/30 text-accent-foreground border-accent">
                  Beta
                </Badge>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureFlags
              .filter((f) => f.category === category)
              .map((f) => (
                <div key={f.key} className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </div>
                  <Switch
                    checked={flags[f.key]}
                    onCheckedChange={(v) => toggle(f.key, f.name, v)}
                    aria-label={`Toggle ${f.name}`}
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
