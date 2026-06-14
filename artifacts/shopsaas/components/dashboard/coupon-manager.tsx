"use client"

import { useEffect, useState } from "react"
import { Plus, Ticket, Copy, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"

import {
  fetchDashboardCoupons,
  createDashboardCoupon,
  updateDashboardCoupon,
  deleteDashboardCoupon,
  type DashboardCoupon,
} from "@/lib/api-client"
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

const statusConfig = {
  active:   { label: "Active",   className: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  inactive: { label: "Inactive", className: "border-slate-300 text-slate-600 bg-slate-50" },
  expired:  { label: "Expired",  className: "border-red-300 text-red-700 bg-red-50" },
}

function getCouponStatus(c: DashboardCoupon): "active" | "inactive" | "expired" {
  if (!c.isActive) return "inactive"
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) return "expired"
  return "active"
}

export function CouponManager() {
  const [coupons, setCoupons] = useState<DashboardCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [maxUses, setMaxUses] = useState("")

  useEffect(() => {
    fetchDashboardCoupons()
      .then((r) => setCoupons(r.coupons))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeCount = coupons.filter((c) => getCouponStatus(c) === "active").length
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount ?? 0), 0)

  const formatValue = (c: DashboardCoupon) => {
    if (c.discountType === "percentage") return `${c.discountValue}% off`
    return `${formatYen(c.discountValue)} off`
  }

  const handleCreate = async () => {
    if (!code.trim() || !discountValue) {
      toast({ title: "Missing details", description: "Add a code and discount value.", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const newCoupon = await createDashboardCoupon({
        code: code.toUpperCase().trim(),
        description: description.trim() || undefined,
        discountType,
        discountValue: Number(discountValue),
        expiresAt: expiresAt || undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
      })
      setCoupons((prev) => [newCoupon, ...prev])
      setOpen(false)
      setCode(""); setDescription(""); setDiscountValue(""); setExpiresAt(""); setMaxUses("")
      toast({ title: "Coupon created", description: `${newCoupon.code} is now active.` })
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (c: DashboardCoupon) => {
    try {
      const updated = await updateDashboardCoupon(c.id, { isActive: !c.isActive })
      setCoupons((prev) => prev.map((x) => (x.id === c.id ? updated : x)))
      toast({ title: updated.isActive ? "Coupon enabled" : "Coupon disabled" })
    } catch {
      toast({ title: "Error updating coupon", variant: "destructive" })
    }
  }

  const copyCode = (c: string) => {
    navigator.clipboard?.writeText(c)
    toast({ title: "Copied", description: `${c} copied to clipboard.` })
  }

  const remove = async (c: DashboardCoupon) => {
    try {
      await deleteDashboardCoupon(c.id)
      setCoupons((prev) => prev.filter((x) => x.id !== c.id))
      toast({ title: "Coupon deleted", variant: "destructive" })
    } catch {
      toast({ title: "Error deleting coupon", variant: "destructive" })
    }
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
                <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. DASHAIN10" className="uppercase" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this coupon offer?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage off</SelectItem>
                      <SelectItem value="fixed">Fixed amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="val">Value</Label>
                  <Input id="val" type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "10" : "500"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expires">Expires at</Label>
                  <Input id="expires" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxuses">Max uses</Label>
                  <Input id="maxuses" type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Unlimited" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Create coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active coupons</p><p className="mt-1 text-2xl font-bold">{activeCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total redemptions</p><p className="mt-1 text-2xl font-bold">{totalRedemptions.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">All coupons</p><p className="mt-1 text-2xl font-bold">{coupons.length}</p></CardContent></Card>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="flex flex-col gap-3">
          {coupons.map((c) => {
            const status = getCouponStatus(c)
            const usagePct = c.maxUses ? Math.round(((c.usedCount ?? 0) / c.maxUses) * 100) : 0
            return (
              <Card key={c.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm font-semibold">{c.code}</code>
                        <Badge variant="outline" className={cn("capitalize", statusConfig[status].className)}>
                          {statusConfig[status].label}
                        </Badge>
                      </div>
                      {c.description && <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatValue(c)}
                        {c.minOrderAmount ? ` · Min ${formatYen(c.minOrderAmount)}` : ""}
                        {c.expiresAt ? ` · Expires ${formatDate(c.expiresAt)}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-13 sm:pl-0">
                    {c.maxUses ? (
                      <div className="hidden w-32 sm:block">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{c.usedCount ?? 0}</span><span>{c.maxUses}</span>
                        </div>
                        <Progress value={usagePct} className="mt-1 h-1.5" />
                      </div>
                    ) : null}
                    <Button variant="ghost" size="icon" onClick={() => toggleActive(c)} title={c.isActive ? "Disable" : "Enable"}>
                      {c.isActive ? <ToggleRight className="h-4 w-4 text-emerald-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyCode(c.code)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {coupons.length === 0 && (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              No coupons yet. Create your first discount code.
            </div>
          )}
        </div>
      )}
    </>
  )
}
