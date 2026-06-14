import type {
  PlatformMerchant,
  PlatformCustomer,
  PlatformMonthly,
  TierDistribution,
  SubscriptionTier,
} from "@/lib/types"
import { shops } from "@/lib/mock-data/shops"

// ---------- Per-merchant platform records (keyed to shops.ts ids) ----------
// In a real multi-tenant system the platform operator sees every merchant.
// Each record stays linked to its shopId so merchant data remains isolated.

export const platformMerchants: PlatformMerchant[] = [
  { shopId: "1", status: "active", tier: "growth", joinedAt: "2025-03-14", monthlyRevenue: 327000, totalOrders: 114, productCount: 48, commissionEarned: 16350 },
  { shopId: "2", status: "active", tier: "premium", joinedAt: "2025-01-22", monthlyRevenue: 512000, totalOrders: 203, productCount: 36, commissionEarned: 15360 },
  { shopId: "3", status: "active", tier: "starter", joinedAt: "2025-06-08", monthlyRevenue: 98000, totalOrders: 41, productCount: 27, commissionEarned: 7840 },
  { shopId: "4", status: "active", tier: "growth", joinedAt: "2025-04-30", monthlyRevenue: 143000, totalOrders: 52, productCount: 31, commissionEarned: 7150 },
  { shopId: "5", status: "active", tier: "growth", joinedAt: "2025-02-11", monthlyRevenue: 276000, totalOrders: 98, productCount: 64, commissionEarned: 13800 },
  { shopId: "6", status: "active", tier: "starter", joinedAt: "2025-08-19", monthlyRevenue: 74000, totalOrders: 33, productCount: 22, commissionEarned: 5920 },
  { shopId: "7", status: "active", tier: "growth", joinedAt: "2025-05-27", monthlyRevenue: 188000, totalOrders: 71, productCount: 53, commissionEarned: 9400 },
  { shopId: "8", status: "active", tier: "premium", joinedAt: "2025-03-03", monthlyRevenue: 162000, totalOrders: 58, productCount: 41, commissionEarned: 4860 },
  { shopId: "9", status: "active", tier: "growth", joinedAt: "2025-07-15", monthlyRevenue: 211000, totalOrders: 82, productCount: 58, commissionEarned: 10550 },
  { shopId: "10", status: "suspended", tier: "starter", joinedAt: "2025-09-01", monthlyRevenue: 0, totalOrders: 16, productCount: 19, commissionEarned: 0 },
  { shopId: "11", status: "active", tier: "premium", joinedAt: "2025-02-26", monthlyRevenue: 398000, totalOrders: 156, productCount: 44, commissionEarned: 11940 },
  { shopId: "12", status: "pending", tier: "starter", joinedAt: "2026-06-05", monthlyRevenue: 0, totalOrders: 0, productCount: 24, commissionEarned: 0 },
]

export function getMerchantRecord(shopId: string): PlatformMerchant | undefined {
  return platformMerchants.find((m) => m.shopId === shopId)
}

export function getShopName(shopId: string): string {
  return shops.find((s) => s.id === shopId)?.name ?? "Unknown Shop"
}

// ---------- Platform-wide aggregates ----------

const activeMerchants = platformMerchants.filter((m) => m.status === "active")

export const platformStats = {
  totalMerchants: platformMerchants.length,
  activeMerchants: activeMerchants.length,
  pendingMerchants: platformMerchants.filter((m) => m.status === "pending").length,
  suspendedMerchants: platformMerchants.filter((m) => m.status === "suspended").length,
  // Gross Merchandise Value = sum of all merchant monthly revenue
  monthlyGmv: platformMerchants.reduce((sum, m) => sum + m.monthlyRevenue, 0),
  // Monthly Recurring Revenue = sum of plan fees + commission earned
  monthlyCommission: platformMerchants.reduce((sum, m) => sum + m.commissionEarned, 0),
  totalOrders: platformMerchants.reduce((sum, m) => sum + m.totalOrders, 0),
  totalProducts: platformMerchants.reduce((sum, m) => sum + m.productCount, 0),
}

// ---------- Platform growth time series ----------

export const platformMonthly: PlatformMonthly[] = [
  { month: "Jan", gmv: 1240000, mrr: 38400, orders: 412, newMerchants: 2 },
  { month: "Feb", gmv: 1480000, mrr: 47800, orders: 498, newMerchants: 3 },
  { month: "Mar", gmv: 1720000, mrr: 56200, orders: 587, newMerchants: 3 },
  { month: "Apr", gmv: 1980000, mrr: 61400, orders: 661, newMerchants: 1 },
  { month: "May", gmv: 2310000, mrr: 68900, orders: 742, newMerchants: 2 },
  { month: "Jun", gmv: 2589000, mrr: 74600, orders: 823, newMerchants: 1 },
]

