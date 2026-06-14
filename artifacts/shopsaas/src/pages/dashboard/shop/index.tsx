import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetDashboardShop, useUpdateDashboardShop, getGetDashboardShopQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const shopSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  nameNepali: z.string().optional(),
  description: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  area: z.string().optional(),
  deliveryFee: z.coerce.number().optional(),
  minOrder: z.coerce.number().optional(),
  deliveryTime: z.string().optional(),
});

type ShopFormValues = z.infer<typeof shopSchema>;

export default function DashboardShopPage() {
  const { data: shop, isLoading } = useGetDashboardShop();
  const updateShop = useUpdateDashboardShop();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initializedForId = useRef<string | null>(null);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
      nameNepali: "",
      description: "",
      contactPhone: "",
      contactEmail: "",
      area: "",
      deliveryFee: 0,
      minOrder: 0,
      deliveryTime: "",
    },
  });

  useEffect(() => {
    if (shop && initializedForId.current !== shop.id) {
      initializedForId.current = shop.id;
      form.reset({
        name: shop.name || "",
        nameNepali: shop.nameNepali || "",
        description: shop.description || "",
        contactPhone: shop.contactPhone || "",
        contactEmail: shop.contactEmail || "",
        area: shop.area || "",
        deliveryFee: shop.deliveryFee || 0,
        minOrder: shop.minOrder || 0,
        deliveryTime: shop.deliveryTime || "",
      });
    }
  }, [shop, form]);

  const onSubmit = async (values: ShopFormValues) => {
    try {
      await updateShop.mutateAsync({ data: values });
      queryClient.invalidateQueries({ queryKey: getGetDashboardShopQueryKey() });
      toast({ title: "Shop profile updated" });
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Shop Profile</h1>
          <p className="text-muted-foreground">Manage how your shop appears to customers.</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px] w-full rounded-xl" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your shop's name, description, and contact info.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name (English)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nameNepali"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name (Nepali)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                    <div className="col-span-full mb-2">
                      <h3 className="font-semibold text-lg">Delivery & Location</h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Area / Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Tokyo, Shinjuku" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Delivery Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1-2 days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order Amount (¥)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Delivery Fee (¥)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={updateShop.isPending}>
                    {updateShop.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
