"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Lock, User, Store, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { prefectures } from "@/lib/mock-data/locations"
import { toast } from "@/hooks/use-toast"
import { login, register } from "@/lib/api-client"

type AccountType = "customer" | "merchant"

export function AuthForm({ defaultTab = "signin" }: { defaultTab?: "signin" | "register" }) {
  const router = useRouter()
  const [tab, setTab] = useState<"signin" | "register">(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>("customer")
  const [shopName, setShopName] = useState("")
  const [shopPrefecture, setShopPrefecture] = useState("")
  const [shopCity, setShopCity] = useState("")
  const [shopAddress, setShopAddress] = useState("")

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem("signin-email") as HTMLInputElement).value
    const password = (form.elements.namedItem("signin-password") as HTMLInputElement).value

    try {
      const result = await login(email, password)
      const roles = result.user.roles ?? []
      toast({ title: "Welcome back", description: "You have signed in successfully." })
      if (roles.includes("PLATFORM_SUPER_ADMIN") || roles.includes("PSA")) {
        router.push("/admin")
      } else if (roles.includes("MERCHANT") || roles.includes("TENANT_ADMIN")) {
        router.push("/dashboard")
      } else {
        router.push("/account")
      }
    } catch (err) {
      toast({
        title: "Sign in failed",
        description: err instanceof Error ? err.message : "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem("register-name") as HTMLInputElement).value
    const email = (form.elements.namedItem("register-email") as HTMLInputElement).value
    const password = (form.elements.namedItem("register-password") as HTMLInputElement).value

    if (accountType === "merchant") {
      if (!shopName.trim()) {
        toast({ title: "Shop name required", description: "Please enter your shop name.", variant: "destructive" })
        return
      }
      if (!shopPrefecture || !shopCity.trim()) {
        toast({
          title: "Shop location required",
          description: "Please select a prefecture and enter your city.",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    try {
      const tenantSlug = accountType === "merchant"
        ? shopName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        : undefined

      const result = await register({
        email,
        password,
        name,
        tenantName: accountType === "merchant" ? shopName : undefined,
        tenantSlug,
      })

      toast({
        title: "Account created",
        description:
          accountType === "merchant"
            ? `${shopName} is set up. Finish your shop profile to go live.`
            : "Your account is ready. Start exploring local shops.",
      })

      const roles = result.user.roles ?? []
      if (roles.includes("MERCHANT") || roles.includes("TENANT_ADMIN")) {
        router.push("/dashboard")
      } else {
        router.push("/account")
      }
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Could not create account.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "register")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Sign In */}
        <TabsContent value="signin" className="mt-6">
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signin-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Keep me signed in
              </Label>
            </div>

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </TabsContent>

        {/* Register */}
        <TabsContent value="register" className="mt-6">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>I want to</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("customer")}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                    accountType === "customer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <User
                    className={`h-5 w-5 ${accountType === "customer" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="text-sm font-medium">Shop</span>
                  <span className="text-xs text-muted-foreground">Buy from local shops</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("merchant")}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                    accountType === "merchant"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <Store
                    className={`h-5 w-5 ${accountType === "merchant" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="text-sm font-medium">Sell</span>
                  <span className="text-xs text-muted-foreground">Open your own shop</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="register-name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="register-name" required placeholder="Your name" className="pl-10" autoComplete="name" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="register-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {accountType === "merchant" ? (
              <div className="flex flex-col gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Set up your shop</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="shop-name">Shop name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="shop-name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Himalaya Asian Mart"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="shop-prefecture">Shop location</Label>
                  <Select value={shopPrefecture} onValueChange={setShopPrefecture}>
                    <SelectTrigger id="shop-prefecture">
                      <SelectValue placeholder="Select prefecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {prefectures.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="shop-city" className="sr-only">
                    City
                  </Label>
                  <Input
                    id="shop-city"
                    value={shopCity}
                    onChange={(e) => setShopCity(e.target.value)}
                    placeholder="City / Ward (e.g. Shinjuku)"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="shop-address" className="sr-only">
                    Street address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="shop-address"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      placeholder="Street address (optional)"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-2">
              <Checkbox id="terms" required className="mt-0.5" />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {tab === "signin" ? (
          <>
            New to ShopSaaS?{" "}
            <button onClick={() => setTab("register")} className="font-medium text-primary hover:underline">
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setTab("signin")} className="font-medium text-primary hover:underline">
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  )
}
