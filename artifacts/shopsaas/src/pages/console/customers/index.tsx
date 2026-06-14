import { ConsoleLayout } from "@/components/layout/console-layout";
import { useListConsoleCustomers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function ConsoleCustomersPage() {
  const { data, isLoading } = useListConsoleCustomers();

  return (
    <ConsoleLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Platform Customers</h1>
          <p className="text-muted-foreground">All registered customers across the platform</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-4"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : data?.customers?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-4">No customers found.</TableCell></TableRow>
                ) : (
                  data?.customers?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name || "N/A"}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || "N/A"}</TableCell>
                      <TableCell>{format(new Date(customer.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">{customer.totalOrders || 0}</TableCell>
                      <TableCell className="text-right">¥{(customer.totalSpent || 0).toLocaleString()}</TableCell>
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
