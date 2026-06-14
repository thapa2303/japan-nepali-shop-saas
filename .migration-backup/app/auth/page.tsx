import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag, MapPin, Store, ShieldCheck } from "lucide-react"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign In / Register | ShopSaaS",
  description: "Sign in or create an account to discover and shop from local Nepali businesses in Japan.",
}

const highlights = [
  { icon: Store, title: "Discover local shops", desc: "Browse Nepali-owned stores near you." },
  { icon: MapPin, title: "Find them on the map", desc: "Physical storefronts and online stores." },
  { icon: ShieldCheck, title: "Shop with trust", desc: "Verified, Google Maps registered businesses." },
]

export default function AuthPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">ShopSaaS</span>
        </Link>

        <div className="flex flex-col gap-6">
          <h1 className="text-balance text-3xl font-bold leading-tight">
            Your local Nepali marketplace, all in one place.
          </h1>
          <p className="max-w-md text-pretty text-primary-foreground/80 leading-relaxed">
            Join thousands discovering authentic shops, groceries, and restaurants run by the Nepali community.
          </p>

          <div className="flex flex-col gap-4 pt-2">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <h.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{h.title}</p>
                  <p className="text-sm text-primary-foreground/75">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/70">Discover. Connect. Shop local.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">ShopSaaS</span>
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p className="text-pretty text-muted-foreground">
              Sign in to your account or create a new one to get started.
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  )
}
