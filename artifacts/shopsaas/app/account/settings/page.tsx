import { CustomerSettingsView } from "@/components/account/customer-settings-view"
import { currentCustomer } from "@/lib/mock-data/customer"

export default function AccountSettingsPage() {
  return <CustomerSettingsView customer={currentCustomer} />
}
