"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon, LatLngBounds } from "leaflet"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Shop } from "@/lib/types"
import { defaultLocation } from "@/lib/mock-data/locations"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface ShopMapProps {
  shops: Shop[]
  selectedShopId?: string
  onShopSelect?: (shopId: string) => void
}

function MapBounds({ shops }: { shops: Shop[] }) {
  const map = useMap()

  useEffect(() => {
    if (shops.length > 0) {
      const bounds = new LatLngBounds(
        shops.map((shop) => [shop.location.coordinates.lat, shop.location.coordinates.lng])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [shops, map])

  return null
}

export function ShopMap({ shops, selectedShopId, onShopSelect }: ShopMapProps) {
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer
      center={[defaultLocation.lat, defaultLocation.lng]}
      zoom={13}
      className="h-full w-full rounded-lg z-0"
      ref={(ref) => { mapRef.current = ref }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds shops={shops} />
      
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.location.coordinates.lat, shop.location.coordinates.lng]}
          icon={customIcon}
          eventHandlers={{
            click: () => onShopSelect?.(shop.id),
          }}
        >
          <Popup className="shop-popup">
            <div className="w-64 p-0">
              <div className="relative h-24 w-full">
                <Image
                  src={shop.coverImage}
                  alt={shop.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                {shop.isOpen ? (
                  <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-600 text-xs">
                    Open
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                    Closed
                  </Badge>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">{shop.name}</h3>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {shop.category.replace("-", " ")}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{shop.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({shop.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                  {shop.location.address}
                </p>
                <Button asChild size="sm" className="w-full mt-3 h-8 text-xs">
                  <Link href={`/shops/${shop.slug}`}>View Shop</Link>
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
