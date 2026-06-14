"use client"

import { useMemo, useState, useEffect } from "react"
import { Search, Ban, RotateCcw, MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { CustomerStatusBadge } from "@/components/admin/admin-badges"
import { formatYen, formatDate } from "@/lib/dashboard-utils"
import { fetchConsoleCustomers } from "@/lib/api-client"
import type { CustomerStatus } from "@/lib/types"

type FilterStatus = "all" | CustomerStatus

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  prefecture?: string
  totalOrders: number
  totalSpent: number
  joinedAt?: string
  createdAt?: string
  status: CustomerStatus
}

const filters: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function CustomerManager() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")

  useEffect(() => {
    fetchConsoleCustomers({ limit: "100" })
      .then((data) => {
        setCustomers(
          (data.customers ?? []).map((c: Record<string, unknown>) => ({
            id: c.id as string,
            name: (c.name as string) || "Unknown",
            email: c.email as string,
            phone: c.phone as string | undefined,
            city: undefined,
            prefecture: undefined,
            totalOrders: (c.totalOrders as number) ?? 0,
            totalSpent: (c.totalSpent as number) ?? 0,
            joinedAt: (c.createdAt as string) ?? undefined,
            createdAt: c.createdAt as string | undefined,
            status: "active" as CustomerStatus,
          }))
        )
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [customers, search, statusFilter])

  const updateStatus = (id: string, status: CustomerStatus) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    const customer = customers.find((c) => c.id === id)
    toast({
      title: status === "blocked" ? "Customer blocked" : "Customer reactivated",
      description: `${customer?.name} has been ${status === "blocked" ? "blocked" : "reactivated"}.`,
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-9"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
          <TabsList>
            {filters.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">Total spent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">{getInitials(c.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.joinedAt ? formatDate(c.joinedAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{c.totalOrders}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatYen(c.totalSpent)}</td>
                    <td className="px-4 py-3">
                      <CustomerStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {c.status === "active" ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => updateStatus(c.id, "blocked")}
                            >
                              <Ban className="h-4 w-4" />
                              Block customer
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => updateStatus(c.id, "active")}>
                              <RotateCcw className="h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">{getInitials(c.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.name}</p>
                  </div>
                </div>
                <CustomerStatusBadge status={c.status} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {c.email}
                </span>
              </div>
              {c.phone && (
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {c.phone}
                </div>
              )}
              <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-medium">{c.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total spent</p>
                  <p className="font-medium">{formatYen(c.totalSpent)}</p>
                </div>
              </div>
              <div className="mt-3">
                {c.status === "active" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive"
                    onClick={() => updateStatus(c.id, "blocked")}
                  >
                    <Ban className="h-4 w-4" />
                    Block customer
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => updateStatus(c.id, "active")}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reactivate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          No customers found.
        </div>
      ) : null}
    </div>
  )
}
