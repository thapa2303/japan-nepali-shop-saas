import type { Coupon, StaffUser, DeliverySettings, StoreCategory } from "@/lib/types"

// ---------- Merchant store categories (the shop's own product groupings) ----------

export const storeCategories: StoreCategory[] = [
  { id: "sc1", name: "Rice & Grains", productCount: 12, visible: true },
  { id: "sc2", name: "Spices & Masala", productCount: 18, visible: true },
  { id: "sc3", name: "Instant Noodles", productCount: 7, visible: true },
  { id: "sc4", name: "Lentils & Beans", productCount: 9, visible: true },
  { id: "sc5", name: "Frozen Foods", productCount: 6, visible: true },
  { id: "sc6", name: "Snacks & Sweets", productCount: 14, visible: false },
  { id: "sc7", name: "Beverages", productCount: 8, visible: true },
]

// ---------- Coupons ----------

export const merchantCoupons: Coupon[] = [
  {
    id: "cp1",
    code: "DASHAIN10",
    description: "Dashain festival 10% off store-wide",
    type: "percentage",
    value: 10,
    minSpend: 3000,
    usageLimit: 500,
    usedCount: 213,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: "active",
  },
  {
    id: "cp2",
    code: "FREESHIP",
    description: "Free delivery on orders over ¥5,000",
    type: "free-shipping",
    value: 0,
    minSpend: 5000,
    usageLimit: 1000,
    usedCount: 487,
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    status: "active",
  },
  {
    id: "cp3",
    code: "WELCOME500",
    description: "¥500 off your first order",
    type: "fixed",
    value: 500,
    minSpend: 2000,
    usageLimit: 300,
    usedCount: 142,
    startDate: "2026-04-01",
    endDate: "2026-12-31",
    status: "active",
  },
  {
    id: "cp4",
    code: "TIHAR15",
    description: "Tihar special 15% off festive items",
    type: "percentage",
    value: 15,
    minSpend: 4000,
    usageLimit: 400,
    usedCount: 0,
    startDate: "2026-10-25",
    endDate: "2026-11-05",
    status: "scheduled",
  },
  {
    id: "cp5",
    code: "SUMMER20",
    description: "Summer clearance 20% off",
    type: "percentage",
    value: 20,
    minSpend: 3000,
    usageLimit: 250,
    usedCount: 250,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    status: "expired",
  },
]

// ---------- Staff users ----------

export const merchantStaff: StaffUser[] = [
  {
    id: "st1",
    name: "Ramesh Thapa",
    email: "ramesh@himalayamart.jp",
    role: "owner",
    status: "active",
    lastActive: "2026-06-13T08:30:00",
  },
  {
    id: "st2",
    name: "Sunita Gurung",
    email: "sunita@himalayamart.jp",
    role: "manager",
    status: "active",
    lastActive: "2026-06-12T19:15:00",
  },
  {
    id: "st3",
    name: "Bir Bahadur",
    email: "bir@himalayamart.jp",
    role: "staff",
    status: "active",
    lastActive: "2026-06-13T07:45:00",
  },
  {
    id: "st4",
    name: "Pooja Sharma",
    email: "pooja@himalayamart.jp",
    role: "staff",
    status: "invited",
    lastActive: "—",
  },
  {
    id: "st5",
    name: "Hari Lama",
    email: "hari@himalayamart.jp",
    role: "staff",
    status: "disabled",
    lastActive: "2026-05-28T14:00:00",
  },
]

// ---------- Delivery settings ----------

export const deliverySettings: DeliverySettings = {
  deliveryEnabled: true,
  pickupEnabled: true,
  freeDeliveryThreshold: 5000,
  preparationTime: "30-45 min",
  zones: [
    { id: "dz1", name: "Shinjuku-ku", fee: 300, minOrder: 1500, estimatedTime: "30-45 min", enabled: true },
    { id: "dz2", name: "Shibuya-ku", fee: 400, minOrder: 2000, estimatedTime: "45-60 min", enabled: true },
    { id: "dz3", name: "Nakano-ku", fee: 400, minOrder: 2000, estimatedTime: "45-60 min", enabled: true },
    { id: "dz4", name: "Toshima-ku", fee: 500, minOrder: 2500, estimatedTime: "60-75 min", enabled: true },
    { id: "dz5", name: "Suginami-ku", fee: 500, minOrder: 2500, estimatedTime: "60-90 min", enabled: false },
  ],
}

export const couponTypeLabels: Record<string, string> = {
  percentage: "Percentage off",
  fixed: "Fixed amount",
  "free-shipping": "Free shipping",
}

export const couponStatusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-chart-2/20 text-foreground border-chart-2/50" },
  scheduled: { label: "Scheduled", className: "bg-primary/15 text-primary border-primary/40" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground border-border" },
  disabled: { label: "Disabled", className: "bg-destructive/10 text-destructive border-destructive/30" },
}

export const staffRoleConfig: Record<string, { label: string; className: string }> = {
  owner: { label: "Owner", className: "bg-chart-5/20 text-foreground border-chart-5/40" },
  manager: { label: "Manager", className: "bg-primary/15 text-primary border-primary/40" },
  staff: { label: "Staff", className: "bg-muted text-muted-foreground border-border" },
}

export const staffStatusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-chart-2/20 text-foreground border-chart-2/50" },
  invited: { label: "Invited", className: "bg-accent/30 text-accent-foreground border-accent" },
  disabled: { label: "Disabled", className: "bg-destructive/10 text-destructive border-destructive/30" },
}
