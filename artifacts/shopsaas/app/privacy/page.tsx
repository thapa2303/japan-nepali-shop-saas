import type { Metadata } from "next"
import { PageShell, Prose, LegalSection } from "@/components/marketing/page-shell"

export const metadata: Metadata = {
  title: "Privacy Policy | ShopSaaS",
  description: "How ShopSaaS collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy" description="Last updated June 2026. This policy explains how we handle your data.">
      <Prose>
        <p>
          ShopSaaS (&quot;we&quot;, &quot;us&quot;) is committed to protecting the privacy of customers and merchants
          using our marketplace connecting Nepali shops across Japan. This is a sample policy for a demonstration
          product.
        </p>
        <LegalSection heading="Information we collect">
          <p>
            We collect account details you provide (name, email, phone), shop information for merchants, order and
            delivery addresses, and usage data needed to operate the marketplace.
          </p>
        </LegalSection>
        <LegalSection heading="How we use your information">
          <p>
            Your information is used to process orders, connect you with shops, provide customer support, prevent fraud,
            and improve the platform experience.
          </p>
        </LegalSection>
        <LegalSection heading="Sharing">
          <p>
            Order details are shared with the relevant merchant to fulfill your purchase. We do not sell your personal
            information to third parties.
          </p>
        </LegalSection>
        <LegalSection heading="Your rights">
          <p>
            You may request access to, correction of, or deletion of your personal data at any time by contacting our
            support team.
          </p>
        </LegalSection>
      </Prose>
    </PageShell>
  )
}
