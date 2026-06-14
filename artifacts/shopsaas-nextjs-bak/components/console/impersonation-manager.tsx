"use client"

import { useState } from "react"
import { LogIn, ShieldAlert, Clock } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tenants, tenantStatusConfig } from "@/lib/mock-data/console"
import { tierConfig } from "@/lib/dashboard-utils"
import { toast } from "@/hooks/use-toast"

const recentSessions = [
  { id: "s1", tenant: "Asia Market EU", operator: "Sabin Karki", reason: "Order sync issue", when: "2h ago", duration: "12m" },
  { id: "s2", tenant: "Spice Route Canada", operator: "Priya Sharma", reason: "Billing dispute", when: "Yesterday", duration: "8m" },
  { id: "s3", tenant: "Desi Bazaar UK", operator: "Sabin Karki", reason: "Feature walkthrough", when: "2 days ago", duration: "25m" },
]

export function ImpersonationManager() {
  const [tenantId, setTenantId] = useState("")
  const [reason, setReason] = useState("")
  const selected = tenants.find((t) => t.id === tenantId)

  const startSession = () => {
    if (!selected) {
      toast({ title: "Select a tenant", description: "Choose which tenant to impersonate.", variant: "destructive" })
      return
    }
    toast({
      title: "Impersonation started",
      description: `You are now viewing the platform as ${selected.name}. This session is being audited.`,
    })
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Impersonation"
        description="Securely access a tenant's view for support and troubleshooting. Every session is logged."
      />

      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium">Impersonation is a sensitive action</p>
            <p className="text-sm text-muted-foreground">
              You will act on behalf of the tenant. Actions are recorded in the audit log with your identity.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Start a session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="tenant-select">
                Tenant
              </label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger id="tenant-select">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selected ? (
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{selected.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{selected.ownerEmail}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="outline" className={tierConfig[selected.plan].className}>
                    {tierConfig[selected.plan].label}
                  </Badge>
                  <Badge variant="outline" className={tenantStatusConfig[selected.status].className}>
                    {tenantStatusConfig[selected.status].label}
                  </Badge>
                </div>
              </div>
            ) : null}

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="reason">
                Reason (required for audit)
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Why are you impersonating?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Customer support request</SelectItem>
                  <SelectItem value="billing">Billing investigation</SelectItem>
                  <SelectItem value="bug">Bug reproduction</SelectItem>
                  <SelectItem value="onboarding">Onboarding assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={startSession}>
              <LogIn className="h-4 w-4" />
              Start impersonation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.tenant}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.operator} · {s.reason}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">{s.when}</p>
                  <p className="text-[11px] text-muted-foreground">{s.duration}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
