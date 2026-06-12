import { MapPin, Package, ShoppingBag, Store } from "lucide-react"

const steps = [
  {
    icon: MapPin,
    title: "Set Your Location",
    description: "Choose your area in Japan to find nearby Nepali shops",
  },
  {
    icon: Store,
    title: "Browse Nepali Shops",
    description: "Explore trusted Nepali-owned businesses near you",
  },
  {
    icon: ShoppingBag,
    title: "Add to Cart",
    description: "Select products from multiple shops in one order",
  },
  {
    icon: Package,
    title: "Get It Delivered",
    description: "Enjoy fast delivery right to your doorstep",
  },
]

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold md:text-3xl">How It Works</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Ordering from Nepali shops in Japan has never been easier
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector Line (hidden on mobile, visible on lg) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative">
                {/* Step Number */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground relative z-10">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold z-20">
                  {index + 1}
                </div>
              </div>

              <h3 className="mt-4 font-semibold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
