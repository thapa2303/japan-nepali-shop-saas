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
  ward: string
  municipality: string
  district: string
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
  type: "district" | "municipality" | "ward"
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
  address: string
  ward: string
  municipality: string
  district: string
  landmark?: string
  paymentMethod: PaymentMethod
  notes?: string
}

export type PaymentMethod = "cod" | "esewa" | "khalti" | "bank-transfer"

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
