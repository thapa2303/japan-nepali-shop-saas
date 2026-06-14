import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (!isLoading && user && allowedRoles && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.some((role) => user.roles.includes(role));
      if (!hasRequiredRole) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        // Redirect based on what roles they DO have
        if (user.roles.includes("PLATFORM_SUPER_ADMIN")) {
          setLocation("/console");
        } else if (user.roles.includes("MERCHANT") || user.roles.includes("TENANT_ADMIN")) {
          setLocation("/dashboard");
        } else {
          setLocation("/");
        }
      }
    }
  }, [user, isLoading, allowedRoles, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => user.roles.includes(role));
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
