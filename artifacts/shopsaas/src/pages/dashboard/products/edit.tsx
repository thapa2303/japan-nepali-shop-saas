import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetProduct, useUpdateDashboardProduct, getListDashboardProductsQueryKey, getGetProductQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  nameNepali: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required"),
  inStock: z.boolean().default(true),
  stockCount: z.coerce.number().optional(),
  unit: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function DashboardProductEditPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProduct(id || "", { query: { queryKey: getGetProductQueryKey(id || ""), enabled: !!id } });
  const updateProduct = useUpdateDashboardProduct();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const initializedForId = useRef<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      nameNepali: "",
      description: "",
      price: 0,
      category: "",
      inStock: true,
      unit: "pcs",
    },
  });

  useEffect(() => {
    if (product && initializedForId.current !== product.id) {
      initializedForId.current = product.id;
      form.reset({
        name: product.name || "",
        nameNepali: product.nameNepali || "",
        description: product.description || "",
        price: product.price || 0,
        compareAtPrice: product.compareAtPrice || 0,
        category: product.category || "",
        inStock: product.inStock,
        stockCount: product.stockCount || 0,
        unit: product.unit || "pcs",
      });
    }
  }, [product, form]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!id) return;
    try {
      await updateProduct.mutateAsync({ id, data: values });
      queryClient.invalidateQueries({ queryKey: getListDashboardProductsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(id) });
      toast({ title: "Product updated successfully" });
      setLocation("/dashboard/products");
    } catch (error) {
      toast({ title: "Failed to update product", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Edit Product</h1>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px] w-full rounded-xl" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name (English)</FormLabel>
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
                            <FormLabel>Product Name (Nepali)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Groceries">Groceries</SelectItem>
                                <SelectItem value="Spices">Spices & Herbs</SelectItem>
                                <SelectItem value="Snacks">Snacks</SelectItem>
                                <SelectItem value="Beverages">Beverages</SelectItem>
                                <SelectItem value="Handicrafts">Handicrafts</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (¥)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="compareAtPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compare at (¥)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Optional" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. kg, pcs, pack" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="stockCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock Count</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Optional" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">In Stock</FormLabel>
                              <FormDescription>
                                Available for purchase
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="Describe your product..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" disabled={updateProduct.isPending}>
                    {updateProduct.isPending ? "Updating..." : "Update Product"}
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
