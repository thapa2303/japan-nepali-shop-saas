"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Lock, User, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

type AccountType = "customer" | "merchant"

export function AuthForm({ defaultTab = "signin" }: { defaultTab?: "signin" | "register" }) {
  const router = useRouter()
  const [tab, setTab] = useState<"signin" | "register">(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>("customer")

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Welcome back", description: "You have signed in successfully." })
      router.push("/")
    }, 900)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Account created",
        description:
          accountType === "merchant"
            ? "Your merchant account is ready. Let's set up your shop."
            : "Your account is ready. Start exploring local shops.",
      })
      router.push(accountType === "merchant" ? "/dashboard" : "/")
    }, 900)
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

            <div className="flex items-start gap-2">
              <Checkbox id="terms" required className="mt-0.5" />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
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
