"use client"

import { useEffect, useState } from "react"
import { Plus, Mail, MoreVertical, Shield, Loader2 } from "lucide-react"

import {
  fetchDashboardStaff,
  inviteDashboardStaff,
  deleteDashboardStaff,
  type DashboardStaff,
} from "@/lib/api-client"
import { formatDateTime } from "@/lib/dashboard-utils"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()

export function StaffManager() {
  const [staff, setStaff] = useState<DashboardStaff[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    fetchDashboardStaff()
      .then((r) => setStaff(r.staff))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const invite = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: "Missing details", description: "Add a name and email.", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const result = await inviteDashboardStaff({ name: name.trim(), email: email.trim() })
      setStaff((prev) => [...prev, {
        id: result.id,
        name: result.name,
        email: result.email,
        isActive: true,
        createdAt: new Date().toISOString(),
      }])
      setOpen(false)
      setName(""); setEmail("")
      toast({
        title: "Staff member added",
        description: `${result.name} added. Temp password: ${result.tempPassword}`,
      })
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (member: DashboardStaff) => {
    try {
      await deleteDashboardStaff(member.id)
      setStaff((prev) => prev.filter((s) => s.id !== member.id))
      toast({ title: "Staff member removed", variant: "destructive" })
    } catch {
      toast({ title: "Error removing staff member", variant: "destructive" })
    }
  }

  return (
    <>
      <DashboardHeader title="Staff users" description="Invite team members and manage their access to your shop.">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" /> Invite staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite team member</DialogTitle>
              <DialogDescription>They will be added as a staff member to your shop.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Team member name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={invite} disabled={saving}>
                {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Mail className="mr-1 h-4 w-4" />}
                Add staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      {loading ? (
        <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <CardContent className="divide-y p-0">
            {staff.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No staff members yet. Invite someone to help manage your shop.
              </div>
            )}
            {staff.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                      <Shield className="mr-1 h-3 w-3" /> Staff
                    </Badge>
                    {!member.isActive && (
                      <Badge variant="outline" className="border-slate-300 text-slate-600">Inactive</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{member.email}</p>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  {member.lastLoginAt ? `Active ${formatDateTime(member.lastLoginAt)}` : "Never logged in"}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => remove(member)} className="text-destructive">
                      Remove staff member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}
