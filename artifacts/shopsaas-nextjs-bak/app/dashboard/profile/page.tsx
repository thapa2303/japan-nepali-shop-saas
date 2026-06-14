import { notFound } from "next/navigation"

import { ShopProfileForm } from "@/components/dashboard/shop-profile-form"
import { getShopById } from "@/lib/mock-data/shops"
import { CURRENT_MERCHANT_SHOP_ID } from "@/lib/mock-data/merchant"

export default function DashboardProfilePage() {
  const shop = getShopById(CURRENT_MERCHANT_SHOP_ID)
  if (!shop) notFound()
  return <ShopProfileForm shop={shop} />
}
