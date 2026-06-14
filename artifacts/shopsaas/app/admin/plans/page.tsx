import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlanManager } from "@/components/admin/plan-manager"

export default function AdminPlansPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader
        title="Subscription Plans"
        description="Manage the SaaS tiers and pricing offered to merchants"
      />
      <PlanManager />
    </div>
  )
}
