"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Building2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { featureFlags } from "@/lib/mock-data/console"
import { toast } from "@/hooks/use-toast"

export function CreateTenantForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [region, setRegion] = useState("")
  const [plan, setPlan] = useState("starter")
  const [ownerName, setOwnerName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState<Record<string, boolean>>(
    Object.fromEntries(featureFlags.map((f) => [f.key, f.defaultEnabled])),
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !region.trim() || !ownerEmail.trim()) {
      toast({
        title: "Missing details",
        description: "Tenant name, region, and owner email are required.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Tenant created", description: `${name} has been provisioned and is starting its trial.` })
      router.push("/console/tenants")
    }, 900)
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/console/tenants">
          <ChevronLeft className="h-4 w-4" />
          Back to tenants
        </Link>
      </Button>

      <DashboardHeader title="Create tenant" description="Provision a new marketplace instance on the platform." />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Tenant details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Marketplace name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Desi Bazaar UK" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="region">Region / country</Label>
                  <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. United Kingdom" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plan">Initial plan</Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger id="plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What this marketplace sells and who it serves"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner account</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="owner-name">Owner name</Label>
                <Input id="owner-name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner-email">Owner email</Label>
                <Input
                  id="owner-email"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enabled features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureFlags.map((f) => (
                <div key={f.key} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.category}</p>
                  </div>
                  <Switch
                    checked={features[f.key]}
                    onCheckedChange={(v) => setFeatures((prev) => ({ ...prev, [f.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Provisioning..." : "Create tenant"}
          </Button>
        </div>
      </form>
    </div>
  )
}
