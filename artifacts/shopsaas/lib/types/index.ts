// Core type definitions for Shop SaaS platform
// Location and contact fields match the actual API response shape

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
  openingHours?: ShopOpeningHour[]
  location?: ShopLocation | null
  // Flat contact fields from API
  contactPhone: string
  contactWhatsapp?: string | null
  contactEmail?: string | null
  features: ShopFeature[]
  minOrder?: number | null
  deliveryFee?: number | null
  deliveryTime?: string | null
  featured?: boolean
  googleMapsTag?: string | null
  googleMapsUrl?: string | null
  onlineStoreUrl?: string | null
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

export interface ShopOpeningHour {
  id: string
  shopId: string
  dayOfWeek: string
  openTime: string
  closeTime: string
  isClosed: boolean
}

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
  id?: string
  shopId?: string
  address: string
  area: string
  city: string
  prefecture: string
  postalCode: string
  // API returns flat lat/lng (not nested coordinates object)
  lat: number
  lng: number
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
  browseCategory?: string
  storeCategory?: string
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
  shopSlug?: string
  deliveryFee?: number
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
  slug: string
  icon: string
  image: string
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

export type MerchantStatus = "active" | "pending" | "suspended"

export interface PlatformMerchant {
  shopId: string
  status: MerchantStatus
  tier: SubscriptionTier
  joinedAt: string
  monthlyRevenue: number
  totalOrders: number
  productCount: number
  commissionEarned: number
}

export type CustomerStatus = "active" | "blocked"

export interface PlatformCustomer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  prefecture: string
  status: CustomerStatus
  joinedAt: string
  totalOrders: number
  totalSpent: number
}

export interface PlatformMonthly {
  month: string
  gmv: number
  mrr: number
  orders: number
  newMerchants: number
}

export interface TierDistribution {
  tier: SubscriptionTier
  merchants: number
}

export type CouponType = "percentage" | "fixed" | "free-shipping"
export type CouponStatus = "active" | "scheduled" | "expired" | "disabled"

export interface Coupon {
  id: string
  code: string
  description: string
  type: CouponType
  value: number
  minSpend?: number
  usageLimit?: number
  usedCount: number
  startDate: string
  endDate: string
  status: CouponStatus
}

export interface StoreCategory {
  id: string
  name: string
  productCount: number
  visible: boolean
}

export type StaffRole = "owner" | "manager" | "staff"
export type StaffStatus = "active" | "invited" | "disabled"

export interface StaffUser {
  id: string
  name: string
  email: string
  role: StaffRole
  status: StaffStatus
  lastActive: string
  avatar?: string
}

export interface DeliveryZone {
  id: string
  name: string
  fee: number
  minOrder: number
  estimatedTime: string
  enabled: boolean
}

export interface DeliverySettings {
  deliveryEnabled: boolean
  pickupEnabled: boolean
  freeDeliveryThreshold: number
  preparationTime: string
  zones: DeliveryZone[]
}

export type TenantStatus = "active" | "suspended" | "trial" | "past-due"

export interface Tenant {
  id: string
  name: string
  slug: string
  region: string
  plan: SubscriptionTier
  status: TenantStatus
  ownerName: string
  ownerEmail: string
  merchants: number
  customers: number
  mrr: number
  createdAt: string
  features: Record<string, boolean>
}

export type AuditSeverity = "info" | "warning" | "critical"

export interface AuditLog {
  id: string
  actor: string
  actorRole: string
  action: string
  target: string
  tenant: string
  severity: AuditSeverity
  timestamp: string
  ip: string
}

export interface FeatureFlag {
  key: string
  name: string
  description: string
  category: string
  defaultEnabled: boolean
}

export interface ConsoleRole {
  id: string
  name: string
  description: string
  members: number
  permissions: string[]
}

export interface CustomerAddress {
  id: string
  label: string
  fullName: string
  phone: string
  postalCode: string
  prefecture: string
  city: string
  address: string
  building?: string
  isDefault: boolean
}

export interface CustomerOrderSummary {
  id: string
  shopName: string
  shopSlug: string
  date: string
  itemCount: number
  total: number
  status: OrderStatus
}

export interface CustomerProfile {
  id: string
  name: string
  nameNepali?: string
  email: string
  phone: string
  avatar?: string
  joinedAt: string
  preferredLanguage: "en" | "ne"
  addresses: CustomerAddress[]
  recentOrders: CustomerOrderSummary[]
  favoriteShopSlugs: string[]
  notifications: {
    orderUpdates: boolean
    promotions: boolean
    newShops: boolean
    newsletter: boolean
  }
}
