import type { Shop, Product, Category, Location, DashboardOrder } from "@/lib/types"

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:8080"
  }
  return ""
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getBaseUrl()
  const url = `${base}${path}`
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export interface ShopsResponse {
  shops: Shop[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export interface ProductsResponse {
  products: Product[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export interface CategoriesResponse {
  categories: Array<{
    id: string
    name: string
    nameNepali?: string
    slug: string
    icon?: string
    image?: string
    description?: string
    sortOrder: number
  }>
}

export interface SearchResponse {
  shops: Shop[]
  products: Array<
    Product & { shop?: { id: string; name: string; slug: string } }
  >
  total: number
}

export interface LocationsResponse {
  prefectures: Array<{
    id: string
    name: string
    nameNepali: string
    type: "prefecture"
    shopCount: number
  }>
  cities: Array<{
    id: string
    name: string
    nameNepali: string
    type: string
    parentId: string
  }>
}

export interface CartResponse {
  items: Array<{
    shopId: string
    shopName: string
    shopSlug: string
    deliveryFee: number
    subtotal: number
    items: Array<{
      id: string
      productId: string
      name: string
      price: number
      images: string[]
      quantity: number
      subtotal: number
    }>
  }>
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
}

export interface OrderSummary {
  id: string
  orderNumber?: string
  shopId: string
  shopName: string
  shopSlug: string
  status: string
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
}

export interface OrderDetail extends OrderSummary {
  shopLogo?: string
  deliveryAddress?: string
  deliveryPostalCode?: string
  deliveryPrefecture?: string
  deliveryCity?: string
  paymentMethod?: string
  notes?: string
  items: Array<{
    id: string
    productId: string
    productName: string
    price: number
    quantity: number
    subtotal: number
  }>
  updatedAt: string
}

export interface ProfileResponse {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  preferredLanguage: string
  joinedAt: string
  recentOrders: Array<{
    id: string
    orderNumber?: string
    shopName: string
    shopSlug: string
    date: string
    total: number
    status: string
  }>
}

export interface AddressItem {
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

// --- Dashboard types ---

export interface DashboardAnalytics {
  period: string
  totalRevenue: number
  orderCount: number
  topProducts: { productId: string; name: string; unitsSold: number; revenue: number }[]
  revenueByDay: { date: string; revenue: number }[]
  categoryBreakdown: { category: string; revenue: number }[]
}

export interface DashboardOrderItem {
  id: string
  orderNumber?: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  paymentMethod: string
  notes?: string
  items: unknown[]
  createdAt: string | Date
}

export interface DashboardSubscription {
  tier: string
  status: string
  planName: string
  monthlyPrice: number
  commissionRate: number
  productLimit: number
  currentProductCount: number
  staffCount: number
  plans: Array<{
    tier: string
    name: string
    monthlyPrice: number
    productLimit: number
    commissionRate: number
  }>
}

// --- Console types ---

export interface ConsoleAnalytics {
  totalMerchants: number
  activeMerchants: number
  suspendedMerchants: number
  totalOrders: number
  gmv: number
  mrr: number
  totalProducts: number
  totalCustomers: number
  tierDistribution: { tier: string; merchants: number }[]
}

export interface ConsoleTenant {
  id: string
  slug: string
  name: string
  status: string
  subscriptionTier: string
  createdAt: string
  shopCount: number
  productCount: number
  userCount: number
  orderCount: number
  revenue: number
  mrr: number
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    roles: string[]
    tenantId: string | null
  }
  token?: string
}

// --- Shop endpoints ---

export function fetchShops(params: Record<string, string> = {}): Promise<ShopsResponse> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch<ShopsResponse>(`/api/shops${qs ? `?${qs}` : ""}`)
}

export function fetchShopBySlug(slug: string): Promise<Shop> {
  return apiFetch<Shop>(`/api/shops/${encodeURIComponent(slug)}`)
}

export function fetchShopProducts(
  slug: string,
  params: Record<string, string> = {}
): Promise<{ products: Product[] }> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch<{ products: Product[] }>(
    `/api/shops/${encodeURIComponent(slug)}/products${qs ? `?${qs}` : ""}`
  )
}

// --- Product endpoints ---

export function fetchProducts(params: Record<string, string> = {}): Promise<ProductsResponse> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch<ProductsResponse>(`/api/products${qs ? `?${qs}` : ""}`)
}

export function fetchProductById(id: string): Promise<Product & { shop?: { id: string; name: string; slug: string; logo?: string; area?: string } }> {
  return apiFetch(`/api/products/${encodeURIComponent(id)}`)
}

export function fetchCategories(): Promise<CategoriesResponse> {
  return apiFetch<CategoriesResponse>("/api/categories")
}

// --- Search ---

export function fetchSearch(q: string, type?: "shops" | "products" | "all"): Promise<SearchResponse> {
  const params = new URLSearchParams({ q, ...(type ? { type } : {}) })
  return apiFetch<SearchResponse>(`/api/search?${params}`)
}

// --- Locations ---

export function fetchLocations(): Promise<LocationsResponse> {
  return apiFetch<LocationsResponse>("/api/locations")
}

// --- Cart ---

export function fetchCart(cookieHeader?: string): Promise<CartResponse> {
  return apiFetch<CartResponse>("/api/cart", cookieHeader ? { headers: { cookie: cookieHeader } } : {})
}

export function addToCart(productId: string, quantity = 1): Promise<CartResponse> {
  return apiFetch<CartResponse>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  })
}

