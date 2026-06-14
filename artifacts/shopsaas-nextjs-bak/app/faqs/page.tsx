import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/marketing/page-shell"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "FAQs | ShopSaaS",
  description: "Frequently asked questions about ordering and selling on ShopSaaS.",
}

const faqs = [
  {
    q: "What is ShopSaaS?",
    a: "ShopSaaS is a marketplace that connects Nepali-owned shops across Japan with customers looking for authentic groceries, food, fashion, and handicrafts.",
  },
  {
    q: "How do I place an order?",
    a: "Browse shops, add items to your cart, and check out with your delivery details. Your order goes directly to the shop for fulfillment.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "Delivery depends on each shop. Most deliver within their prefecture, with the widest coverage around major cities. Check a shop's storefront for its delivery area and time.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Shops may accept online payment and cash on delivery depending on their settings. Available options are shown at checkout.",
  },
  {
    q: "Can I cancel or get a refund?",
    a: "Orders can usually be cancelled before the shop starts preparing them. See our Refund Policy for full details on damaged or incorrect items.",
  },
  {
    q: "How do I open my own shop?",
    a: "Create a merchant account, add your shop name and location, then set up your products and delivery settings from the dashboard.",
  },
]

export default function FaqsPage() {
  return (
    <PageShell title="Frequently Asked Questions" description="Quick answers to the questions we hear most often.">
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 flex flex-col items-start gap-3 rounded-lg border bg-secondary/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Didn&apos;t find your answer?</p>
            <p className="text-sm text-muted-foreground">Contact our support team for more help.</p>
          </div>
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
