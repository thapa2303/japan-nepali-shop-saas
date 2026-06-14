"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/contexts/cart-context"
import type { Product } from "@/lib/types"
import { getShopById } from "@/lib/mock-data/shops"

interface ProductCardProps {
  product: Product
  shopSlug: string
}

export function ProductCard({ product, shopSlug }: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart()
  const quantity = getItemQuantity(product.id)
  const shop = getShopById(product.shopId)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(product.id, quantity + 1)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(product.id, quantity - 1)
  }

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`

  return (
    <Link href={`/shops/${shopSlug}/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.compareAtPrice && (
            <Badge className="absolute top-2 left-2 bg-destructive hover:bg-destructive">
              Sale
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground hover:bg-accent">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
          {product.nameNepali && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {product.nameNepali}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {product.unit && (
              <span className="text-xs text-muted-foreground">/ {product.unit}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="mt-3">
            {product.inStock ? (
              quantity > 0 ? (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDecrement}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleIncrement}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full h-8 text-sm"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              )
            ) : (
              <Button disabled className="w-full h-8 text-sm">
                Out of Stock
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
