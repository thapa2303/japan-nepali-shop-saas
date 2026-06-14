import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";

// Auth
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

// Storefront
import HomePage from "@/pages/home";
import ShopsPage from "@/pages/shops";
import ShopDetailPage from "@/pages/shops/detail";
import ProductDetailPage from "@/pages/products/detail";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import SearchPage from "@/pages/search";
import AccountPage from "@/pages/account";
import OrdersPage from "@/pages/orders";
import OrderDetailPage from "@/pages/orders/detail";

// Dashboard
import DashboardPage from "@/pages/dashboard";
import DashboardProductsPage from "@/pages/dashboard/products";
import DashboardProductNewPage from "@/pages/dashboard/products/new";
import DashboardProductEditPage from "@/pages/dashboard/products/edit";
import DashboardOrdersPage from "@/pages/dashboard/orders";
import DashboardOrderDetailPage from "@/pages/dashboard/orders/detail";
import DashboardShopPage from "@/pages/dashboard/shop";
import DashboardSubscriptionPage from "@/pages/dashboard/subscription";
import DashboardStaffPage from "@/pages/dashboard/staff";
import DashboardCouponsPage from "@/pages/dashboard/coupons";
import DashboardCouponRedemptionsPage from "@/pages/dashboard/coupons/redemptions";
import DashboardStoreCategoriesPage from "@/pages/dashboard/store-categories";

// Admin
import AdminPage from "@/pages/admin";
import AdminCustomersPage from "@/pages/admin/customers";

// Console
import ConsolePage from "@/pages/console";
import ConsoleTenantsPage from "@/pages/console/tenants";
import ConsoleTenantDetailPage from "@/pages/console/tenants/detail";
import ConsoleCustomersPage from "@/pages/console/customers";
import ConsoleAuditLogsPage from "@/pages/console/audit-logs";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/shops" component={ShopsPage} />
      <Route path="/shops/:slug" component={ShopDetailPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/search" component={SearchPage} />
      
      {/* Customer Protected Routes */}
      <Route path="/cart">
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      </Route>
      <Route path="/checkout">
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      </Route>
      <Route path="/account">
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
      </Route>
      <Route path="/orders">
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      </Route>
      <Route path="/orders/:id">
        <ProtectedRoute>
          <OrderDetailPage />
        </ProtectedRoute>
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/shop">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardShopPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/products">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardProductsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/products/new">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardProductNewPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/products/:id/edit">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardProductEditPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/orders">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardOrdersPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/orders/:id">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardOrderDetailPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/subscription">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardSubscriptionPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/staff">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardStaffPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/coupons">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardCouponsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/coupons/redemptions">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardCouponRedemptionsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/store-categories">
        <ProtectedRoute allowedRoles={["MERCHANT", "TENANT_ADMIN"]}>
          <DashboardStoreCategoriesPage />
        </ProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={["TENANT_ADMIN"]}>
          <AdminPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/customers">
        <ProtectedRoute allowedRoles={["TENANT_ADMIN"]}>
          <AdminCustomersPage />
        </ProtectedRoute>
      </Route>

      {/* Console Routes */}
      <Route path="/console">
        <ProtectedRoute allowedRoles={["PLATFORM_SUPER_ADMIN"]}>
          <ConsolePage />
        </ProtectedRoute>
      </Route>
      <Route path="/console/tenants">
        <ProtectedRoute allowedRoles={["PLATFORM_SUPER_ADMIN"]}>
          <ConsoleTenantsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/console/tenants/:id">
        <ProtectedRoute allowedRoles={["PLATFORM_SUPER_ADMIN"]}>
          <ConsoleTenantDetailPage />
        </ProtectedRoute>
      </Route>
      <Route path="/console/customers">
        <ProtectedRoute allowedRoles={["PLATFORM_SUPER_ADMIN"]}>
          <ConsoleCustomersPage />
        </ProtectedRoute>
      </Route>
      <Route path="/console/audit-logs">
        <ProtectedRoute allowedRoles={["PLATFORM_SUPER_ADMIN"]}>
          <ConsoleAuditLogsPage />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
            <Toaster />
          </AuthProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
