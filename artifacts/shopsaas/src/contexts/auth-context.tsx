import { createContext, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMe,
  useLogin,
  useLogout,
  useRegister,
  getGetMeQueryKey,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: user, isLoading: isUserLoading } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      staleTime: 1000 * 60 * 5,
      throwOnError: false,
    },
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (data: LoginInput) => {
    try {
      const res = await loginMutation.mutateAsync({ data });
      queryClient.setQueryData(getGetMeQueryKey(), res.user);
      
      if (res.user.roles.includes("PLATFORM_SUPER_ADMIN")) {
        setLocation("/console");
      } else if (res.user.roles.includes("MERCHANT") || res.user.roles.includes("TENANT_ADMIN")) {
        setLocation("/dashboard");
      } else {
        setLocation("/");
      }
    } catch (error: any) {
      const message =
        error?.data?.error ?? error?.message ?? "Please check your credentials and try again.";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const res = await registerMutation.mutateAsync({ data });
      queryClient.setQueryData(getGetMeQueryKey(), res.user);
      setLocation("/dashboard");
    } catch (error: any) {
      const message =
        error?.data?.error ?? error?.message ?? "An error occurred during registration.";
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      queryClient.clear();
      setLocation("/login");
    } catch (error: any) {
      const message =
        error?.data?.error ?? error?.message ?? "An error occurred during logout.";
      toast({
        title: "Logout failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: isUserLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
