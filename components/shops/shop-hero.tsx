import Image from "next/image"
import { Clock, MapPin, Phone, Star, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Shop } from "@/lib/types"

interface ShopHeroProps {
  shop: Shop
}

export function ShopHero({ shop }: ShopHeroProps) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as keyof typeof shop.openingHours
  const todayHours = shop.openingHours[today]

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-muted">
        <Image
          src={shop.coverImage}
          alt={shop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Shop Info Overlay */}
      <div className="container px-4">
        <div className="relative -mt-20 sm:-mt-24">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            {/* Logo */}
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl border-4 border-background bg-background shadow-lg">
              <Image
                src={shop.logo}
                alt={`${shop.name} logo`}
                fill
                className="object-cover"
              />
            </div>

            {/* Shop Details */}
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {shop.isOpen ? (
                  <Badge className="bg-green-600 hover:bg-green-600">Open Now</Badge>
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
                {shop.featured && (
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent">Featured</Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white sm:text-foreground">
                {shop.name}
              </h1>
              {shop.nameNepali && (
                <p className="text-white/80 sm:text-muted-foreground mt-0.5">
                  {shop.nameNepali}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white sm:text-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{shop.rating}</span>
                  <span className="text-white/70 sm:text-muted-foreground">
                    ({shop.reviewCount} reviews)
                  </span>
                </div>
                <span className="capitalize text-white/70 sm:text-muted-foreground">
                  {shop.category.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden sm:flex gap-2 pb-2">
              {shop.contact.whatsapp && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://wa.me/${shop.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${shop.contact.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Location */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Location</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {shop.location.address}
              </p>
              <p className="text-xs text-muted-foreground">
                {shop.location.municipality}, {shop.location.district}
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Today&apos;s Hours</p>
              {todayHours.isClosed ? (
                <p className="text-sm text-muted-foreground mt-0.5">Closed today</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {todayHours.open} - {todayHours.close}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          {shop.deliveryTime && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <div>
                <p className="font-medium text-sm">Delivery</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {shop.deliveryTime}
                </p>
                {shop.deliveryFee !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Rs. {shop.deliveryFee} delivery fee
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Min Order */}
          {shop.minOrder && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="font-medium text-sm">Minimum Order</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Rs. {shop.minOrder.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        {shop.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {shop.features.map((feature) => (
              <Badge key={feature} variant="outline" className="capitalize">
                {feature.replace("-", " ")}
              </Badge>
            ))}
          </div>
        )}

        {/* Mobile Action Buttons */}
        <div className="flex gap-2 mt-4 sm:hidden">
          {shop.contact.whatsapp && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={`https://wa.me/${shop.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={`tel:${shop.contact.phone}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </a>
          </Button>
        </div>

        {/* Description */}
        <div className="mt-6 p-4 rounded-lg bg-card border">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-muted-foreground">{shop.description}</p>
        </div>
      </div>
    </div>
  )
}
