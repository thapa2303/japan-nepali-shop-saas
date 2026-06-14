import type { Metadata } from "next"
import { TenantList } from "@/components/console/tenant-list"

export const metadata: Metadata = {
  title: "Tenants | Console",
}

export default function TenantsPage() {
  return <TenantList />
}
