import type { Metadata } from "next"
import { SystemSettings } from "@/components/console/system-settings"

export const metadata: Metadata = {
  title: "System Settings | Console",
}

export default function ConsoleSettingsPage() {
  return <SystemSettings />
}
