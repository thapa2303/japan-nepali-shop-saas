import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/products/product-detail"
import { getProductById } from "@/lib/mock-data/products"
import { getShopBySlug } from "@/lib/mock-data/shops"

interface ProductPageProps {
  params: Promise<{
    slug: string
    id: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug, id } = await params
  const shop = getShopBySlug(slug)
  const product = getProductById(id)
  
  if (!shop || !product || product.shopId !== shop.id) {
    return { title: "Product Not Found" }
  }

  return {
    title: `${product.name} - ${shop.name} | ShopSaaS`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, id } = await params
  const shop = getShopBySlug(slug)
  const product = getProductById(id)

  if (!shop || !product || product.shopId !== shop.id) {
    notFound()
  }

  return <ProductDetailClient productId={id} shopSlug={slug} />
}
