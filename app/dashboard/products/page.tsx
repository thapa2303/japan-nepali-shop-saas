import { ProductManager } from "@/components/dashboard/product-manager"
import { getProductsByShopId } from "@/lib/mock-data/products"
import {
  CURRENT_MERCHANT_SHOP_ID,
  merchantSubscription,
  getPlanByTier,
} from "@/lib/mock-data/merchant"

export default function DashboardProductsPage() {
  const products = getProductsByShopId(CURRENT_MERCHANT_SHOP_ID)
  const plan = getPlanByTier(merchantSubscription.tier)

  return (
    <ProductManager
      initialProducts={products}
      shopId={CURRENT_MERCHANT_SHOP_ID}
      productLimit={plan?.productLimit ?? 30}
    />
  )
}
