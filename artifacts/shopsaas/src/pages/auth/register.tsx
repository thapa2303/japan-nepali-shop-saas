import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

const registerSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  tenantName: z.string().min(2, "Shop name must be at least 2 characters"),
  tenantSlug: z.string().min(2, "Shop URL handle must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.roles.includes("PLATFORM_SUPER_ADMIN")) {
        setLocation("/console");
      } else if (user.roles.includes("MERCHANT") || user.roles.includes("TENANT_ADMIN")) {
        setLocation("/dashboard");
      } else {
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      tenantName: "",
      tenantSlug: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await register(data);
  };

  return (
    <StorefrontLayout>
      <div className="flex flex-1 items-center justify-center p-4 py-12">
        <Card className="w-full max-w-xl shadow-lg border-primary/10">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">Become a Merchant</CardTitle>
            <CardDescription>
              Open your shop and connect with the Nepali community in Japan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ram Sharma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="ram@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Shop Details</h3>
                  <FormField
                    control={form.control}
                    name="tenantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Kathmandu Mart" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tenantSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop URL Handle</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                              shopsaas.com/shops/
                            </span>
                            <Input 
                              placeholder="kathmandu-mart" 
                              className="rounded-l-none" 
                              {...field} 
                              onChange={(e) => {
                                // Auto-format to valid slug
                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                                field.onChange(val);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This will be your shop's unique web address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Creating account..." : "Create Merchant Account"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </StorefrontLayout>
  );
}
