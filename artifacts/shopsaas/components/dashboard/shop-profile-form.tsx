"use client"

import { useRef, useState } from "react"
import type { ChangeEvent } from "react"
import Image from "next/image"
import { Save, Upload } from "lucide-react"

import type { Shop } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { toast } from "@/hooks/use-toast"

const days: { key: string; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export function ShopProfileForm({ shop }: { shop: Shop }) {
  const [form, setForm] = useState({
    name: shop.name,
    nameNepali: shop.nameNepali ?? "",
    description: shop.description,
    phone: shop.contactPhone ?? "",
    whatsapp: shop.contactWhatsapp ?? "",
    email: shop.contactEmail ?? "",
    address: shop.location?.address ?? "",
    area: shop.location?.area ?? "",
    city: shop.location?.city ?? "",
    prefecture: shop.location?.prefecture ?? "",
    postalCode: shop.location?.postalCode ?? "",
    minOrder: shop.minOrder ? String(shop.minOrder) : "",
    deliveryFee: shop.deliveryFee ? String(shop.deliveryFee) : "",
    deliveryTime: shop.deliveryTime ?? "",
    isOpen: shop.isOpen,
  })
  const [hours, setHours] = useState(shop.openingHours ?? [])
  const [logoPreview, setLogoPreview] = useState(shop.logo || "/placeholder.svg")
  const [coverPreview, setCoverPreview] = useState(shop.coverImage || "/placeholder.svg")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setPreview: (value: string) => void,
    successMessage: string,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      toast({ title: successMessage })
    }
    reader.readAsDataURL(file)
    // reset so selecting the same file again still fires onChange
    e.target.value = ""
  }

  const handleSave = () => {
    toast({
      title: "Shop profile saved",
      description: "Your storefront has been updated.",
    })
  }

  return (
    <>
      <DashboardHeader
        title="Shop Profile"
        description="Manage your storefront details, contact info, and delivery settings."
      >
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Your logo and cover image shown on the storefront.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
              <Image src={logoPreview || "/placeholder.svg"} alt="Logo" fill className="object-cover" sizes="80px" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Shop logo</p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setLogoPreview, "Logo updated successfully")}
              />
              <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                <Upload className="h-4 w-4" /> Upload new logo
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Cover image</p>
            <div className="relative h-32 w-full overflow-hidden rounded-lg border">
              <Image src={coverPreview || "/placeholder.svg"} alt="Cover" fill className="object-cover" sizes="100vw" />
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, setCoverPreview, "Cover image updated successfully")}
            />
            <Button variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload new cover
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shop details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Shop name</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameNepali">Nepali name</Label>
              <Input id="nameNepali" value={form.nameNepali} onChange={(e) => update("nameNepali", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="isOpen">Shop is open</Label>
              <p className="text-xs text-muted-foreground">Toggle off to pause new orders</p>
            </div>
            <Switch id="isOpen" checked={form.isOpen} onCheckedChange={(v) => update("isOpen", v)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input id="postalCode" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prefecture">Prefecture</Label>
            <Input id="prefecture" value={form.prefecture} onChange={(e) => update("prefecture", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="area">Area</Label>
            <Input id="area" value={form.area} onChange={(e) => update("area", e.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address">Street address</Label>
            <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="minOrder">Minimum order (¥)</Label>
            <Input id="minOrder" type="number" value={form.minOrder} onChange={(e) => update("minOrder", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deliveryFee">Delivery fee (¥)</Label>
            <Input id="deliveryFee" type="number" value={form.deliveryFee} onChange={(e) => update("deliveryFee", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deliveryTime">Delivery time</Label>
            <Input id="deliveryTime" value={form.deliveryTime} onChange={(e) => update("deliveryTime", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opening hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {days.map(({ key, label }, index) => {
            const day = hours[key]
            return (
              <div key={key}>
                {index > 0 ? <Separator className="mb-3" /> : null}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-sm font-medium">{label}</span>
                  <Switch
                    checked={!day.isClosed}
                    onCheckedChange={(v) =>
                      setHours((h) => ({ ...h, [key]: { ...h[key], isClosed: !v } }))
                    }
                  />
                  {day.isClosed ? (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={day.open}
                        onChange={(e) =>
                          setHours((h) => ({ ...h, [key]: { ...h[key], open: e.target.value } }))
                        }
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={day.close}
                        onChange={(e) =>
                          setHours((h) => ({ ...h, [key]: { ...h[key], close: e.target.value } }))
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}
