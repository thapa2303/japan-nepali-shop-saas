import type { Metadata } from "next"
import Link from "next/link"
import { Store, TrendingUp, Globe, ShieldCheck, ArrowRight } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Sell on ShopSaaS | ShopSaaS",
  description: "Open your Nepali shop online and reach customers across Japan.",
}

const benefits = [
  {
    icon: Globe,
    title: "Reach more customers",
    body: "Get discovered by Nepali communities and food lovers searching across Japan.",
  },
  {
    icon: TrendingUp,
    title: "Grow your sales",
    body: "Accept online orders, manage products, and track performance from one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Simple and secure",
    body: "Straightforward tools for orders, delivery settings, coupons, and payouts.",
  },
]

export default function SellPage() {
  return (
    <PageShell
      title="Sell on ShopSaaS"
      description="Turn your Nepali shop into an online storefront and reach customers nationwide."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {benefits.map((b) => (
          <Card key={b.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{b.title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed text-muted-foreground">{b.body}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Store className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Ready to open your shop?</p>
              <p className="text-sm text-muted-foreground">
                Create a merchant account and set up your storefront in minutes.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
