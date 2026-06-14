import type { Metadata } from "next"
import { AuditLogViewer } from "@/components/console/audit-log-viewer"

export const metadata: Metadata = {
  title: "Audit Logs | Console",
}

export default function AuditPage() {
  return <AuditLogViewer />
}
