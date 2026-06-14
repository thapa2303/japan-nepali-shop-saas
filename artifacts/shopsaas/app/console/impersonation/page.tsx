import type { Metadata } from "next"
import { ImpersonationManager } from "@/components/console/impersonation-manager"

export const metadata: Metadata = {
  title: "Impersonation | Console",
}

export default function ImpersonationPage() {
  return <ImpersonationManager />
}