// ---------- Subscription tier distribution ----------

export const tierDistribution: TierDistribution[] = (
  ["starter", "growth", "premium"] as SubscriptionTier[]
).map((tier) => ({
  tier,
  merchants: platformMerchants.filter((m) => m.tier === tier).length,
}))

// MRR contribution by plan tier (plan fee x active merchants on that tier)
const tierMonthlyFee: Record<SubscriptionTier, number> = {
  starter: 2980,
  growth: 5980,
  premium: 11800,
}

export const planRevenue = (["starter", "growth", "premium"] as SubscriptionTier[]).map(
  (tier) => {
    const merchants = activeMerchants.filter((m) => m.tier === tier).length
    return {
      tier,
      merchants,
      monthlyRevenue: merchants * tierMonthlyFee[tier],
    }
  }
)

// ---------- Platform customers ----------

export const platformCustomers: PlatformCustomer[] = [
  { id: "c1", name: "Suman Gurung", email: "suman.gurung@email.com", phone: "+81-90-1111-2222", city: "Shinjuku", prefecture: "Tokyo", status: "active", joinedAt: "2025-04-12", totalOrders: 28, totalSpent: 142800 },
  { id: "c2", name: "Anita Tamang", email: "anita.tamang@email.com", phone: "+81-90-2222-3333", city: "Shinjuku", prefecture: "Tokyo", status: "active", joinedAt: "2025-05-03", totalOrders: 19, totalSpent: 87600 },
  { id: "c3", name: "Bikash Shrestha", email: "bikash.s@email.com", phone: "+81-80-3333-4444", city: "Kawaguchi", prefecture: "Saitama", status: "active", joinedAt: "2025-02-18", totalOrders: 41, totalSpent: 213400 },
  { id: "c4", name: "Sita Rai", email: "sita.rai@email.com", phone: "+81-90-4444-5555", city: "Yokohama", prefecture: "Kanagawa", status: "active", joinedAt: "2025-06-21", totalOrders: 12, totalSpent: 54200 },
  { id: "c5", name: "Raju Magar", email: "raju.magar@email.com", phone: "+81-80-5555-6666", city: "Nagoya", prefecture: "Aichi", status: "active", joinedAt: "2025-07-09", totalOrders: 23, totalSpent: 98700 },
  { id: "c6", name: "Deepa Thapa", email: "deepa.thapa@email.com", phone: "+81-90-6666-7777", city: "Shinjuku", prefecture: "Tokyo", status: "active", joinedAt: "2025-03-30", totalOrders: 35, totalSpent: 167900 },
  { id: "c7", name: "Kamal Bhandari", email: "kamal.b@email.com", phone: "+81-80-7777-8888", city: "Warabi", prefecture: "Saitama", status: "blocked", joinedAt: "2025-08-14", totalOrders: 4, totalSpent: 18200 },
  { id: "c8", name: "Nisha Lama", email: "nisha.lama@email.com", phone: "+81-90-8888-9999", city: "Osaka", prefecture: "Osaka", status: "active", joinedAt: "2025-09-02", totalOrders: 16, totalSpent: 72300 },
  { id: "c9", name: "Prakash Adhikari", email: "prakash.a@email.com", phone: "+81-80-9999-0000", city: "Taito", prefecture: "Tokyo", status: "active", joinedAt: "2025-10-11", totalOrders: 9, totalSpent: 41500 },
  { id: "c10", name: "Manisha Karki", email: "manisha.k@email.com", phone: "+81-90-1010-2020", city: "Arakawa", prefecture: "Tokyo", status: "active", joinedAt: "2026-01-19", totalOrders: 7, totalSpent: 33800 },
  { id: "c11", name: "Dipesh Poudel", email: "dipesh.p@email.com", phone: "+81-80-3030-4040", city: "Yokohama", prefecture: "Kanagawa", status: "active", joinedAt: "2026-02-27", totalOrders: 5, totalSpent: 24600 },
  { id: "c12", name: "Sabina Khatri", email: "sabina.k@email.com", phone: "+81-90-5050-6060", city: "Nagoya", prefecture: "Aichi", status: "active", joinedAt: "2026-03-15", totalOrders: 3, totalSpent: 14900 },
]

export const customerStats = {
  total: platformCustomers.length,
  active: platformCustomers.filter((c) => c.status === "active").length,
  blocked: platformCustomers.filter((c) => c.status === "blocked").length,
  totalSpent: platformCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
}
