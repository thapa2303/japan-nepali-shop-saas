import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/products/product-detail"
import { fetchProductById, fetchShopBySlug, fetchShopProducts } from "@/lib/api-client"

interface ProductPageProps {
  params: Promise<{
    slug: string
    id: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug, id } = await params
  try {
    const [product, shop] = await Promise.all([
      fetchProductById(id),
      fetchShopBySlug(slug),
    ])
    if (!product || !shop) return { title: "Product Not Found" }
    return {
      title: `${product.name} - ${shop.name} | ShopSaaS`,
      description: product.description,
    }
  } catch {
    return { title: "Product Not Found" }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, id } = await params

  try {
    const [product, shop, { products: shopProducts }] = await Promise.all([
      fetchProductById(id),
      fetchShopBySlug(slug),
      fetchShopProducts(slug),
    ])

    if (!product || !shop) notFound()

    const relatedProducts = shopProducts.filter((p) => p.id !== id).slice(0, 4)

    return (
      <ProductDetailClient
        product={product}
        shop={shop}
        relatedProducts={relatedProducts}
      />
    )
  } catch {
    notFound()
  }
}
