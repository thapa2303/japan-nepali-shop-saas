import { cookies } from "next/headers"
import { CustomerProfileView } from "@/components/account/customer-profile-view"
import { fetchProfile, fetchAddresses } from "@/lib/api-client"
import type { CustomerProfile } from "@/lib/types"

export default async function AccountProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view your account</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access your profile and order history.
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign In
        </a>
      </div>
    )
  }

  let customer: CustomerProfile | null = null

  try {
    const cookieHeader = `token=${token}`
    const [profile, { addresses }] = await Promise.all([
      fetchProfile(cookieHeader),
      fetchAddresses(cookieHeader),
    ])

    customer = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone ?? "",
      avatar: profile.avatar,
      joinedAt: typeof profile.joinedAt === "string"
        ? profile.joinedAt.split("T")[0]
        : new Date(profile.joinedAt).toISOString().split("T")[0],
      preferredLanguage: (profile.preferredLanguage === "en" ? "en" : "ne") as "en" | "ne",
      addresses: addresses.map((a) => ({
        id: a.id,
        label: a.label,
        fullName: a.fullName,
        phone: a.phone,
        postalCode: a.postalCode,
        prefecture: a.prefecture,
        city: a.city,
        address: a.address,
        building: a.building,
        isDefault: a.isDefault,
      })),
      recentOrders: profile.recentOrders.map((o) => ({
        id: o.id,
        shopName: o.shopName,
        shopSlug: o.shopSlug,
        date: o.date,
        itemCount: 0,
        total: o.total,
        status: o.status as CustomerProfile["recentOrders"][0]["status"],
      })),
      favoriteShopSlugs: [],
      notifications: {
        orderUpdates: true,
        promotions: true,
        newShops: false,
        newsletter: true,
      },
    }
  } catch {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Unable to load profile</h1>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    )
  }

  return <CustomerProfileView customer={customer} />
}
