"use client"

import { useRouter } from "next/navigation"
import { Power, LogIn, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TenantStatus } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export function TenantActions({ tenantName, status }: { tenantName: string; status: TenantStatus }) {
  const router = useRouter()
  const isSuspended = status === "suspended"

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => router.push("/console/impersonation")}>
        <LogIn className="h-4 w-4" />
        Impersonate
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast({ title: "Edit tenant", description: `Opening editor for ${tenantName}.` })}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      <Button
        variant={isSuspended ? "default" : "destructive"}
        size="sm"
        onClick={() =>
          toast({
            title: isSuspended ? "Tenant reactivated" : "Tenant suspended",
            description: isSuspended
              ? `${tenantName} is active again.`
              : `${tenantName} has been suspended.`,
          })
        }
      >
        <Power className="h-4 w-4" />
        {isSuspended ? "Reactivate" : "Suspend"}
      </Button>
    </div>
  )
}
