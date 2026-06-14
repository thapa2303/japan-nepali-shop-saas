"use client"

import { useEffect, useState } from "react"
import { Truck, Store, Plus, Trash2, Loader2 } from "lucide-react"

import { fetchDashboardShop, updateDashboardShop } from "@/lib/api-client"
import { formatYen } from "@/lib/dashboard-utils"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

interface DeliveryZone {
  id: string
  name: string
  fee: number
  minOrder: number
  estimatedTime: string
  enabled: boolean
}

export function DeliverySettingsManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deliveryEnabled, setDeliveryEnabled] = useState(true)
  const [pickupEnabled, setPickupEnabled] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState("500")
  const [deliveryTime, setDeliveryTime] = useState("30-60 min")
  const [zones, setZones] = useState<DeliveryZone[]>([])

  useEffect(() => {
    fetchDashboardShop()
      .then((shop) => {
        const s = shop as Record<string, unknown>
        if (s.deliveryFee != null) setDeliveryFee(String(s.deliveryFee))
        if (s.deliveryTime) setDeliveryTime(String(s.deliveryTime))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleZone = (id: string) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z)))
  }

  const removeZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id))
    toast({ title: "Delivery zone removed" })
  }

  const addZone = () => {
    setZones((prev) => [
      ...prev,
      {
        id: `dz-${Date.now()}`,
        name: "New zone",
        fee: Number(deliveryFee) || 500,
        minOrder: 2000,
        estimatedTime: deliveryTime || "30-60 min",
        enabled: true,
      },
    ])
  }

  const save = async () => {
    setSaving(true)
    try {
      await updateDashboardShop({
        deliveryFee: Number(deliveryFee) || 0,
        deliveryTime: deliveryTime || null,
      })
      toast({ title: "Delivery settings saved", description: "Your changes have been applied." })
    } catch (e: unknown) {
      toast({ title: "Error saving settings", description: (e as Error).message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader title="Delivery settings" description="Configure how customers receive their orders.">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4 text-primary" /> Fulfillment methods
            </CardTitle>
            <CardDescription>Choose how customers can get their orders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Local delivery</p>
                <p className="text-sm text-muted-foreground">Deliver orders to customer addresses</p>
              </div>
              <Switch checked={deliveryEnabled} onCheckedChange={setDeliveryEnabled} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Store pickup</p>
                <p className="text-sm text-muted-foreground">Let customers collect from your shop</p>
              </div>
              <Switch checked={pickupEnabled} onCheckedChange={setPickupEnabled} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4 text-primary" /> General
            </CardTitle>
            <CardDescription>Delivery fee and estimated time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fee">Default delivery fee (¥)</Label>
              <Input
                id="fee"
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Estimated delivery time</Label>
              <Input
                id="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="30-60 min"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Delivery zones</CardTitle>
            <CardDescription>Set fees and minimum orders per area.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addZone}>
            <Plus className="mr-1 h-4 w-4" /> Add zone
          </Button>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {zones.map((zone) => (
            <div key={zone.id} className="flex items-center gap-4 px-6 py-4">
              <Switch checked={zone.enabled} onCheckedChange={() => toggleZone(zone.id)} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{zone.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatYen(zone.fee)} delivery · Min {formatYen(zone.minOrder)} · {zone.estimatedTime}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeZone(zone.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove zone</span>
              </Button>
            </div>
          ))}
          {zones.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              No delivery zones configured. Click &ldquo;Add zone&rdquo; to create one.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
