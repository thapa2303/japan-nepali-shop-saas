import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrder(id || "", { query: { queryKey: getGetOrderQueryKey(id || ""), enabled: !!id } });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="secondary">Pending</Badge>;
      case "PREPARING": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Preparing</Badge>;
      case "READY": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Ready</Badge>;
      case "DELIVERED": return <Badge className="bg-green-100 text-green-800 border-green-200">Delivered</Badge>;
      case "CANCELLED": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-6">
          <Link href="/orders">
            <Button variant="ghost" className="-ml-4 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        ) : !order ? (
          <div className="text-center py-20">Order not found.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Order {order.orderNumber}</h1>
                <p className="text-muted-foreground">
                  Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div>
                {getStatusBadge(order.status)}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" /> Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="divide-y">
                    {(order as any).items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted h-12 w-12 rounded flex items-center justify-center font-medium">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">¥{item.price.toLocaleString()} each</p>
                          </div>
                        </div>
                        <div className="font-bold">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>¥{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>¥{order.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4">
                      <span>Total</span>
                      <span>¥{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(order as any).deliveryAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{(order as any).deliveryAddress}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
