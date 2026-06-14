import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useListDashboardCoupons,
  useCreateDashboardCoupon,
  useDeleteDashboardCoupon,
  getListDashboardCouponsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").max(50),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(1, "Must be at least 1"),
  minOrderAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().optional(),
  expiresAt: z.string().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function DashboardCouponsPage() {
  const { data, isLoading } = useListDashboardCoupons();
  const createCoupon = useCreateDashboardCoupon();
  const deleteCoupon = useDeleteDashboardCoupon();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: undefined,
      maxUses: undefined,
      expiresAt: "",
    },
  });

  const discountType = form.watch("discountType");

  const onSubmit = async (values: CouponFormValues) => {
    try {
      await createCoupon.mutateAsync({
        data: {
          code: values.code.toUpperCase(),
          description: values.description || undefined,
          discountType: values.discountType,
          discountValue: Number(values.discountValue),
          minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : undefined,
          maxUses: values.maxUses ? Number(values.maxUses) : undefined,
          expiresAt: values.expiresAt || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getListDashboardCouponsQueryKey() });
      toast({ title: "Coupon created" });
      setOpen(false);
      form.reset();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Failed to create coupon";
      toast({ title: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      try {
        await deleteCoupon.mutateAsync({ id });
        queryClient.invalidateQueries({ queryKey: getListDashboardCouponsQueryKey() });
        toast({ title: "Coupon deleted" });
      } catch {
        toast({ title: "Failed to delete coupon", variant: "destructive" });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Coupons</h1>
            <p className="text-muted-foreground">Create and manage discount codes for your shop</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Coupon</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input placeholder="SAVE10" className="uppercase" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="New customer discount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                              <SelectItem value="fixed">Fixed (¥)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{discountType === "percentage" ? "Discount (%)" : "Amount (¥)"}</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max={discountType === "percentage" ? "100" : undefined} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="minOrderAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Order (¥)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="No minimum" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxUses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Uses</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expires At (optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createCoupon.isPending}>
                    {createCoupon.isPending ? "Creating..." : "Create Coupon"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Active Coupons
            </CardTitle>
            <CardDescription>Customers enter these codes at checkout to receive a discount</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading coupons...
                    </TableCell>
                  </TableRow>
                ) : !data?.coupons?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Tag className="h-8 w-8 opacity-40" />
                        <p>No coupons yet. Create one to attract customers.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <span className="font-mono font-semibold tracking-wider">{coupon.code}</span>
                        {coupon.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% off`
                            : `¥${coupon.discountValue.toLocaleString()} off`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {coupon.usedCount}
                          {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {coupon.minOrderAmount ? `¥${coupon.minOrderAmount.toLocaleString()}` : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString("en-JP")
                            : "Never"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