export function updateCartItem(itemId: string, quantity: number): Promise<CartResponse> {
  return apiFetch<CartResponse>(`/api/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  })
}

export function removeCartItem(itemId: string): Promise<CartResponse> {
  return apiFetch<CartResponse>(`/api/cart/items/${itemId}`, { method: "DELETE" })
}

export function clearCart(): Promise<CartResponse> {
  return apiFetch<CartResponse>("/api/cart", { method: "DELETE" })
}

// --- Orders ---

export function createOrder(body: {
  deliveryAddress: string
  deliveryPostalCode?: string
  deliveryPrefecture?: string
  deliveryCity?: string
  deliveryBuilding?: string
  paymentMethod?: string
  notes?: string
}): Promise<{ orders: OrderSummary[] }> {
  return apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function fetchOrders(cookieHeader?: string): Promise<{ orders: OrderSummary[] }> {
  return apiFetch("/api/orders", cookieHeader ? { headers: { cookie: cookieHeader } } : {})
}

export function fetchOrderById(id: string, cookieHeader?: string): Promise<OrderDetail> {
  return apiFetch(`/api/orders/${id}`, cookieHeader ? { headers: { cookie: cookieHeader } } : {})
}

// --- Account ---

export function fetchProfile(cookieHeader?: string): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/api/account/profile", cookieHeader ? { headers: { cookie: cookieHeader } } : {})
}

export function updateProfile(data: Partial<ProfileResponse>): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/api/account/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export function fetchAddresses(cookieHeader?: string): Promise<{ addresses: AddressItem[] }> {
  return apiFetch<{ addresses: AddressItem[] }>("/api/account/addresses", cookieHeader ? { headers: { cookie: cookieHeader } } : {})
}

export function createAddress(data: Omit<AddressItem, "id">): Promise<AddressItem> {
  return apiFetch<AddressItem>("/api/account/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateAddress(id: string, data: Partial<AddressItem>): Promise<AddressItem> {
  return apiFetch<AddressItem>(`/api/account/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export function deleteAddress(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/account/addresses/${id}`, { method: "DELETE" })
}

// --- Auth ---

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function register(data: {
  email: string
  password: string
  displayName: string
  tenantName?: string
  tenantSlug?: string
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function logout(): Promise<void> {
  return apiFetch("/api/auth/logout", { method: "POST" })
}

// --- Dashboard (merchant) ---

export function fetchDashboardShop(): Promise<Record<string, unknown>> {
  return apiFetch("/api/dashboard/shop")
}

export function updateDashboardShop(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return apiFetch("/api/dashboard/shop", { method: "PUT", body: JSON.stringify(data) })
}

export function fetchDashboardProducts(): Promise<{ products: Record<string, unknown>[] }> {
  return apiFetch("/api/dashboard/products")
}

export function createDashboardProduct(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return apiFetch("/api/dashboard/products", { method: "POST", body: JSON.stringify(data) })
}

export function updateDashboardProduct(id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return apiFetch(`/api/dashboard/products/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteDashboardProduct(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/dashboard/products/${id}`, { method: "DELETE" })
}

export function fetchDashboardOrders(params: Record<string, string> = {}): Promise<{
  orders: DashboardOrderItem[]
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/api/dashboard/orders${qs ? `?${qs}` : ""}`)
}

export function updateDashboardOrderStatus(id: string, status: string): Promise<Record<string, unknown>> {
  return apiFetch(`/api/dashboard/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export function fetchDashboardAnalytics(period = "month"): Promise<DashboardAnalytics> {
  return apiFetch(`/api/dashboard/analytics?period=${period}`)
}

export function fetchDashboardSubscription(): Promise<DashboardSubscription> {
  return apiFetch("/api/dashboard/subscription")
}

// --- Console (PSA) ---

export function fetchConsoleAnalytics(): Promise<ConsoleAnalytics> {
  return apiFetch("/api/console/analytics")
}

export function fetchConsoleTenants(params: Record<string, string> = {}): Promise<{
  tenants: ConsoleTenant[]
  pagination: { page: number; limit: number }
}> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/api/console/tenants${qs ? `?${qs}` : ""}`)
}

export function createConsoleTenant(data: {
  tenantName: string
  tenantSlug: string
  ownerName: string
  ownerEmail: string
  ownerPassword?: string
  subscriptionTier?: string
}): Promise<Record<string, unknown>> {
  return apiFetch("/api/console/tenants", { method: "POST", body: JSON.stringify(data) })
}

export function updateConsoleTenant(id: string, data: { status?: string; subscriptionTier?: string }): Promise<Record<string, unknown>> {
  return apiFetch(`/api/console/tenants/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function fetchConsoleCustomers(params: Record<string, string> = {}): Promise<{
  customers: Record<string, unknown>[]
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/api/console/customers${qs ? `?${qs}` : ""}`)
}

export function fetchConsoleAuditLogs(params: Record<string, string> = {}): Promise<{
  logs: Record<string, unknown>[]
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/api/console/audit-logs${qs ? `?${qs}` : ""}`)
}

export function fetchConsoleTenant(id: string): Promise<ConsoleTenant> {
  return apiFetch(`/api/console/tenants/${id}`)
}

// --- Dashboard: Staff ---

export interface DashboardStaff {
  id: string
  name: string
  email: string
  phone?: string | null
  isActive: boolean
  lastLoginAt?: string | null
  createdAt: string
}

export function fetchDashboardStaff(): Promise<{ staff: DashboardStaff[] }> {
  return apiFetch("/api/dashboard/staff")
}

export function inviteDashboardStaff(data: { name: string; email: string }): Promise<{ id: string; name: string; email: string; tempPassword: string }> {
  return apiFetch("/api/dashboard/staff", { method: "POST", body: JSON.stringify(data) })
}

export function deleteDashboardStaff(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/dashboard/staff/${id}`, { method: "DELETE" })
}

// --- Dashboard: Coupons ---

export interface DashboardCoupon {
  id: string
  shopId: string
  tenantId: string
  code: string
  description?: string | null
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderAmount?: number | null
  maxUses?: number | null
  usedCount: number
  isActive: boolean
  expiresAt?: string | null
  createdAt: string
}

export function fetchDashboardCoupons(): Promise<{ coupons: DashboardCoupon[] }> {
  return apiFetch("/api/dashboard/coupons")
}

export function createDashboardCoupon(data: {
  code: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderAmount?: number
  maxUses?: number
  expiresAt?: string
}): Promise<DashboardCoupon> {
  return apiFetch("/api/dashboard/coupons", { method: "POST", body: JSON.stringify(data) })
}

export function updateDashboardCoupon(id: string, data: { isActive?: boolean; expiresAt?: string | null }): Promise<DashboardCoupon> {
  return apiFetch(`/api/dashboard/coupons/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteDashboardCoupon(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/dashboard/coupons/${id}`, { method: "DELETE" })
}

// --- Dashboard: Store Categories ---

export interface DashboardStoreCategory {
  id: string
  shopId: string
  name: string
  isVisible: boolean
  sortOrder: number
  productCount: number
  createdAt: string
}

export function fetchDashboardStoreCategories(): Promise<{ categories: DashboardStoreCategory[] }> {
  return apiFetch("/api/dashboard/store-categories")
}

export function createDashboardStoreCategory(data: { name: string }): Promise<DashboardStoreCategory> {
  return apiFetch("/api/dashboard/store-categories", { method: "POST", body: JSON.stringify(data) })
}

export function updateDashboardStoreCategory(id: string, data: { name?: string; isVisible?: boolean; sortOrder?: number }): Promise<DashboardStoreCategory> {
  return apiFetch(`/api/dashboard/store-categories/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteDashboardStoreCategory(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/dashboard/store-categories/${id}`, { method: "DELETE" })
}

// --- Upload ---

export async function uploadFile(file: File, type = "products"): Promise<{ url: string; path: string }> {
  const base = getBaseUrl()
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${base}/api/upload?type=${type}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json()
}
