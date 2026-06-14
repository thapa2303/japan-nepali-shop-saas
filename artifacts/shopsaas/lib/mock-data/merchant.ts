import type {
  DashboardOrder,
  SubscriptionPlan,
  MerchantSubscription,
} from "@/lib/types"

// The currently "logged-in" merchant for this mock session.
// In a real multi-tenant system this would come from the authenticated session.
export const CURRENT_MERCHANT_SHOP_ID = "1"

// ---------- Subscription plans (SaaS tiers offered to merchants) ----------

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: "starter",
    name: "Starter",
    monthlyPrice: 2980,
    productLimit: 30,
    commissionRate: 8,
    features: [
      "Up to 30 products",
      "Order management",
      "Basic sales analytics",
      "Cash on delivery support",
      "Email support",
    ],
  },
  {
    tier: "growth",
    name: "Growth",
    monthlyPrice: 5980,
    productLimit: 150,
    commissionRate: 5,
    features: [
      "Up to 150 products",
      "Order management",
      "Advanced analytics & reports",
      "All payment methods (PayPay, cards)",
      "Featured placement (2x/month)",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    tier: "premium",
    name: "Premium",
    monthlyPrice: 11800,
    productLimit: 999,
    commissionRate: 3,
    features: [
      "Unlimited products",
      "Order management",
      "Full analytics suite & exports",
      "All payment methods",
      "Always-on featured placement",
      "Dedicated account manager",
      "Custom storefront branding",
    ],
  },
]

export function getPlanByTier(tier: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.tier === tier)
}

// ---------- Current merchant's subscription ----------

export const merchantSubscription: MerchantSubscription = {
  shopId: CURRENT_MERCHANT_SHOP_ID,
  tier: "growth",
  status: "active",
  currentPeriodEnd: "2026-07-12",
  invoices: [
    { id: "INV-2026-006", date: "2026-06-12", amount: 5980, status: "paid", plan: "Growth (Monthly)" },
    { id: "INV-2026-005", date: "2026-05-12", amount: 5980, status: "paid", plan: "Growth (Monthly)" },
    { id: "INV-2026-004", date: "2026-04-12", amount: 5980, status: "paid", plan: "Growth (Monthly)" },
    { id: "INV-2026-003", date: "2026-03-12", amount: 2980, status: "paid", plan: "Starter (Monthly)" },
    { id: "INV-2026-002", date: "2026-02-12", amount: 2980, status: "paid", plan: "Starter (Monthly)" },
    { id: "INV-2026-001", date: "2026-01-12", amount: 2980, status: "paid", plan: "Starter (Monthly)" },
  ],
}

// ---------- Orders for the current merchant (scoped to shopId) ----------

