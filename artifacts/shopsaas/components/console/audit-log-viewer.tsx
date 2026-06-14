"use client"

import { useState } from "react"
import { Search, Download, ScrollText } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auditLogs, auditSeverityConfig } from "@/lib/mock-data/console"
import { formatDateTime } from "@/lib/dashboard-utils"
import { toast } from "@/hooks/use-toast"

const severityFilters = ["all", "info", "warning", "critical"] as const

export function AuditLogViewer() {
  const [query, setQuery] = useState("")
  const [severity, setSeverity] = useState<(typeof severityFilters)[number]>("all")

  const filtered = auditLogs.filter((log) => {
    const matchesQuery =
      log.actor.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.target.toLowerCase().includes(query.toLowerCase())
    const matchesSeverity = severity === "all" || log.severity === severity
    return matchesQuery && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <DashboardHeader title="Audit Logs" description="Immutable record of every privileged action on the platform.">
        <Button variant="outline" onClick={() => toast({ title: "Export started", description: "Your audit log export is being prepared." })}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DashboardHeader>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action, target"
            className="pl-10"
          />
        </div>
        <Tabs value={severity} onValueChange={(v) => setSeverity(v as typeof severity)}>
          <TabsList>
            {severityFilters.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ScrollText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{log.action}</span>
                    <Badge variant="outline" className={auditSeverityConfig[log.severity].className}>
                      {auditSeverityConfig[log.severity].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.target}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {log.actor} · {log.actorRole} · {log.ip}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(log.timestamp)}</span>
              </div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No log entries match your filters.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
