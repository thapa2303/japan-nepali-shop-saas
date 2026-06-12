import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CategoryManager } from "@/components/admin/category-manager"

export default function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader
        title="Categories"
        description="Manage the shop categories available across the platform"
      />
      <CategoryManager />
    </div>
  )
}
