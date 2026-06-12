// Core type definitions for Shop SaaS platform

export interface Shop {
  id: string
  slug: string
  name: string
  nameNepali?: string
  description: string
  category: ShopCategory
  subcategories: string[]
  coverImage: string
  logo: string
  rating: number
  reviewCount: number
  isOpen: boolean
  openingHours: OpeningHours
  location: ShopLocation
  contact: ShopContact
  features: ShopFeature[]
  minOrder?: number
  deliveryFee?: number
  deliveryTime?: string
  featured?: boolean
}

export type ShopCategory =
  | "groceries"
  | "fashion"
  | "electronics"
  | "home-decor"
  | "health-beauty"
  | "books-stationery"
  | "sports-fitness"
  | "food-beverages"
  | "handicrafts"
  | "jewelry"

export type ShopFeature = "delivery" | "pickup" | "cash-on-delivery" | "digital-payment" | "wholesale"

export interface OpeningHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  open: string
  close: string
  isClosed: boolean
}

export interface ShopLocation {
  address: string
  area: string
  city: string
  prefecture: string
  postalCode: string
  coordinates: Coordinates
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface ShopContact {
  phone: string
  whatsapp?: string
  email?: string
}

export interface Product {
  id: string
  shopId: string
  name: string
  nameNepali?: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  inStock: boolean
  stockCount?: number
  unit?: string
  variants?: ProductVariant[]
  featured?: boolean
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: ProductVariant
  shopId: string
  shopName: string
}

export interface Cart {
  items: CartItem[]
  shopCarts: ShopCart[]
}

export interface ShopCart {
  shopId: string
  shopName: string
  shopSlug: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
}

export interface Category {
  id: string
  name: string
  nameNepali: string
  slug: ShopCategory
  icon: string
  description: string
  shopCount: number
}

export interface Location {
  id: string
  name: string
  nameNepali: string
  type: "prefecture" | "city" | "area"
  parentId?: string
}

export interface SearchFilters {
  query?: string
  category?: ShopCategory
  location?: string
  rating?: number
  features?: ShopFeature[]
  sortBy?: "rating" | "distance" | "name" | "newest"
}

export interface CheckoutInfo {
  fullName: string
  phone: string
  email?: string
  postalCode: string
  prefecture: string
  city: string
  address: string
  building?: string
  paymentMethod: PaymentMethod
  notes?: string
}

export type PaymentMethod = "cod" | "paypay" | "credit-card" | "bank-transfer"

export interface Order {
  id: string
  items: CartItem[]
  customer: CheckoutInfo
  status: OrderStatus
  totalAmount: number
  deliveryFee: number
  createdAt: Date
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"

// ---------- Merchant Dashboard types ----------

export interface DashboardOrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  variant?: string
}

export interface DashboardOrder {
  id: string
  shopId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: DashboardOrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  createdAt: string
}

export type SubscriptionTier = "starter" | "growth" | "premium"

export interface SubscriptionPlan {
  tier: SubscriptionTier
  name: string
  monthlyPrice: number
  productLimit: number
  commissionRate: number
  features: string[]
  highlighted?: boolean
}

export type InvoiceStatus = "paid" | "pending" | "failed"

export interface Invoice {
  id: string
  date: string
  amount: number
  status: InvoiceStatus
  plan: string
}

export interface MerchantSubscription {
  shopId: string
  tier: SubscriptionTier
  status: "active" | "trialing" | "past-due"
  currentPeriodEnd: string
  invoices: Invoice[]
}
