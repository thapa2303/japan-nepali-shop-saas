"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, User, Save, Package, Heart, MapPin, ChevronRight } from "lucide-react"

import type { CustomerProfile } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge"
import { toast } from "@/hooks/use-toast"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function CustomerProfileView({ customer }: { customer: CustomerProfile }) {
  const [form, setForm] = useState({
    name: customer.name,
    nameNepali: customer.nameNepali ?? "",
    email: customer.email,
    phone: customer.phone,
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = () => {
    toast({ title: "Profile updated", description: "Your personal details have been saved." })
  }

  const defaultAddress = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0]
  const joined = new Date(customer.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const stats = [
    { label: "Orders", value: customer.recentOrders.length, icon: Package },
    { label: "Addresses", value: customer.addresses.length, icon: MapPin },
    { label: "Favorites", value: customer.favoriteShopSlugs.length, icon: Heart },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Identity header */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-xl text-primary-foreground">
              {initials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{customer.name}</h2>
            {customer.nameNepali ? (
              <p className="text-sm text-muted-foreground">{customer.nameNepali}</p>
            ) : null}
            <p className="mt-1 text-sm text-muted-foreground">Member since {joined}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your name and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nameNepali">Name (Nepali)</Label>
              <Input
                id="nameNepali"
                value={form.nameNepali}
                onChange={(e) => update("nameNepali", e.target.value)}
                placeholder="नेपाली नाम"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Default address */}
      {defaultAddress ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Default delivery address</CardTitle>
              <CardDescription>{defaultAddress.label}</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/account/settings">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="text-sm leading-relaxed">
                <p className="font-medium">{defaultAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {defaultAddress.address}
                  {defaultAddress.building ? `, ${defaultAddress.building}` : ""}
                </p>
                <p className="text-muted-foreground">
                  {defaultAddress.city}, {defaultAddress.prefecture} {defaultAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{defaultAddress.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/shops">
              Browse shops <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {customer.recentOrders.slice(0, 4).map((order, i) => (
            <div key={order.id}>
              {i > 0 ? <Separator className="my-1" /> : null}
              <Link
                href={`/shops/${order.shopSlug}`}
                className="flex items-center justify-between gap-4 rounded-md p-2 transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{order.shopName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} &middot; {order.itemCount} items &middot;{" "}
                    {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">&yen;{order.total.toLocaleString()}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
