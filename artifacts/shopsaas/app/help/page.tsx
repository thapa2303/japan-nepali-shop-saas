import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag, Truck, CreditCard, Store, HelpCircle, MessageCircle } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Help Center | ShopSaaS",
  description: "Find answers about ordering, delivery, payments, and selling on ShopSaaS.",
}

const topics = [
  { icon: ShoppingBag, title: "Ordering", body: "How to browse shops and place an order.", href: "/faqs" },
  { icon: Truck, title: "Delivery", body: "Areas, timing, and delivery fees.", href: "/delivery-info" },
  { icon: CreditCard, title: "Payments & refunds", body: "Payment methods and refund policy.", href: "/refund-policy" },
  { icon: Store, title: "Selling", body: "Open and manage your own shop.", href: "/sell" },
  { icon: HelpCircle, title: "FAQs", body: "Answers to the most common questions.", href: "/faqs" },
  { icon: MessageCircle, title: "Contact us", body: "Reach our support team directly.", href: "/contact" },
]

export default function HelpPage() {
  return (
    <PageShell title="Help Center" description="Browse common topics or get in touch with our support team.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <Link key={t.title} href={t.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-lg border bg-secondary/30 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Still need help?</p>
          <p className="text-sm text-muted-foreground">Our team is happy to assist with any question.</p>
        </div>
        <Button asChild>
          <Link href="/contact">Contact support</Link>
        </Button>
      </div>
    </PageShell>
  )
}
