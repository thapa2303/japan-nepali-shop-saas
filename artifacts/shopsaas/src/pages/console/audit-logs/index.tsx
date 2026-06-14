import { ConsoleLayout } from "@/components/layout/console-layout";
import { useListConsoleAuditLogs } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConsoleAuditLogsPage() {
  const { data, isLoading } = useListConsoleAuditLogs();

  return (
    <ConsoleLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Platform-wide activity log</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Actor / User ID</TableHead>
                  <TableHead>Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : data?.logs?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">No audit logs found.</TableCell></TableRow>
                ) : (
                  data?.logs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{log.tenantId || "N/A"}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{log.actorUserId || "System"}</TableCell>
                      <TableCell>
                        {log.targetType} {log.targetId && <span className="text-muted-foreground font-mono text-xs">({log.targetId})</span>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ConsoleLayout>
  );
}
