import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetDashboardSubscription } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardSubscriptionPage() {
  const { data, isLoading } = useGetDashboardSubscription();

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Subscription</h1>
          <p className="text-muted-foreground">Manage your plan and billing</p>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div className="font-medium text-lg">{data?.planName}</div>
                  <Badge>{data?.status}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Monthly Price</span>
                  <span className="font-medium">¥{data?.monthlyPrice?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Platform Commission</span>
                  <span className="font-medium">{data?.commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">{data?.currentProductCount} / {data?.productLimit}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Staff</span>
                  <span className="font-medium">{data?.staffCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
