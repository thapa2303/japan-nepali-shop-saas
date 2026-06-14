import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminProductManager } from "@/components/admin/admin-product-manager"

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader title="Products" description="Browse and moderate all products listed across shops" />
      <AdminProductManager />
    </div>
  )
}
