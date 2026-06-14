import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useListDashboardCoupons,
  useCreateDashboardCoupon,
  useDeleteDashboardCoupon,
  useUpdateDashboardCoupon,
  useGetDashboardCouponRedemptions,
  getListDashboardCouponsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Tag, Pencil, Check, X, ChevronDown, ChevronRight, History } from "lucide-react";
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

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DashboardCouponsPage() {
  const { data, isLoading } = useListDashboardCoupons();
  const createCoupon = useCreateDashboardCoupon();
  const deleteCoupon = useDeleteDashboardCoupon();
  const updateCoupon = useUpdateDashboardCoupon();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState<string | null>(null);
  const [expiryDraft, setExpiryDraft] = useState("");
  const [expandedCoupon, setExpandedCoupon] = useState<string | null>(null);

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
    if (confirm(`Delete coupon "${code}"? This cannot be undone.`)) {
      try {
        await deleteCoupon.mutateAsync({ id });
        queryClient.invalidateQueries({ queryKey: getListDashboardCouponsQueryKey() });
        toast({ title: "Coupon deleted" });
      } catch {
        toast({ title: "Failed to delete coupon", variant: "destructive" });
      }
    }
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    try {
      await updateCoupon.mutateAsync({ id, data: { isActive: !currentlyActive } });
      queryClient.invalidateQueries({ queryKey: getListDashboardCouponsQueryKey() });
      toast({ title: currentlyActive ? "Coupon paused" : "Coupon activated" });
    } catch {
      toast({ title: "Failed to update coupon", variant: "destructive" });
    }
  };

  const startEditExpiry = (id: string, expiresAt: string | null | undefined) => {
    setEditingExpiry(id);
    setExpiryDraft(toDatetimeLocal(expiresAt));
  };

  const saveExpiry = async (id: string) => {
    try {
      await updateCoupon.mutateAsync({ id, data: { expiresAt: expiryDraft || null } });
      queryClient.invalidateQueries({ queryKey: getListDashboardCouponsQueryKey() });
      toast({ title: "Expiry date updated" });
    } catch {
      toast({ title: "Failed to update expiry", variant: "destructive" });
    } finally {
      setEditingExpiry(null);
    }
  };

  const activeCoupons = data?.coupons?.filter((c) => c.isActive) ?? [];
  const inactiveCoupons = data?.coupons?.filter((c) => !c.isActive) ?? [];

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

        <CouponTable
          title="Active Coupons"
          description="Customers can use these codes at checkout"
          coupons={activeCoupons}
          isLoading={isLoading}
          emptyMessage="No active coupons. Create one or re-enable a paused coupon."
          editingExpiry={editingExpiry}
          expiryDraft={expiryDraft}
          onToggleActive={handleToggleActive}
          onStartEditExpiry={startEditExpiry}
          onExpiryDraftChange={setExpiryDraft}
          onSaveExpiry={saveExpiry}
          onCancelEditExpiry={() => setEditingExpiry(null)}
          onDelete={handleDelete}
          updatePending={updateCoupon.isPending}
          expandedCoupon={expandedCoupon}
          onToggleExpand={(id) => setExpandedCoupon(expandedCoupon === id ? null : id)}
        />

        {inactiveCoupons.length > 0 && (
          <CouponTable
            title="Paused Coupons"
            description="These coupons are disabled and cannot be used at checkout"
            coupons={inactiveCoupons}
            isLoading={false}
            emptyMessage=""
            editingExpiry={editingExpiry}
            expiryDraft={expiryDraft}
            onToggleActive={handleToggleActive}
            onStartEditExpiry={startEditExpiry}
            onExpiryDraftChange={setExpiryDraft}
            onSaveExpiry={saveExpiry}
            onCancelEditExpiry={() => setEditingExpiry(null)}
            onDelete={handleDelete}
            updatePending={updateCoupon.isPending}
            expandedCoupon={expandedCoupon}
            onToggleExpand={(id) => setExpandedCoupon(expandedCoupon === id ? null : id)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

type CouponRow = {
  id: string;
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  usedCount: number;
  maxUses?: number | null;
  minOrderAmount?: number | null;
  expiresAt?: string | null;
  isActive: boolean;
};

function RedemptionHistory({ couponId }: { couponId: string }) {
  const { data, isLoading, isError } = useGetDashboardCouponRedemptions(couponId);

  if (isLoading) {
    return (
      <div className="py-4 px-6 text-sm text-muted-foreground">
        Loading redemptions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-4 px-6 text-sm text-destructive">
        Failed to load redemptions. Please try again.
      </div>
    );
  }

  const redemptions = data?.redemptions ?? [];

  if (redemptions.length === 0) {
    return (
      <div className="py-6 px-6 flex items-center gap-2 text-sm text-muted-foreground">
        <History className="h-4 w-4 opacity-50" />
        No redemptions yet — this coupon hasn't been used on any orders.
      </div>
    );
  }

  return (
    <div className="border-t bg-muted/30">
      <div className="px-6 pt-3 pb-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Redemption History</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6 text-xs">Order #</TableHead>
            <TableHead className="text-xs">Customer</TableHead>
            <TableHead className="text-xs">Date</TableHead>
            <TableHead className="text-xs text-right pr-6">Discount Applied</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {redemptions.map((r) => (
            <TableRow key={r.orderId} className="hover:bg-transparent">
              <TableCell className="pl-6 py-2">
                <span className="font-mono text-xs font-medium">{r.orderNumber}</span>
              </TableCell>
              <TableCell className="py-2 text-sm">{r.customerName}</TableCell>
              <TableCell className="py-2 text-sm text-muted-foreground">
                {new Date(r.orderDate).toLocaleDateString("en-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="py-2 text-right pr-6 text-sm font-medium text-green-700">
                −¥{r.discountAmount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CouponTable({
  title,
  description,
  coupons,
  isLoading,
  emptyMessage,
  editingExpiry,
  expiryDraft,
  onToggleActive,
  onStartEditExpiry,
  onExpiryDraftChange,
  onSaveExpiry,
  onCancelEditExpiry,
  onDelete,
  updatePending,
  expandedCoupon,
  onToggleExpand,
}: {
  title: string;
  description: string;
  coupons: CouponRow[];
  isLoading: boolean;
  emptyMessage: string;
  editingExpiry: string | null;
  expiryDraft: string;
  onToggleActive: (id: string, active: boolean) => void;
  onStartEditExpiry: (id: string, expiresAt: string | null | undefined) => void;
  onExpiryDraftChange: (v: string) => void;
  onSaveExpiry: (id: string) => void;
  onCancelEditExpiry: () => void;
  onDelete: (id: string, code: string) => void;
  updatePending: boolean;
  expandedCoupon: string | null;
  onToggleExpand: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading coupons...
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Tag className="h-8 w-8 opacity-40" />
                    <p>{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <>
                  <TableRow key={coupon.id} className={!coupon.isActive ? "opacity-60" : ""}>
                    <TableCell className="pl-4 pr-0">
                      <button
                        onClick={() => onToggleExpand(coupon.id)}
                        className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        title={expandedCoupon === coupon.id ? "Hide redemptions" : "Show redemptions"}
                      >
                        {expandedCoupon === coupon.id
                          ? <ChevronDown className="h-4 w-4" />
                          : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      {coupon.maxUses != null && coupon.usedCount >= coupon.maxUses ? (
                        <Badge variant="outline" className="text-xs font-medium text-orange-600 border-orange-300 bg-orange-50 whitespace-nowrap">
                          Limit reached
                        </Badge>
                      ) : (
                        <Switch
                          checked={coupon.isActive}
                          onCheckedChange={() => onToggleActive(coupon.id, coupon.isActive)}
                          disabled={updatePending}
                          aria-label={coupon.isActive ? "Pause coupon" : "Activate coupon"}
                        />
                      )}
                    </TableCell>
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
                      <button
                        className="flex items-center gap-1.5 text-sm hover:text-foreground transition-colors group"
                        onClick={() => onToggleExpand(coupon.id)}
                        title="View redemptions"
                      >
                        <span className={coupon.usedCount > 0 ? "font-medium" : "text-muted-foreground"}>
                          {coupon.usedCount}
                          {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                        </span>
                        {coupon.usedCount > 0 && (
                          <History className="h-3 w-3 text-muted-foreground group-hover:text-foreground opacity-60 transition-opacity" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {coupon.minOrderAmount ? `¥${coupon.minOrderAmount.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {editingExpiry === coupon.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="datetime-local"
                            value={expiryDraft}
                            onChange={(e) => onExpiryDraftChange(e.target.value)}
                            className="h-7 text-xs w-44"
                          />
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => onSaveExpiry(coupon.id)} disabled={updatePending}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onCancelEditExpiry}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground group"
                          onClick={() => onStartEditExpiry(coupon.id, coupon.expiresAt)}
                          title="Click to edit expiry date"
                        >
                          <span>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-JP") : "Never"}</span>
                          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(coupon.id, coupon.code)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedCoupon === coupon.id && (
                    <TableRow key={`${coupon.id}-redemptions`} className="hover:bg-transparent">
                      <TableCell colSpan={8} className="p-0">
                        <RedemptionHistory couponId={coupon.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
