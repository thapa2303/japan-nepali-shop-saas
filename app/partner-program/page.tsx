import type { Metadata } from "next"
import Link from "next/link"
import { Handshake, Megaphone, Truck, Users } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Partner Program | ShopSaaS",
  description: "Partner with ShopSaaS as a delivery, marketing, or community partner.",
}

const partners = [
  {
    icon: Truck,
    title: "Delivery partners",
    body: "Help fulfill last-mile delivery for Nepali shops in your area and earn per completed order.",
  },
  {
    icon: Megaphone,
    title: "Marketing partners",
    body: "Promote the marketplace to the Nepali community in Japan and earn referral rewards.",
  },
  {
    icon: Users,
    title: "Community partners",
    body: "Student groups, associations, and organizations can collaborate on events and outreach.",
  },
]

export default function PartnerProgramPage() {
  return (
    <PageShell
      title="Partner Program"
      description="Grow with us. We work with delivery, marketing, and community partners across Japan."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {partners.map((p) => (
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

      <Card className="mt-8 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Handshake className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Interested in partnering?</p>
              <p className="text-sm text-muted-foreground">Reach out and our team will get back to you.</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/contact">Contact our team</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  )
}
