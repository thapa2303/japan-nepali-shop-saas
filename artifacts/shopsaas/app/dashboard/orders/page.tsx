import { OrderManager } from "@/components/dashboard/order-manager"
import { CURRENT_MERCHANT_SHOP_ID, getOrdersByShopId } from "@/lib/mock-data/merchant"

export default function DashboardOrdersPage() {
  const orders = getOrdersByShopId(CURRENT_MERCHANT_SHOP_ID)
  return <OrderManager initialOrders={orders} />
}
