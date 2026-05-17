import Link from "next/link"
import { CheckCircle2, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function OrderConfirmationPage() {
  // Generate a mock order ID
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`

  return (
    <div className="container px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="rounded-full bg-green-100 p-6 w-fit mx-auto mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold md:text-3xl">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your order. We&apos;ve received your order and will begin processing it shortly.
        </p>

        {/* Order Details Card */}
        <Card className="mt-8 text-left">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                Confirmed
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">Cash on Delivery</span>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <div className="mt-8 p-6 rounded-lg bg-secondary/50 text-left">
          <h2 className="font-semibold mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive an SMS confirmation shortly
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Order Preparation</p>
                <p className="text-sm text-muted-foreground">
                  The shop will prepare your items
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered to your address
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/shops">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Package className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-muted-foreground">
          Need help with your order?{" "}
          <Link href="#" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