export const dashboardOrders: DashboardOrder[] = [
  {
    id: "ORD-10428",
    shopId: "1",
    customerName: "Suman Gurung",
    customerPhone: "+81-90-1111-2222",
    deliveryAddress: "Hyakunincho 2-1-1, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p1", name: "Wai Wai Noodles (Pack of 5)", quantity: 3, price: 450 },
      { productId: "p2", name: "Basmati Rice 5kg", quantity: 1, price: 2980 },
    ],
    subtotal: 4330,
    deliveryFee: 500,
    total: 4830,
    status: "pending",
    paymentMethod: "paypay",
    createdAt: "2026-06-12T09:24:00",
  },
  {
    id: "ORD-10427",
    shopId: "1",
    customerName: "Anita Tamang",
    customerPhone: "+81-90-2222-3333",
    deliveryAddress: "Okubo 1-5-3, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p4", name: "Nepali Masala Spice Mix", quantity: 2, price: 580 },
      { productId: "p3", name: "Masoor Dal (Red Lentils) 1kg", quantity: 2, price: 680 },
      { productId: "p5", name: "Frozen Momo Wrappers", quantity: 1, price: 390 },
    ],
    subtotal: 2910,
    deliveryFee: 500,
    total: 3410,
    status: "confirmed",
    paymentMethod: "cod",
    createdAt: "2026-06-12T08:10:00",
  },
  {
    id: "ORD-10426",
    shopId: "1",
    customerName: "Bikash Shrestha",
    customerPhone: "+81-80-3333-4444",
    deliveryAddress: "Takadanobaba 3-2-7, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p2", name: "Basmati Rice 5kg", quantity: 2, price: 2980 },
    ],
    subtotal: 5960,
    deliveryFee: 500,
    total: 6460,
    status: "preparing",
    paymentMethod: "credit-card",
    createdAt: "2026-06-11T18:42:00",
  },
  {
    id: "ORD-10425",
    shopId: "1",
    customerName: "Sita Rai",
    customerPhone: "+81-90-4444-5555",
    deliveryAddress: "Nishi-Waseda 1-9-2, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p1", name: "Wai Wai Noodles (Pack of 5)", quantity: 5, price: 450 },
      { productId: "p4", name: "Nepali Masala Spice Mix", quantity: 1, price: 580 },
    ],
    subtotal: 2830,
    deliveryFee: 500,
    total: 3330,
    status: "out-for-delivery",
    paymentMethod: "paypay",
    createdAt: "2026-06-11T14:05:00",
  },
  {
    id: "ORD-10424",
    shopId: "1",
    customerName: "Raju Magar",
    customerPhone: "+81-80-5555-6666",
    deliveryAddress: "Hyakunincho 1-3-8, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p3", name: "Masoor Dal (Red Lentils) 1kg", quantity: 3, price: 680 },
      { productId: "p2", name: "Basmati Rice 5kg", quantity: 1, price: 2980 },
    ],
    subtotal: 5020,
    deliveryFee: 500,
    total: 5520,
    status: "delivered",
    paymentMethod: "cod",
    createdAt: "2026-06-10T11:20:00",
  },
  {
    id: "ORD-10423",
    shopId: "1",
    customerName: "Deepa Thapa",
    customerPhone: "+81-90-6666-7777",
    deliveryAddress: "Okubo 2-8-1, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p5", name: "Frozen Momo Wrappers", quantity: 4, price: 390 },
    ],
    subtotal: 1560,
    deliveryFee: 500,
    total: 2060,
    status: "delivered",
    paymentMethod: "paypay",
    createdAt: "2026-06-10T09:50:00",
  },
  {
    id: "ORD-10422",
    shopId: "1",
    customerName: "Kamal Bhandari",
    customerPhone: "+81-80-7777-8888",
    deliveryAddress: "Shin-Okubo 1-2-4, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p2", name: "Basmati Rice 5kg", quantity: 1, price: 2980 },
      { productId: "p1", name: "Wai Wai Noodles (Pack of 5)", quantity: 2, price: 450 },
    ],
    subtotal: 3880,
    deliveryFee: 500,
    total: 4380,
    status: "delivered",
    paymentMethod: "credit-card",
    createdAt: "2026-06-09T16:30:00",
  },
  {
    id: "ORD-10421",
    shopId: "1",
    customerName: "Nisha Lama",
    customerPhone: "+81-90-8888-9999",
    deliveryAddress: "Takadanobaba 2-1-5, Shinjuku-ku, Tokyo",
    items: [
      { productId: "p4", name: "Nepali Masala Spice Mix", quantity: 3, price: 580 },
    ],
    subtotal: 1740,
    deliveryFee: 500,
    total: 2240,
    status: "cancelled",
    paymentMethod: "cod",
    createdAt: "2026-06-09T10:15:00",
  },
]

export function getOrdersByShopId(shopId: string): DashboardOrder[] {
  return dashboardOrders.filter((order) => order.shopId === shopId)
}

// ---------- Aggregated analytics for the current merchant ----------

export interface MonthlySales {
  month: string
  revenue: number
  orders: number
}

export const monthlySales: MonthlySales[] = [
  { month: "Jan", revenue: 184000, orders: 62 },
  { month: "Feb", revenue: 213000, orders: 74 },
  { month: "Mar", revenue: 198000, orders: 68 },
  { month: "Apr", revenue: 256000, orders: 88 },
  { month: "May", revenue: 298000, orders: 102 },
  { month: "Jun", revenue: 327000, orders: 114 },
]

export interface CategorySales {
  category: string
  revenue: number
}

export const categorySales: CategorySales[] = [
  { category: "Rice & Grains", revenue: 128000 },
  { category: "Spices", revenue: 86000 },
  { category: "Lentils", revenue: 64000 },
  { category: "Snacks", revenue: 49000 },
]

export interface TopProduct {
  productId: string
  name: string
  unitsSold: number
  revenue: number
}

export const topProducts: TopProduct[] = [
  { productId: "p2", name: "Basmati Rice 5kg", unitsSold: 142, revenue: 423160 },
  { productId: "p1", name: "Wai Wai Noodles (Pack of 5)", unitsSold: 318, revenue: 143100 },
  { productId: "p4", name: "Nepali Masala Spice Mix", unitsSold: 196, revenue: 113680 },
  { productId: "p3", name: "Masoor Dal (Red Lentils) 1kg", unitsSold: 134, revenue: 91120 },
  { productId: "p5", name: "Frozen Momo Wrappers", unitsSold: 88, revenue: 34320 },
]
