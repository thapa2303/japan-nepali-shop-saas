"use client"

import { useState } from "react"
import { Plus, Ticket, Copy, Trash2 } from "lucide-react"

import type { Coupon } from "@/lib/types"
import {
  merchantCoupons,
  couponTypeLabels,
  couponStatusConfig,
} from "@/lib/mock-data/merchant-management"
import { formatYen, formatDate } from "@/lib/dashboard-utils"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>(merchantCoupons)
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<Coupon["type"]>("percentage")
  const [value, setValue] = useState("")

  const activeCount = coupons.filter((c) => c.status === "active").length
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0)

  const formatValue = (c: Coupon) => {
    if (c.type === "percentage") return `${c.value}% off`
    if (c.type === "fixed") return `${formatYen(c.value)} off`
    return "Free shipping"
  }

  const handleCreate = () => {
    if (!code.trim() || !description.trim()) {
      toast({ title: "Missing details", description: "Add a code and description.", variant: "destructive" })
      return
    }
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.toUpperCase().trim(),
      description: description.trim(),
      type,
      value: Number(value) || 0,
      usedCount: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      status: "active",
    }
    setCoupons((prev) => [newCoupon, ...prev])
    setOpen(false)
    setCode("")
    setDescription("")
    setValue("")
    toast({ title: "Coupon created", description: `${newCoupon.code} is now active.` })
  }

  const copyCode = (c: string) => {
    navigator.clipboard?.writeText(c)
    toast({ title: "Copied", description: `${c} copied to clipboard.` })
  }

  const remove = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    toast({ title: "Coupon deleted", variant: "destructive" })
  }

  return (
    <>
      <DashboardHeader title="Coupons" description="Create and manage discount codes for your customers.">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" /> New coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create coupon</DialogTitle>
              <DialogDescription>Set up a new discount code for your shop.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="code">Coupon code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. DASHAIN10"
                  className="uppercase"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this coupon offer?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as Coupon["type"])}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage off</SelectItem>
                      <SelectItem value="fixed">Fixed amount</SelectItem>
                      <SelectItem value="free-shipping">Free shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === "percentage" ? "10" : "500"}
                    disabled={type === "free-shipping"}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create coupon</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active coupons</p>
            <p className="mt-1 text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total redemptions</p>
            <p className="mt-1 text-2xl font-bold">{totalRedemptions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">All coupons</p>
            <p className="mt-1 text-2xl font-bold">{coupons.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        {coupons.map((c) => {
          const usagePct = c.usageLimit ? Math.round((c.usedCount / c.usageLimit) * 100) : 0
          return (
            <Card key={c.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm font-semibold">
                        {c.code}
                      </code>
                      <Badge variant="outline" className={cn("capitalize", couponStatusConfig[c.status].className)}>
                        {couponStatusConfig[c.status].label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatValue(c)} · {couponTypeLabels[c.type]}
                      {c.minSpend ? ` · Min ${formatYen(c.minSpend)}` : ""} · {formatDate(c.startDate)} –{" "}
                      {formatDate(c.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-13 sm:pl-0">
                  {c.usageLimit ? (
                    <div className="hidden w-32 sm:block">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{c.usedCount}</span>
                        <span>{c.usageLimit}</span>
                      </div>
                      <Progress value={usagePct} className="mt-1 h-1.5" />
                    </div>
                  ) : null}
                  <Button variant="ghost" size="icon" onClick={() => copyCode(c.code)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy code</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(c.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
