import type { Metadata } from "next"
import { PageShell, Prose, LegalSection } from "@/components/marketing/page-shell"

export const metadata: Metadata = {
  title: "Refund Policy | ShopSaaS",
  description: "How refunds, cancellations, and returns work on the ShopSaaS marketplace.",
}

export default function RefundPolicyPage() {
  return (
    <PageShell
      title="Refund Policy"
      description="How cancellations, refunds, and returns are handled across the marketplace."
    >
      <Prose>
        <p>
          Refund handling may vary by shop, since each merchant operates independently. The guidelines below describe
          the general marketplace approach.
        </p>
        <LegalSection heading="Order cancellations">
          <p>
            Orders can be cancelled for a full refund before the merchant accepts and begins preparing them. Once
            preparation starts, cancellation may not be possible.
          </p>
        </LegalSection>
        <LegalSection heading="Damaged or incorrect items">
          <p>
            If an item arrives damaged, expired, or incorrect, contact support within 48 hours with photos. Eligible
            orders will be refunded or replaced.
          </p>
        </LegalSection>
        <LegalSection heading="Perishable goods">
          <p>
            For food and fresh grocery items, refunds are assessed case by case to ensure fairness to both customers
            and merchants.
          </p>
        </LegalSection>
        <LegalSection heading="Refund timing">
          <p>Approved refunds are issued to your original payment method, typically within 5–10 business days.</p>
        </LegalSection>
      </Prose>
    </PageShell>
  )
}
