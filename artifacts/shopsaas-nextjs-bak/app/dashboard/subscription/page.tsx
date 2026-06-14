import { BillingView } from "@/components/dashboard/billing-view"
import { getProductsByShopId } from "@/lib/mock-data/products"
import {
  CURRENT_MERCHANT_SHOP_ID,
  merchantSubscription,
  subscriptionPlans,
} from "@/lib/mock-data/merchant"

export default function DashboardSubscriptionPage() {
  const products = getProductsByShopId(CURRENT_MERCHANT_SHOP_ID)
  return (
    <BillingView
      subscription={merchantSubscription}
      plans={subscriptionPlans}
      productCount={products.length}
    />
  )
}
