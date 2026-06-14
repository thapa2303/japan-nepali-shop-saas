"use client"

import { useState } from "react"
import { ShieldCheck, Check, Plus } from "lucide-react"

import type { ConsoleRole } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { consoleRoles, allPermissions } from "@/lib/mock-data/console"
import { toast } from "@/hooks/use-toast"

const roleTypes = ["Operational", "Read-only", "Custom"]

export function RbacManager() {
  const [roles, setRoles] = useState<ConsoleRole[]>(consoleRoles)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [roleType, setRoleType] = useState("Custom")
  const [permissions, setPermissions] = useState<string[]>([])

  const resetForm = () => {
    setName("")
    setDescription("")
    setRoleType("Custom")
    setPermissions([])
  }

  const togglePermission = (key: string, checked: boolean) =>
    setPermissions((prev) => (checked ? [...prev, key] : prev.filter((p) => p !== key)))

  const handleCreate = () => {
    if (!name.trim()) {
      toast({ title: "Role name required", description: "Please enter a name for the role." })
      return
    }
    const newRole: ConsoleRole = {
      id: `r${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `${roleType} role`,
      members: 0,
      permissions,
    }
    setRoles((prev) => [...prev, newRole])
    toast({ title: "Role created successfully", description: `${newRole.name} has been added.` })
    resetForm()
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Roles & Access"
        description="Define what console operators can see and do across the platform."
      >
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            if (!value) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create new role</DialogTitle>
              <DialogDescription>Define a role and the permissions it grants.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role name</Label>
                <Input
                  id="role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Support Agent"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What can this role do?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role-type">Role type</Label>
                <Select value={roleType} onValueChange={setRoleType}>
                  <SelectTrigger id="role-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Default permissions</Label>
                <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
                  {allPermissions.map((perm) => (
                    <label key={perm.key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={permissions.includes(perm.key)}
                        onCheckedChange={(checked) => togglePermission(perm.key, checked === true)}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {role.members}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Permission</th>
                  {roles.map((role) => (
                    <th key={role.id} className="pb-3 text-center font-medium text-muted-foreground">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((perm) => (
                  <tr key={perm.key} className="border-b last:border-0">
                    <td className="py-3 font-medium">{perm.label}</td>
                    {roles.map((role) => (
                      <td key={role.id} className="py-3 text-center">
                        {role.permissions.includes(perm.key) ? (
                          <Check className="mx-auto h-4 w-4 text-primary" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
