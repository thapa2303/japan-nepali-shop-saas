import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useListDashboardStoreCategories,
  useCreateDashboardStoreCategory,
  useUpdateDashboardStoreCategory,
  useDeleteDashboardStoreCategory,
  getListDashboardStoreCategoriesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, FolderOpen, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function DashboardStoreCategoriesPage() {
  const { data, isLoading } = useListDashboardStoreCategories();
  const createCategory = useCreateDashboardStoreCategory();
  const updateCategory = useUpdateDashboardStoreCategory();
  const deleteCategory = useDeleteDashboardStoreCategory();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListDashboardStoreCategoriesQueryKey() });

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      await createCategory.mutateAsync({ data: { name: values.name } });
      invalidate();
      toast({ title: "Category created" });
      setOpen(false);
      form.reset();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Failed to create category";
      toast({ title: msg, variant: "destructive" });
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      await updateCategory.mutateAsync({ id, data: { isVisible: !isVisible } });
      invalidate();
    } catch {
      toast({ title: "Failed to update category", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Products in this category will not be affected.`)) {
      try {
        await deleteCategory.mutateAsync({ id });
        invalidate();
        toast({ title: "Category deleted" });
      } catch {
        toast({ title: "Failed to delete category", variant: "destructive" });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Store Categories</h1>
            <p className="text-muted-foreground">Organize your products into sections for your store</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Store Category</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Fresh Produce, Snacks, Beverages" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                    {createCategory.isPending ? "Adding..." : "Add Category"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>
              Categories help customers browse your store. Assign a category to products when adding or editing them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
            ) : !data?.categories?.length ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
                <FolderOpen className="h-8 w-8 opacity-40" />
                <p>No categories yet. Add one to organize your products.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {cat.productCount} product{cat.productCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {!cat.isVisible && (
                        <Badge variant="outline" className="text-xs">Hidden</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        title={cat.isVisible ? "Hide from store" : "Show in store"}
                        onClick={() => handleToggleVisibility(cat.id, cat.isVisible)}
                      >
                        {cat.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cat.id, cat.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
