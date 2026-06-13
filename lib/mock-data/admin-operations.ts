import type { OrderStatus, PaymentMethod } from "@/lib/types"
import { shops } from "@/lib/mock-data/shops"

// Platform-wide order feed visible to the marketplace operator.
export interface PlatformOrder {
  id: string
  shopId: string
  customerName: string
  itemCount: number
  total: number
  commission: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  createdAt: string
}

export const platformOrders: PlatformOrder[] = [
  { id: "ORD-20451", shopId: "2", customerName: "Bikash Shrestha", itemCount: 4, total: 8420, commission: 253, status: "delivered", paymentMethod: "paypay", createdAt: "2026-06-13T10:12:00" },
  { id: "ORD-20450", shopId: "1", customerName: "Suman Gurung", itemCount: 2, total: 4830, commission: 242, status: "out-for-delivery", paymentMethod: "paypay", createdAt: "2026-06-13T09:48:00" },
  { id: "ORD-20449", shopId: "5", customerName: "Deepa Thapa", itemCount: 6, total: 12600, commission: 630, status: "preparing", paymentMethod: "credit-card", createdAt: "2026-06-13T09:30:00" },
  { id: "ORD-20448", shopId: "11", customerName: "Nisha Lama", itemCount: 3, total: 6740, commission: 202, status: "confirmed", paymentMethod: "cod", createdAt: "2026-06-13T08:55:00" },
  { id: "ORD-20447", shopId: "3", customerName: "Raju Magar", itemCount: 1, total: 2980, commission: 238, status: "pending", paymentMethod: "paypay", createdAt: "2026-06-13T08:40:00" },
  { id: "ORD-20446", shopId: "8", customerName: "Sita Rai", itemCount: 5, total: 9850, commission: 295, status: "delivered", paymentMethod: "credit-card", createdAt: "2026-06-12T19:20:00" },
  { id: "ORD-20445", shopId: "9", customerName: "Prakash Adhikari", itemCount: 2, total: 5120, commission: 256, status: "delivered", paymentMethod: "paypay", createdAt: "2026-06-12T18:05:00" },
  { id: "ORD-20444", shopId: "1", customerName: "Anita Tamang", itemCount: 4, total: 3410, commission: 170, status: "cancelled", paymentMethod: "cod", createdAt: "2026-06-12T16:32:00" },
  { id: "ORD-20443", shopId: "4", customerName: "Manisha Karki", itemCount: 3, total: 7280, commission: 364, status: "delivered", paymentMethod: "bank-transfer", createdAt: "2026-06-12T14:10:00" },
  { id: "ORD-20442", shopId: "7", customerName: "Kamal Bhandari", itemCount: 2, total: 4560, commission: 228, status: "delivered", paymentMethod: "paypay", createdAt: "2026-06-12T12:45:00" },
  { id: "ORD-20441", shopId: "2", customerName: "Sabina Khatri", itemCount: 7, total: 14900, commission: 447, status: "preparing", paymentMethod: "credit-card", createdAt: "2026-06-12T11:30:00" },
  { id: "ORD-20440", shopId: "5", customerName: "Dipesh Poudel", itemCount: 1, total: 1980, commission: 99, status: "delivered", paymentMethod: "cod", createdAt: "2026-06-12T10:15:00" },
]

export function getOrderShopName(shopId: string): string {
  return shops.find((s) => s.id === shopId)?.name ?? "Unknown Shop"
}

export const platformOrderStats = {
  total: platformOrders.length,
  pending: platformOrders.filter((o) => o.status === "pending").length,
  delivered: platformOrders.filter((o) => o.status === "delivered").length,
  gmv: platformOrders.reduce((sum, o) => sum + o.total, 0),
  commission: platformOrders.reduce((sum, o) => sum + o.commission, 0),
}

// ---------- Reports ----------

export interface CategorySales {
  category: string
  orders: number
  revenue: number
}

export const categorySales: CategorySales[] = [
  { category: "Groceries", orders: 1842, revenue: 4280000 },
  { category: "Food & Beverages", orders: 1213, revenue: 2960000 },
  { category: "Handicrafts", orders: 487, revenue: 1340000 },
  { category: "Fashion", orders: 392, revenue: 1180000 },
  { category: "Health & Beauty", orders: 271, revenue: 690000 },
  { category: "Books & Stationery", orders: 156, revenue: 320000 },
]

export interface TopMerchantReport {
  shopId: string
  revenue: number
  orders: number
  growth: number
}

export const topMerchants: TopMerchantReport[] = [
  { shopId: "2", revenue: 512000, orders: 203, growth: 14.2 },
  { shopId: "11", revenue: 398000, orders: 156, growth: 9.8 },
  { shopId: "1", revenue: 327000, orders: 114, growth: 22.5 },
  { shopId: "5", revenue: 276000, orders: 98, growth: -3.1 },
  { shopId: "9", revenue: 211000, orders: 82, growth: 18.7 },
]
