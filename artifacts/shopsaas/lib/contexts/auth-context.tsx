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

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Check the current session on mount via the cookie.
  const refresh = useCallback(async () => {
    try {
      const me = await api.get<AuthUser>("/api/auth/me")
      setUser(me)
    } catch (error) {
      // 401 = not logged in, which is expected for guests.
      if (!(error instanceof ApiError) || error.status !== 401) {
        console.error("[v0] auth refresh failed:", error)
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
    const loggedIn = await api.post<AuthUser>("/api/auth/login", { email, password })
    setUser(loggedIn)
    return loggedIn
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const created = await api.post<AuthUser>("/api/auth/register", input)
    setUser(created)
    return created
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout")
    } catch (error) {
      console.error("[v0] logout failed:", error)
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
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
