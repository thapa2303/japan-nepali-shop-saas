import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useListOrders } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { data, isLoading } = useListOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="secondary">Pending</Badge>;
      case "PREPARING": return <Badge className="bg-blue-100 text-blue-800">Preparing</Badge>;
      case "READY": return <Badge className="bg-yellow-100 text-yellow-800">Ready</Badge>;
      case "DELIVERED": return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "CANCELLED": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
            <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          </div>
        ) : data?.orders?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed">
            <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders.</p>
            <Link href="/shops">
              <Button>Browse Shops</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.orders?.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold">Order #{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:gap-1">
                      <span className="font-bold text-lg">¥{order.total.toLocaleString()}</span>
                      <span className="text-primary text-sm font-medium group-hover:underline">View Details →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
