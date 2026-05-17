"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { districts, popularAreas } from "@/lib/mock-data/locations"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (selectedLocation) params.set("location", selectedLocation)
    router.push(`/shops?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Discover Local Shops in{" "}
            <span className="text-primary">Nepal</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
            Shop from trusted local businesses in Kathmandu Valley. Fresh groceries, 
            fashion, electronics, handicrafts, and more delivered to your doorstep.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 rounded-xl bg-card p-2 shadow-lg border">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search shops or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              
              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 w-full sm:w-[180px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {popularAreas.map((area) => (
                      <SelectItem key={area.name} value={area.name}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" size="lg" className="h-12 px-8">
                Search
              </Button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Groceries", "Fashion", "Electronics", "Handicrafts"].map((term) => (
              <Button
                key={term}
                variant="secondary"
                size="sm"
                className="h-7 text-xs"
                onClick={() => router.push(`/shops?category=${term.toLowerCase()}`)}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
