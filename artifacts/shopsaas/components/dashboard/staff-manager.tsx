"use client"

import { useState } from "react"
import { Plus, Mail, MoreVertical, Shield } from "lucide-react"

import type { StaffUser } from "@/lib/types"
import {
  merchantStaff,
  staffRoleConfig,
  staffStatusConfig,
} from "@/lib/mock-data/merchant-management"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export function StaffManager() {
  const [staff, setStaff] = useState<StaffUser[]>(merchantStaff)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<StaffUser["role"]>("staff")

  const invite = () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: "Missing details", description: "Add a name and email.", variant: "destructive" })
      return
    }
    const member: StaffUser = {
      id: `st-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: "invited",
      lastActive: "—",
    }
    setStaff((prev) => [...prev, member])
    setOpen(false)
    setName("")
    setEmail("")
    setRole("staff")
    toast({ title: "Invitation sent", description: `${member.name} has been invited.` })
  }

  const setMemberRole = (id: string, newRole: StaffUser["role"]) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, role: newRole } : s)))
    toast({ title: "Role updated" })
  }

  const toggleStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "disabled" ? "active" : "disabled" } : s
      )
    )
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
              <DialogDescription>They will receive an email to join your shop.</DialogDescription>
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
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as StaffUser["role"])}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager — manage products & orders</SelectItem>
                    <SelectItem value="staff">Staff — fulfill orders only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={invite}>
                <Mail className="mr-1 h-4 w-4" /> Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <Card>
        <CardContent className="divide-y p-0">
          {staff.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">{initials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{member.name}</span>
                  <Badge variant="outline" className={cn("capitalize", staffRoleConfig[member.role].className)}>
                    {staffRoleConfig[member.role].label}
                  </Badge>
                  <Badge variant="outline" className={cn("capitalize", staffStatusConfig[member.status].className)}>
                    {staffStatusConfig[member.status].label}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="hidden text-right text-xs text-muted-foreground sm:block">
                {member.lastActive === "—" ? "Pending" : `Active ${formatDateTime(member.lastActive)}`}
              </div>
              {member.role !== "owner" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setMemberRole(member.id, "manager")}>
                      <Shield className="mr-2 h-4 w-4" /> Make manager
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMemberRole(member.id, "staff")}>
                      <Shield className="mr-2 h-4 w-4" /> Make staff
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(member.id)}>
                      {member.status === "disabled" ? "Re-enable access" : "Disable access"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="w-10" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
