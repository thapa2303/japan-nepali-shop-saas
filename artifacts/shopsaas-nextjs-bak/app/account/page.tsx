import { CustomerProfileView } from "@/components/account/customer-profile-view"
import { currentCustomer } from "@/lib/mock-data/customer"

export default function AccountProfilePage() {
  return <CustomerProfileView customer={currentCustomer} />
}
