"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { api, ApiError } from "@/lib/api/client"

export type AuthRole = "customer" | "merchant" | "admin"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AuthRole
  avatar?: string
  [key: string]: unknown
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: AuthRole
  shop?: {
    name: string
    prefecture: string
    city: string
    address?: string
  }
}

interface BackendUser {
  id: string
  email: string
  displayName: string
  tenantId: string | null
  roles: string[]
}

interface BackendLoginResponse {
  user: BackendUser
  token: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "shop"
}

function deriveRole(roles: string[]): AuthRole {
  if (roles.includes("PLATFORM_SUPER_ADMIN") || roles.includes("PSA")) return "admin"
  if (roles.includes("TENANT_ADMIN") || roles.includes("MERCHANT")) return "merchant"
  return "customer"
}

function toAuthUser(u: BackendUser): AuthUser {
  return {
    id: u.id,
    name: u.displayName,
    email: u.email,
    role: deriveRole(u.roles),
    tenantId: u.tenantId,
    roles: u.roles,
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const me = await api.get<BackendUser>("/api/auth/me")
      setUser(toAuthUser(me))
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        console.error("[auth] refresh failed:", error)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<BackendLoginResponse>("/api/auth/login", { email, password })
    const authUser = toAuthUser(res.user)
    setUser(authUser)
    return authUser
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const tenantName = input.shop?.name ?? input.name
    const baseSlug = slugify(input.shop?.name ?? input.email.split("@")[0])
    const tenantSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

    const res = await api.post<BackendLoginResponse>("/api/auth/register", {
      email: input.email,
      password: input.password,
      displayName: input.name,
      tenantName,
      tenantSlug,
    })
    const authUser = toAuthUser(res.user)
    setUser(authUser)
    return authUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout")
    } catch (error) {
      console.error("[auth] logout failed:", error)
    }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
