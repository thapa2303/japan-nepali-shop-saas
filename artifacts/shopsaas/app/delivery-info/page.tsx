import type { Metadata } from "next"
import { Truck, Clock, MapPin, PackageCheck } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Delivery Info | ShopSaaS",
  description: "Delivery areas, timing, and fees for orders placed on ShopSaaS.",
}

const points = [
  {
    icon: MapPin,
    title: "Delivery areas",
    body: "Most shops deliver within their prefecture. Coverage is widest around Tokyo, Saitama, Osaka, and other areas with established Nepali communities.",
  },
  {
    icon: Clock,
    title: "Delivery times",
    body: "Typical delivery windows range from same-day to 2 days depending on the shop. Each shop shows its estimated delivery time on its storefront.",
  },
  {
    icon: Truck,
    title: "Delivery fees",
    body: "Fees are set by each shop and shown at checkout. Many shops offer free delivery above a minimum order value.",
  },
  {
    icon: PackageCheck,
    title: "Pickup option",
    body: "Where available, you can choose store pickup at checkout to collect your order directly and skip delivery fees.",
  },
]

export default function DeliveryInfoPage() {
  return (
    <PageShell
      title="Delivery Information"
      description="How delivery works when you order from Nepali shops across Japan."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {points.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed text-muted-foreground">{p.body}</CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
