import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { useGetAccount, useUpdateAccount, getGetAccountQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountPage() {
  const { data, isLoading } = useGetAccount();
  const updateAccount = useUpdateAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initializedForId = useRef<string | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (data && initializedForId.current !== data.id) {
      initializedForId.current = data.id;
      form.reset({
        name: data.name || "",
        phone: data.phone || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (values: AccountFormValues) => {
    try {
      await updateAccount.mutateAsync({ data: values });
      queryClient.invalidateQueries({ queryKey: getGetAccountQueryKey() });
      toast({ title: "Account updated" });
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>
        
        {isLoading ? (
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 pb-6 border-b">
                <div className="text-sm text-muted-foreground mb-1">Email Address</div>
                <div className="font-medium">{data?.email}</div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={updateAccount.isPending} className="mt-6">
                    {updateAccount.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </StorefrontLayout>
  );
}
