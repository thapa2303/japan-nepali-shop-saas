import type { Tenant, AuditLog, FeatureFlag, ConsoleRole } from "@/lib/types"

// ---------- Tenants / Organizations ----------
// Each tenant is an isolated marketplace instance run by the SaaS operator.

export const tenants: Tenant[] = [
  {
    id: "tn1",
    name: "Nepali Shops Japan",
    slug: "nepali-shops-japan",
    region: "Japan",
    plan: "premium",
    status: "active",
    ownerName: "Ramesh Thapa",
    ownerEmail: "ramesh@nepalishopsjapan.com",
    merchants: 12,
    customers: 4820,
    mrr: 248000,
    createdAt: "2025-01-10",
    features: { delivery: true, coupons: true, multiCurrency: false, reviews: true, analytics: true, staffAccounts: true },
  },
  {
    id: "tn2",
    name: "Desi Bazaar UK",
    slug: "desi-bazaar-uk",
    region: "United Kingdom",
    plan: "growth",
    status: "active",
    ownerName: "Priya Sharma",
    ownerEmail: "priya@desibazaar.co.uk",
    merchants: 34,
    customers: 9120,
    mrr: 412000,
    createdAt: "2025-02-22",
    features: { delivery: true, coupons: true, multiCurrency: true, reviews: true, analytics: true, staffAccounts: true },
  },
  {
    id: "tn3",
    name: "Himalaya Mart AU",
    slug: "himalaya-mart-au",
    region: "Australia",
    plan: "growth",
    status: "trial",
    ownerName: "Bishnu Adhikari",
    ownerEmail: "bishnu@himalayamart.com.au",
    merchants: 6,
    customers: 1240,
    mrr: 0,
    createdAt: "2026-05-28",
    features: { delivery: true, coupons: false, multiCurrency: false, reviews: true, analytics: false, staffAccounts: false },
  },
  {
    id: "tn4",
    name: "Spice Route Canada",
    slug: "spice-route-ca",
    region: "Canada",
    plan: "starter",
    status: "past-due",
    ownerName: "Anjali Verma",
    ownerEmail: "anjali@spiceroute.ca",
    merchants: 18,
    customers: 3640,
    mrr: 89000,
    createdAt: "2025-08-14",
    features: { delivery: true, coupons: true, multiCurrency: true, reviews: false, analytics: true, staffAccounts: true },
  },
  {
    id: "tn5",
    name: "Asia Market EU",
    slug: "asia-market-eu",
    region: "Germany",
    plan: "premium",
    status: "active",
    ownerName: "Deepak Rana",
    ownerEmail: "deepak@asiamarket.eu",
    merchants: 52,
    customers: 14200,
    mrr: 684000,
    createdAt: "2024-11-05",
    features: { delivery: true, coupons: true, multiCurrency: true, reviews: true, analytics: true, staffAccounts: true },
  },
  {
    id: "tn6",
    name: "Kathmandu Connect US",
    slug: "kathmandu-connect-us",
    region: "United States",
    plan: "starter",
    status: "suspended",
    ownerName: "Sabin Karki",
    ownerEmail: "sabin@kathmanduconnect.com",
    merchants: 9,
    customers: 2100,
    mrr: 0,
    createdAt: "2025-06-30",
    features: { delivery: false, coupons: false, multiCurrency: false, reviews: true, analytics: false, staffAccounts: false },
  },
]

export function getTenantById(id: string): Tenant | undefined {
  return tenants.find((t) => t.id === id)
}

const activeTenants = tenants.filter((t) => t.status === "active")

export const consoleStats = {
  totalTenants: tenants.length,
  activeTenants: activeTenants.length,
  trialTenants: tenants.filter((t) => t.status === "trial").length,
  pastDueTenants: tenants.filter((t) => t.status === "past-due").length,
  suspendedTenants: tenants.filter((t) => t.status === "suspended").length,
  totalMrr: tenants.reduce((sum, t) => sum + t.mrr, 0),
  totalMerchants: tenants.reduce((sum, t) => sum + t.merchants, 0),
  totalCustomers: tenants.reduce((sum, t) => sum + t.customers, 0),
}

export const tenantStatusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-chart-2/20 text-foreground border-chart-2/50" },
  trial: { label: "Trial", className: "bg-primary/15 text-primary border-primary/40" },
  "past-due": { label: "Past due", className: "bg-accent/30 text-accent-foreground border-accent" },
  suspended: { label: "Suspended", className: "bg-destructive/10 text-destructive border-destructive/30" },
}

// ---------- Tenant growth (MRR time series) ----------

export const tenantMonthly = [
  { month: "Jan", mrr: 980000, tenants: 4 },
  { month: "Feb", mrr: 1180000, tenants: 5 },
  { month: "Mar", mrr: 1290000, tenants: 5 },
  { month: "Apr", mrr: 1340000, tenants: 5 },
  { month: "May", mrr: 1420000, tenants: 6 },
  { month: "Jun", mrr: 1521000, tenants: 6 },
]

// ---------- Feature flags ----------

