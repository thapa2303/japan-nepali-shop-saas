import { AdminLayout } from "@/components/layout/admin-layout";
import { useListAdminCustomers } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCustomersPage() {
  const { data, isLoading } = useListAdminCustomers();

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Customers</h1>
          <p className="text-muted-foreground">Customers who have ordered from your shops</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : data?.customers?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No customers found.</TableCell></TableRow>
                ) : (
                  data?.customers?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name || "N/A"}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{format(new Date(customer.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">{customer.totalOrders || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
