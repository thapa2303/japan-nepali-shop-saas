import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminOrderManager } from "@/components/admin/admin-order-manager"

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader title="Orders" description="Monitor every order flowing through the marketplace" />
      <AdminOrderManager />
    </div>
  )
}