export const featureFlags: FeatureFlag[] = [
  { key: "delivery", name: "Local delivery", description: "Allow merchants to offer local delivery zones", category: "Commerce", defaultEnabled: true },
  { key: "coupons", name: "Coupons & discounts", description: "Enable discount codes and promotional campaigns", category: "Commerce", defaultEnabled: true },
  { key: "multiCurrency", name: "Multi-currency", description: "Display and charge in multiple currencies", category: "Commerce", defaultEnabled: false },
  { key: "reviews", name: "Customer reviews", description: "Let customers rate and review shops", category: "Engagement", defaultEnabled: true },
  { key: "analytics", name: "Advanced analytics", description: "Detailed reports and exportable dashboards", category: "Insights", defaultEnabled: true },
  { key: "staffAccounts", name: "Staff accounts", description: "Merchants can invite team members", category: "Accounts", defaultEnabled: true },
  { key: "aiRecommendations", name: "AI recommendations", description: "Personalized product recommendations (beta)", category: "Beta", defaultEnabled: false },
  { key: "loyaltyProgram", name: "Loyalty program", description: "Points and rewards for repeat customers (beta)", category: "Beta", defaultEnabled: false },
]

// ---------- RBAC roles ----------

export const consoleRoles: ConsoleRole[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full access to all tenants and system settings",
    members: 2,
    permissions: ["tenants.manage", "billing.manage", "features.manage", "rbac.manage", "audit.view", "system.manage", "impersonate"],
  },
  {
    id: "r2",
    name: "Operations",
    description: "Manage tenants and subscriptions, no system config",
    members: 4,
    permissions: ["tenants.manage", "billing.manage", "audit.view"],
  },
  {
    id: "r3",
    name: "Support",
    description: "View tenants and impersonate for troubleshooting",
    members: 8,
    permissions: ["tenants.view", "impersonate", "audit.view"],
  },
  {
    id: "r4",
    name: "Finance",
    description: "Billing and revenue reporting only",
    members: 3,
    permissions: ["billing.manage", "billing.view"],
  },
  {
    id: "r5",
    name: "Read Only",
    description: "View-only access to dashboards and reports",
    members: 6,
    permissions: ["tenants.view", "audit.view"],
  },
]

export const allPermissions = [
  { key: "tenants.manage", label: "Manage tenants" },
  { key: "tenants.view", label: "View tenants" },
  { key: "billing.manage", label: "Manage billing" },
  { key: "billing.view", label: "View billing" },
  { key: "features.manage", label: "Manage feature flags" },
  { key: "rbac.manage", label: "Manage roles & access" },
  { key: "audit.view", label: "View audit logs" },
  { key: "system.manage", label: "Manage system settings" },
  { key: "impersonate", label: "Impersonate tenants" },
]

// ---------- Audit logs ----------

export const auditLogs: AuditLog[] = [
  { id: "al1", actor: "Ramesh Thapa", actorRole: "Super Admin", action: "Suspended tenant", target: "Kathmandu Connect US", tenant: "kathmandu-connect-us", severity: "critical", timestamp: "2026-06-13T09:42:00", ip: "203.0.113.14" },
  { id: "al2", actor: "Priya Sharma", actorRole: "Operations", action: "Upgraded subscription", target: "Desi Bazaar UK → Premium", tenant: "desi-bazaar-uk", severity: "info", timestamp: "2026-06-13T08:30:00", ip: "198.51.100.7" },
  { id: "al3", actor: "System", actorRole: "Automated", action: "Payment failed", target: "Spice Route Canada", tenant: "spice-route-ca", severity: "warning", timestamp: "2026-06-13T06:15:00", ip: "—" },
  { id: "al4", actor: "Sabin Karki", actorRole: "Support", action: "Impersonated tenant admin", target: "Asia Market EU", tenant: "asia-market-eu", severity: "warning", timestamp: "2026-06-12T22:08:00", ip: "192.0.2.55" },
  { id: "al5", actor: "Ramesh Thapa", actorRole: "Super Admin", action: "Enabled feature flag", target: "AI recommendations (Asia Market EU)", tenant: "asia-market-eu", severity: "info", timestamp: "2026-06-12T18:45:00", ip: "203.0.113.14" },
  { id: "al6", actor: "Anjali Verma", actorRole: "Finance", action: "Exported revenue report", target: "All tenants — May 2026", tenant: "—", severity: "info", timestamp: "2026-06-12T15:20:00", ip: "198.51.100.92" },
  { id: "al7", actor: "Deepak Rana", actorRole: "Operations", action: "Created tenant", target: "Himalaya Mart AU", tenant: "himalaya-mart-au", severity: "info", timestamp: "2026-05-28T11:00:00", ip: "203.0.113.201" },
  { id: "al8", actor: "System", actorRole: "Automated", action: "Trial started", target: "Himalaya Mart AU (14-day)", tenant: "himalaya-mart-au", severity: "info", timestamp: "2026-05-28T11:01:00", ip: "—" },
  { id: "al9", actor: "Priya Sharma", actorRole: "Operations", action: "Updated RBAC role", target: "Support role permissions", tenant: "—", severity: "warning", timestamp: "2026-05-27T14:33:00", ip: "198.51.100.7" },
  { id: "al10", actor: "Ramesh Thapa", actorRole: "Super Admin", action: "Changed system setting", target: "Default trial length → 14 days", tenant: "—", severity: "critical", timestamp: "2026-05-26T09:10:00", ip: "203.0.113.14" },
]

export const auditSeverityConfig: Record<string, { label: string; className: string }> = {
  info: { label: "Info", className: "bg-muted text-muted-foreground border-border" },
  warning: { label: "Warning", className: "bg-accent/30 text-accent-foreground border-accent" },
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/30" },
}
