"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Star, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/contexts/cart-context"
import { ProductCard } from "@/components/products/product-card"
import type { Product, Shop, ProductVariant } from "@/lib/types"

interface ProductDetailClientProps {
  product: Product
  shop: Shop
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, shop, relatedProducts }: ProductDetailClientProps) {
  const { addItem, getItemQuantity, openCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  )
  const [quantity, setQuantity] = useState(1)

  const cartQuantity = getItemQuantity(product.id, selectedVariant?.id)
  const currentPrice = selectedVariant?.price || product.price
  const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant, { slug: shop.slug, deliveryFee: shop.deliveryFee })
    openCart()
  }

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`

  return (
    <div className="container px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/shops" className="hover:text-primary">Shops</Link>
        <span>/</span>
        <Link href={`/shops/${shop.slug}`} className="hover:text-primary">{shop.name}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/shops/${shop.slug}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {shop.name}
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.images?.[0] ?? "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.compareAtPrice && (
              <Badge className="absolute top-4 left-4 bg-destructive hover:bg-destructive">
                Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </Badge>
            )}
            {!isInStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg py-2 px-4">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery (if multiple images) */}
          {(product.images?.length ?? 0) > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(product.images ?? []).map((image, index) => (
                <button
                  key={index}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-primary"
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.featured && (
                <Badge className="bg-accent text-accent-foreground">Featured</Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {product.category.replace("-", " ")}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>
            {product.nameNepali && (
              <p className="text-muted-foreground mt-1">{product.nameNepali}</p>
            )}

            {/* Shop Link */}
            <Link
              href={`/shops/${shop.slug}`}
              className="inline-flex items-center gap-2 mt-3 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Store className="h-4 w-4" />
              {shop.name}
            </Link>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {product.unit && (
              <span className="text-muted-foreground">/ {product.unit}</span>
            )}
          </div>

          <Separator />

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <Label className="text-base font-medium">Select Size/Option</Label>
              <RadioGroup
                value={selectedVariant?.id}
                onValueChange={(value) =>
                  setSelectedVariant(product.variants?.find((v) => v.id === value))
                }
                className="mt-3 flex flex-wrap gap-2"
              >
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <RadioGroupItem
                      value={variant.id}
                      id={variant.id}
                      className="peer sr-only"
                      disabled={!variant.inStock}
                    />
                    <Label
                      htmlFor={variant.id}
                      className={`flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer transition-all
                        peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10
                        ${!variant.inStock ? "opacity-50 cursor-not-allowed line-through" : "hover:border-primary/50"}
                      `}
                    >
                      {variant.name}
                      {variant.price !== product.price && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          +¥{(variant.price - product.price).toLocaleString()}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Stock Info */}
          {isInStock && product.stockCount && (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">In Stock</span>
              <span className="text-muted-foreground">
                ({product.stockCount} available)
              </span>
            </div>
          )}

          <Separator />

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="text-base font-medium">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stockCount ? quantity >= product.stockCount : false}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - {formatPrice(currentPrice * quantity)}
              </Button>
            </div>

            {cartQuantity > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                You already have {cartQuantity} of this item in your cart
              </p>
            )}
          </div>

          {/* Shop Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={shop.logo}
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{shop.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{shop.rating}</span>
                    <span>({shop.reviewCount} reviews)</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/shops/${shop.slug}`}>View Shop</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">More from {shop.name}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                shopSlug={shop.slug}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
