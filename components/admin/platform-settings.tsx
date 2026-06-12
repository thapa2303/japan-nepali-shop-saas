"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function PlatformSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    platformName: "NepBazaar",
    supportEmail: "support@nepbazaar.jp",
    supportPhone: "03-1234-5678",
    defaultCommission: "5",
    payoutThreshold: "10000",
    allowRegistrations: true,
    autoApproveMerchants: false,
    maintenanceMode: false,
  })

  const update = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const save = () => {
    toast({
      title: "Settings saved",
      description: "Your platform settings have been updated.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic information about your platform</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="platformName">Platform name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => update("platformName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supportEmail">Support email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supportPhone">Support phone</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone}
                onChange={(e) => update("supportPhone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission & Payouts</CardTitle>
          <CardDescription>Default financial settings applied platform-wide</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="defaultCommission">Default commission (%)</Label>
              <Input
                id="defaultCommission"
                type="number"
                value={settings.defaultCommission}
                onChange={(e) => update("defaultCommission", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payoutThreshold">Minimum payout (¥)</Label>
              <Input
                id="payoutThreshold"
                type="number"
                value={settings.payoutThreshold}
                onChange={(e) => update("payoutThreshold", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merchant Onboarding</CardTitle>
          <CardDescription>Control how new merchants join the platform</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="allowRegistrations">Allow new registrations</Label>
              <p className="text-sm text-muted-foreground">
                Let new merchants sign up for the platform
              </p>
            </div>
            <Switch
              id="allowRegistrations"
              checked={settings.allowRegistrations}
              onCheckedChange={(v) => update("allowRegistrations", v)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoApproveMerchants">Auto-approve merchants</Label>
              <p className="text-sm text-muted-foreground">
                Skip manual review and approve merchants automatically
              </p>
            </div>
            <Switch
              id="autoApproveMerchants"
              checked={settings.autoApproveMerchants}
              onCheckedChange={(v) => update("autoApproveMerchants", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
          <CardDescription>Temporarily take the storefront offline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode">Maintenance mode</Label>
              <p className="text-sm text-muted-foreground">
                Show a maintenance page to all customers
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(v) => update("maintenanceMode", v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}>
          <Save className="h-4 w-4" />
          Save settings
        </Button>
      </div>
    </div>
  )
}
