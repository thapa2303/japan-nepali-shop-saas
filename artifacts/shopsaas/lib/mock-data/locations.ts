import type { Location } from "@/lib/types"

// Prefectures with significant Nepali communities in Japan
export const prefectures: Location[] = [
  { id: "tokyo", name: "Tokyo", nameNepali: "टोकियो", type: "prefecture" },
  { id: "saitama", name: "Saitama", nameNepali: "साइतामा", type: "prefecture" },
  { id: "kanagawa", name: "Kanagawa", nameNepali: "कानागावा", type: "prefecture" },
  { id: "osaka", name: "Osaka", nameNepali: "ओसाका", type: "prefecture" },
  { id: "aichi", name: "Aichi", nameNepali: "आइ‍ची", type: "prefecture" },
  { id: "fukuoka", name: "Fukuoka", nameNepali: "फुकुओका", type: "prefecture" },
]

export const cities: Location[] = [
  // Tokyo
  { id: "shinjuku", name: "Shinjuku", nameNepali: "शिन्जुकु", type: "city", parentId: "tokyo" },
  { id: "shibuya", name: "Shibuya", nameNepali: "शिबुया", type: "city", parentId: "tokyo" },
  { id: "taito", name: "Taito", nameNepali: "ताइतो", type: "city", parentId: "tokyo" },
  { id: "arakawa", name: "Arakawa", nameNepali: "आरकावा", type: "city", parentId: "tokyo" },
  { id: "edogawa", name: "Edogawa", nameNepali: "एदोगावा", type: "city", parentId: "tokyo" },

  // Saitama
  { id: "kawaguchi", name: "Kawaguchi", nameNepali: "कावागुची", type: "city", parentId: "saitama" },
  { id: "warabi", name: "Warabi", nameNepali: "वारबी", type: "city", parentId: "saitama" },
  { id: "saitama-city", name: "Saitama City", nameNepali: "साइतामा सहर", type: "city", parentId: "saitama" },

  // Kanagawa
  { id: "yokohama", name: "Yokohama", nameNepali: "योकोहामा", type: "city", parentId: "kanagawa" },
  { id: "kawasaki", name: "Kawasaki", nameNepali: "कावासाकी", type: "city", parentId: "kanagawa" },

  // Osaka
  { id: "osaka-city", name: "Osaka City", nameNepali: "ओसाका सहर", type: "city", parentId: "osaka" },
  { id: "ikuno", name: "Ikuno", nameNepali: "इकुनो", type: "city", parentId: "osaka" },

  // Aichi
  { id: "nagoya", name: "Nagoya", nameNepali: "नागोया", type: "city", parentId: "aichi" },

  // Fukuoka
  { id: "fukuoka-city", name: "Fukuoka City", nameNepali: "फुकुओका सहर", type: "city", parentId: "fukuoka" },
]

export const popularAreas = [
  { name: "Shin-Okubo", city: "shinjuku", postalCode: "169-0073", coordinates: { lat: 35.7012, lng: 139.7003 } },
  { name: "Okubo", city: "shinjuku", postalCode: "169-0072", coordinates: { lat: 35.7008, lng: 139.6970 } },
  { name: "Takadanobaba", city: "shinjuku", postalCode: "169-0075", coordinates: { lat: 35.7126, lng: 139.7038 } },
  { name: "Ueno", city: "taito", postalCode: "110-0005", coordinates: { lat: 35.7141, lng: 139.7774 } },
  { name: "Nippori", city: "arakawa", postalCode: "116-0013", coordinates: { lat: 35.7281, lng: 139.7707 } },
  { name: "Nishi-Kawaguchi", city: "kawaguchi", postalCode: "332-0021", coordinates: { lat: 35.8074, lng: 139.6932 } },
  { name: "Warabi Station", city: "warabi", postalCode: "335-0004", coordinates: { lat: 35.8254, lng: 139.6800 } },
  { name: "Yokohama Station", city: "yokohama", postalCode: "220-0011", coordinates: { lat: 35.4659, lng: 139.6224 } },
  { name: "Tsuruhashi", city: "ikuno", postalCode: "544-0031", coordinates: { lat: 34.6648, lng: 135.5310 } },
  { name: "Sakae, Nagoya", city: "nagoya", postalCode: "460-0008", coordinates: { lat: 35.1681, lng: 136.9085 } },
]

export function getCitiesByPrefecture(prefectureId: string): Location[] {
  return cities.filter((c) => c.parentId === prefectureId)
}

export function getPrefectureById(id: string): Location | undefined {
  return prefectures.find((p) => p.id === id)
}

export function getCityById(id: string): Location | undefined {
  return cities.find((c) => c.id === id)
}

// Default location - Shin-Okubo, Tokyo (heart of the Nepali community in Japan)
export const defaultLocation = {
  lat: 35.7012,
  lng: 139.7003,
}
