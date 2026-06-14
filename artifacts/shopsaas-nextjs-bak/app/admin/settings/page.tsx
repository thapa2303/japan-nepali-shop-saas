import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlatformSettings } from "@/components/admin/platform-settings"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader
        title="Settings"
        description="Configure global platform settings and policies"
      />
      <PlatformSettings />
    </div>
  )
}
