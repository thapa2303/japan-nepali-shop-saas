import type { Metadata } from "next"
import { FeatureToggleManager } from "@/components/console/feature-toggle-manager"

export const metadata: Metadata = {
  title: "Feature Toggles | Console",
}

export default function FeaturesPage() {
  return <FeatureToggleManager />
}
