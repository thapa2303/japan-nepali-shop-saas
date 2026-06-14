import type { Metadata } from "next"

import { RbacManager } from "@/components/console/rbac-manager"

export const metadata: Metadata = {
  title: "RBAC | Console",
}

export default function RbacPage() {
  return <RbacManager />
}
