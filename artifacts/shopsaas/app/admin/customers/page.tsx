import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CustomerManager } from "@/components/admin/customer-manager"

export default function AdminCustomersPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader
        title="Customers"
        description="View and manage all customer accounts across the platform"
      />
      <CustomerManager />
    </div>
  )
}
