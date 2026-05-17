import type { Location } from "@/lib/types"

export const districts: Location[] = [
  { id: "ktm", name: "Kathmandu", nameNepali: "काठमाडौं", type: "district" },
  { id: "ltp", name: "Lalitpur", nameNepali: "ललितपुर", type: "district" },
  { id: "bkt", name: "Bhaktapur", nameNepali: "भक्तपुर", type: "district" },
]

export const municipalities: Location[] = [
  // Kathmandu
  { id: "ktm-metro", name: "Kathmandu Metropolitan City", nameNepali: "काठमाडौं महानगरपालिका", type: "municipality", parentId: "ktm" },
  { id: "budhanilkantha", name: "Budhanilkantha Municipality", nameNepali: "बुढानीलकण्ठ नगरपालिका", type: "municipality", parentId: "ktm" },
  { id: "tokha", name: "Tokha Municipality", nameNepali: "टोखा नगरपालिका", type: "municipality", parentId: "ktm" },
  { id: "chandragiri", name: "Chandragiri Municipality", nameNepali: "चन्द्रागिरी नगरपालिका", type: "municipality", parentId: "ktm" },
  { id: "kirtipur", name: "Kirtipur Municipality", nameNepali: "कीर्तिपुर नगरपालिका", type: "municipality", parentId: "ktm" },
  
  // Lalitpur
  { id: "ltp-metro", name: "Lalitpur Metropolitan City", nameNepali: "ललितपुर महानगरपालिका", type: "municipality", parentId: "ltp" },
  { id: "godawari", name: "Godawari Municipality", nameNepali: "गोदावरी नगरपालिका", type: "municipality", parentId: "ltp" },
  { id: "mahalaxmi", name: "Mahalaxmi Municipality", nameNepali: "महालक्ष्मी नगरपालिका", type: "municipality", parentId: "ltp" },
  
  // Bhaktapur
  { id: "bkt-muni", name: "Bhaktapur Municipality", nameNepali: "भक्तपुर नगरपालिका", type: "municipality", parentId: "bkt" },
  { id: "madhyapur-thimi", name: "Madhyapur Thimi Municipality", nameNepali: "मध्यपुर थिमी नगरपालिका", type: "municipality", parentId: "bkt" },
  { id: "suryabinayak", name: "Suryabinayak Municipality", nameNepali: "सूर्यविनायक नगरपालिका", type: "municipality", parentId: "bkt" },
]

export const popularAreas = [
  { name: "Thamel", ward: "26", municipality: "ktm-metro", coordinates: { lat: 27.7154, lng: 85.3123 } },
  { name: "New Baneshwor", ward: "10", municipality: "ktm-metro", coordinates: { lat: 27.6915, lng: 85.3420 } },
  { name: "Baluwatar", ward: "4", municipality: "ktm-metro", coordinates: { lat: 27.7283, lng: 85.3285 } },
  { name: "Lazimpat", ward: "2", municipality: "ktm-metro", coordinates: { lat: 27.7210, lng: 85.3230 } },
  { name: "Patan Durbar Square", ward: "12", municipality: "ltp-metro", coordinates: { lat: 27.6727, lng: 85.3250 } },
  { name: "Jawalakhel", ward: "7", municipality: "ltp-metro", coordinates: { lat: 27.6710, lng: 85.3150 } },
  { name: "Pulchowk", ward: "6", municipality: "ltp-metro", coordinates: { lat: 27.6785, lng: 85.3180 } },
  { name: "Bhaktapur Durbar Square", ward: "8", municipality: "bkt-muni", coordinates: { lat: 27.6722, lng: 85.4283 } },
  { name: "Bouddha", ward: "6", municipality: "ktm-metro", coordinates: { lat: 27.7215, lng: 85.3620 } },
  { name: "Swayambhunath", ward: "15", municipality: "ktm-metro", coordinates: { lat: 27.7149, lng: 85.2903 } },
]

export function getMunicipalitiesByDistrict(districtId: string): Location[] {
  return municipalities.filter((m) => m.parentId === districtId)
}

export function getDistrictById(id: string): Location | undefined {
  return districts.find((d) => d.id === id)
}

export function getMunicipalityById(id: string): Location | undefined {
  return municipalities.find((m) => m.id === id)
}

// Default location - center of Kathmandu
export const defaultLocation = {
  lat: 27.7172,
  lng: 85.3240,
}
