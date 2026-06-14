import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlatformReports } from "@/components/admin/platform-reports"

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader title="Reports" description="Platform-wide revenue, category, and merchant performance" />
      <PlatformReports />
    </div>
  )
}
