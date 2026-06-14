"use client"

import { useState } from "react"
import { Bell, Globe, Lock, Save, Trash2, ShieldAlert } from "lucide-react"

import type { CustomerProfile } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const notificationOptions: { key: keyof CustomerProfile["notifications"]; label: string; desc: string }[] = [
  { key: "orderUpdates", label: "Order updates", desc: "Status changes and delivery alerts for your orders." },
  { key: "promotions", label: "Promotions & deals", desc: "Discounts and special offers from local shops." },
  { key: "newShops", label: "New shops nearby", desc: "Get notified when new shops open in your area." },
  { key: "newsletter", label: "Newsletter", desc: "Community news and platform updates." },
]

export function CustomerSettingsView({ customer }: { customer: CustomerProfile }) {
  const [notifications, setNotifications] = useState(customer.notifications)
  const [language, setLanguage] = useState<"en" | "ne">(customer.preferredLanguage)

  const toggle = (key: keyof CustomerProfile["notifications"]) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }))

  const handleSavePrefs = () => {
    toast({ title: "Preferences saved", description: "Your notification and language settings have been updated." })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Password updated", description: "Your password has been changed successfully." })
  }

  const handleDelete = () => {
    toast({
      title: "Account deletion requested",
      description: "We've started the process. You'll receive a confirmation email.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Language &amp; region
          </CardTitle>
          <CardDescription>Choose the language you want to use across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:max-w-xs">
          <Label htmlFor="language">Preferred language</Label>
          <Select value={language} onValueChange={(v) => setLanguage(v as "en" | "ne")}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </CardTitle>
          <CardDescription>Manage how you hear from us.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {notificationOptions.map((opt, i) => (
            <div key={opt.key}>
              {i > 0 ? <Separator className="my-3" /> : null}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={opt.key} className="font-medium">
                    {opt.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <Switch id={opt.key} checked={notifications[opt.key]} onCheckedChange={() => toggle(opt.key)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <Button onClick={handleSavePrefs}>
          <Save className="h-4 w-4" /> Save preferences
        </Button>
      </div>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Password
          </CardTitle>
          <CardDescription>Update your password regularly to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4 sm:max-w-md">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" required autoComplete="current-password" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" required autoComplete="new-password" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type="password" required autoComplete="new-password" />
            </div>
            <div>
              <Button type="submit" variant="outline">
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" /> Danger zone
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Your order history and saved addresses will be removed.
          </p>
          <Button variant="destructive" onClick={handleDelete} className="shrink-0">
            <Trash2 className="h-4 w-4" /> Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
