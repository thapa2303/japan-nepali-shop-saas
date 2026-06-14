import type { Metadata } from "next"
import { PageShell, Prose, LegalSection } from "@/components/marketing/page-shell"

export const metadata: Metadata = {
  title: "Terms of Service | ShopSaaS",
  description: "The terms and conditions governing your use of the ShopSaaS marketplace.",
}

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      description="Last updated June 2026. By using ShopSaaS you agree to these terms."
    >
      <Prose>
        <p>
          These terms govern your use of the ShopSaaS marketplace. This is sample content provided for a demonstration
          product.
        </p>
        <LegalSection heading="Using the platform">
          <p>
            You agree to use ShopSaaS lawfully and to provide accurate account information. You are responsible for
            activity that occurs under your account.
          </p>
        </LegalSection>
        <LegalSection heading="Merchant responsibilities">
          <p>
            Merchants are responsible for the accuracy of their listings, pricing, inventory, and for fulfilling orders
            in line with their stated delivery terms.
          </p>
        </LegalSection>
        <LegalSection heading="Orders and payments">
          <p>
            Orders placed through the platform form a contract between the customer and the merchant. ShopSaaS
            facilitates the transaction and may charge a commission to merchants.
          </p>
        </LegalSection>
        <LegalSection heading="Limitation of liability">
          <p>
            The platform is provided &quot;as is&quot;. To the maximum extent permitted by law, ShopSaaS is not liable
            for indirect or consequential damages arising from use of the service.
          </p>
        </LegalSection>
      </Prose>
    </PageShell>
  )
}
