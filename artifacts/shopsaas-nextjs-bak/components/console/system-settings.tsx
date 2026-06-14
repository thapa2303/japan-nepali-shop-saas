"use client"

import { useState } from "react"
import { Save, Globe, CreditCard, Bell, ShieldCheck } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export function SystemSettings() {
  const [trialDays, setTrialDays] = useState("14")
  const [currency, setCurrency] = useState("jpy")
  const [maintenance, setMaintenance] = useState(false)
  const [newSignups, setNewSignups] = useState(true)
  const [require2fa, setRequire2fa] = useState(true)
  const [billingAlerts, setBillingAlerts] = useState(true)

  const save = () => toast({ title: "Settings saved", description: "Platform configuration has been updated." })

  return (
    <div className="space-y-6">
      <DashboardHeader title="System Settings" description="Global configuration applied across all tenants.">
        <Button onClick={save}>
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-primary" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="trial">Default trial length (days)</Label>
              <Input id="trial" type="number" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Default platform currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpy">JPY (¥)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-medium">Allow new tenant signups</p>
                <p className="text-xs text-muted-foreground">Let new marketplaces self-register</p>
              </div>
              <Switch checked={newSignups} onCheckedChange={setNewSignups} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Maintenance mode</p>
                <p className="text-xs text-muted-foreground">Temporarily disable all tenant access</p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require 2FA for operators</p>
                <p className="text-xs text-muted-foreground">All console users must enable two-factor auth</p>
              </div>
              <Switch checked={require2fa} onCheckedChange={setRequire2fa} />
            </div>
            <div className="grid gap-2 border-t pt-4">
              <Label htmlFor="session">Session timeout (minutes)</Label>
              <Input id="session" type="number" defaultValue="30" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ip">IP allowlist</Label>
              <Input id="ip" placeholder="Comma-separated CIDR ranges" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-primary" />
              Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="grace">Past-due grace period (days)</Label>
              <Input id="grace" type="number" defaultValue="7" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax">Default tax rate (%)</Label>
              <Input id="tax" type="number" defaultValue="10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Billing alerts</p>
                <p className="text-xs text-muted-foreground">Notify operators on failed payments</p>
              </div>
              <Switch checked={billingAlerts} onCheckedChange={setBillingAlerts} />
            </div>
            <div className="grid gap-2 border-t pt-4">
              <Label htmlFor="ops-email">Operations email</Label>
              <Input id="ops-email" type="email" defaultValue="ops@platform.app" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
