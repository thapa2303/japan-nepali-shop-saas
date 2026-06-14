import { ConsoleLayout } from "@/components/layout/console-layout";
import { useListConsoleTenants } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ConsoleTenantsPage() {
  const { data, isLoading } = useListConsoleTenants();

  return (
    <ConsoleLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Tenants</h1>
          <p className="text-muted-foreground">Manage merchant accounts</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
                ) : data?.tenants?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">No tenants found.</TableCell></TableRow>
                ) : (
                  data?.tenants?.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.slug}</TableCell>
                      <TableCell><Badge variant="outline">{tenant.subscriptionTier}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={tenant.status === "ACTIVE" ? "secondary" : "destructive"}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>¥{(tenant.revenue || 0).toLocaleString()}</TableCell>
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
