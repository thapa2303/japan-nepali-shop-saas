import type { Metadata } from "next"
import { ShieldCheck, Check, Plus } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { consoleRoles, allPermissions } from "@/lib/mock-data/console"

export const metadata: Metadata = {
  title: "RBAC | Console",
}

export default function RbacPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Roles & Access"
        description="Define what console operators can see and do across the platform."
      >
        <Button>
          <Plus className="h-4 w-4" />
          New role
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {consoleRoles.map((role) => (
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
                  {consoleRoles.map((role) => (
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
                    {consoleRoles.map((role) => (
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
