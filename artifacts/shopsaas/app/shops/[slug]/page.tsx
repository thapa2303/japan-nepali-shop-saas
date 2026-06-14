import { notFound } from "next/navigation"
import { ShopHero } from "@/components/shops/shop-hero"
import { ProductGrid } from "@/components/products/product-grid"
import { fetchShopBySlug, fetchShopProducts } from "@/lib/api-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShopPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ShopPageProps) {
  const { slug } = await params
  try {
    const shop = await fetchShopBySlug(slug)
    return {
      title: `${shop.name} - ShopSaaS`,
      description: shop.description,
    }
  } catch {
    return { title: "Shop Not Found" }
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params

  let shop
  let products
  try {
    ;[shop, { products }] = await Promise.all([
      fetchShopBySlug(slug),
      fetchShopProducts(slug),
    ])
  } catch {
    notFound()
  }

  if (!shop) notFound()

  const productCategories = Array.from(
    new Set((products ?? []).map((p) => p.category))
  ).sort()

  return (
    <div>
      <ShopHero shop={shop} />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold md:text-2xl">Products</h2>
          <p className="text-sm text-muted-foreground">
            {(products ?? []).length} product{(products ?? []).length !== 1 ? "s" : ""}
          </p>
        </div>

        {productCategories.length > 1 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {productCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category.replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <ProductGrid products={products ?? []} shopSlug={shop.slug} />
            </TabsContent>

            {productCategories.map((category) => (
              <TabsContent key={category} value={category}>
                <ProductGrid
                  products={(products ?? []).filter((p) => p.category === category)}
                  shopSlug={shop.slug}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <ProductGrid products={products ?? []} shopSlug={shop.slug} />
        )}
      </div>
    </div>
  )
}
