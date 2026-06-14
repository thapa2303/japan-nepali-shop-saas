import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetDashboardOrder, useUpdateDashboardOrderStatus, getGetDashboardOrderQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, User, MapPin, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function DashboardOrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useGetDashboardOrder(id || "", { query: { queryKey: getGetDashboardOrderQueryKey(id || ""), enabled: !!id } });
  const updateStatus = useUpdateDashboardOrderStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = async (status: string) => {
    if (!id) return;
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      queryClient.invalidateQueries({ queryKey: getGetDashboardOrderQueryKey(id) });
      toast({ title: "Order status updated" });
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

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
    <DashboardLayout>
      <div className="p-8 max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Order Details</h1>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] w-full col-span-2 rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        ) : !order ? (
          <div>Order not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order {order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                        <div className="col-span-6">Item</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>
                      <div className="divide-y">
                        {order.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 p-3 text-sm items-center">
                            <div className="col-span-6 font-medium">{item.name}</div>
                            <div className="col-span-2 text-center text-muted-foreground">¥{item.price.toLocaleString()}</div>
                            <div className="col-span-2 text-center">x{item.quantity}</div>
                            <div className="col-span-2 text-right font-medium">¥{(item.price * item.quantity).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 space-y-2">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>¥{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery Fee</span>
                          <span>¥{order.deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                          <span>Total</span>
                          <span>¥{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Update Status</label>
                      <Select 
                        value={order.status} 
                        onValueChange={(val) => handleStatusChange(val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PREPARING">Preparing</SelectItem>
                          <SelectItem value="READY">Ready</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{order.customerName}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                  {order.customerEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{order.customerEmail}</span>
                    </div>
                  )}
                  {order.deliveryAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-sm">{order.deliveryAddress}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-muted p-3 rounded-md">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
