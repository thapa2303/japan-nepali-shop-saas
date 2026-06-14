import { ConsoleLayout } from "@/components/layout/console-layout";
import { useListConsoleTenants, useUpdateConsoleTenant, useEnterConsoleTenant, useListConsolePlans } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, LogIn } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConsoleTenantDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useListConsoleTenants();
  const { data: plansData } = useListConsolePlans();
  const updateTenant = useUpdateConsoleTenant();
  const enterTenant = useEnterConsoleTenant();
  const plans = plansData?.plans ?? [];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tenant = data?.tenants?.find(t => t.id === id);

  const handleStatusChange = async (status: string) => {
    if (!id) return;
    try {
      await updateTenant.mutateAsync({ id, data: { status } });
      queryClient.invalidateQueries({ queryKey: ["/api/console/tenants"] });
      toast({ title: "Status updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleTierChange = async (tier: string) => {
    if (!id) return;
    try {
      await updateTenant.mutateAsync({ id, data: { subscriptionTier: tier } });
      queryClient.invalidateQueries({ queryKey: ["/api/console/tenants"] });
      toast({ title: "Subscription tier updated" });
    } catch (error) {
      toast({ title: "Failed to update tier", variant: "destructive" });
    }
  };

  const handleImpersonate = async () => {
    if (!id) return;
    try {
      const res = await enterTenant.mutateAsync({ id });
      // In a real app, this might set a cookie or return a token.
      // For now, we'll just show a success message.
      toast({ title: "Entering tenant environment", description: `Logged in as admin of ${res.tenantName}` });
      // Redirect to dashboard (assuming the backend set the right cookies)
      window.location.href = "/dashboard";
    } catch (error) {
      toast({ title: "Failed to enter tenant", variant: "destructive" });
    }
  };

  return (
    <ConsoleLayout>
      <div className="p-8 max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/console/tenants">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Tenant Details</h1>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-xl" />
        ) : !tenant ? (
          <div className="text-center py-20 text-muted-foreground">Tenant not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{tenant.name}</CardTitle>
                <CardDescription>/{tenant.slug}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Select value={tenant.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Subscription Tier</div>
                  <Select value={tenant.subscriptionTier} onValueChange={handleTierChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={p.tier} value={p.tier}>
                          {p.name} — ¥{p.monthlyPrice.toLocaleString()}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 mt-4 border-t">
                  <Button variant="outline" className="w-full" onClick={handleImpersonate}>
                    <LogIn className="h-4 w-4 mr-2" /> Impersonate Tenant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-medium text-lg">¥{(tenant.revenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">MRR</span>
                  <span className="font-medium text-lg">¥{(tenant.mrr || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Orders</span>
                  <span className="font-medium text-lg">{tenant.orderCount || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium text-lg">{tenant.productCount || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium text-lg">{tenant.userCount || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ConsoleLayout>
  );
}
