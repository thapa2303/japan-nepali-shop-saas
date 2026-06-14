import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MerchantManager } from "@/components/admin/merchant-manager"

export default function AdminMerchantsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader
        title="Merchants"
        description="Review, approve, and manage all shops on the platform"
      />
      <MerchantManager />
    </div>
  )
}
