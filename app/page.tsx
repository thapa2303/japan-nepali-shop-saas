import { HeroSection } from "@/components/home/hero-section"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { FeaturedShops } from "@/components/home/featured-shops"
import { NearbyShops } from "@/components/home/nearby-shops"
import { HowItWorks } from "@/components/home/how-it-works"

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesGrid />
      <FeaturedShops />
      <HowItWorks />
      <NearbyShops />
    </div>
  )
}
