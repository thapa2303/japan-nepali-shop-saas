import type { Metadata } from "next"
import { CreateTenantForm } from "@/components/console/create-tenant-form"

export const metadata: Metadata = {
  title: "Create Tenant | Console",
}

export default function CreateTenantPage() {
  return <CreateTenantForm />
}
