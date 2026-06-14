"use client"

import { useState } from "react"
import { Bell, Globe, ShieldAlert } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

export function MerchantSettings() {
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("jpy")
  const [notifyOrders, setNotifyOrders] = useState(true)
  const [notifyReviews, setNotifyReviews] = useState(true)
  const [notifyPayouts, setNotifyPayouts] = useState(true)
  const [shopClosed, setShopClosed] = useState(false)

  const save = () => toast({ title: "Settings saved", description: "Your preferences have been updated." })

  const closeShop = () => {
    setShopClosed(true)
    toast({ title: "Shop closed", description: "Your shop is now hidden from customers." })
  }

  const reopenShop = () => {
    setShopClosed(false)
    toast({ title: "Shop reopened", description: "Your shop is visible to customers again." })
  }

  return (
    <>
      <DashboardHeader title="Settings" description="Manage your account preferences and shop configuration.">
        <Button onClick={save}>Save changes</Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-primary" /> Preferences
          </CardTitle>
          <CardDescription>Language, currency, and regional settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="lang">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="lang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpy">JPY (¥)</SelectItem>
                <SelectItem value="npr">NPR (रू)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </CardTitle>
          <CardDescription>Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New orders</p>
              <p className="text-sm text-muted-foreground">Get notified when a customer places an order</p>
            </div>
            <Switch checked={notifyOrders} onCheckedChange={setNotifyOrders} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reviews</p>
              <p className="text-sm text-muted-foreground">Get notified about new customer reviews</p>
            </div>
            <Switch checked={notifyReviews} onCheckedChange={setNotifyReviews} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payouts</p>
              <p className="text-sm text-muted-foreground">Get notified about payouts and invoices</p>
            </div>
            <Switch checked={notifyPayouts} onCheckedChange={setNotifyPayouts} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <ShieldAlert className="h-4 w-4" /> Danger zone
          </CardTitle>
          <CardDescription>Irreversible actions for your shop account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Close shop</p>
              {shopClosed ? (
                <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                  Closed
                </Badge>
              ) : (
                <Badge variant="outline" className="border-chart-2/50 bg-chart-2/20 text-foreground">
                  Open
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Temporarily hide your shop from the marketplace</p>
          </div>
          {shopClosed ? (
            <Button variant="outline" onClick={reopenShop}>
              Reopen shop
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Close shop
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Close shop?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your shop will be hidden from customers. You can reopen it later from settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={closeShop}>Close shop</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
    </>
  )
}
