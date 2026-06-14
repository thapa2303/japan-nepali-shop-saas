"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { Product, ProductVariant } from "@/lib/types"

export interface ApiCartItem {
  id: string
  productId: string
  name: string
  price: number
  images: string[]
  quantity: number
  subtotal: number
}

export interface ApiShopCart {
  shopId: string
  shopName: string
  shopSlug: string
  deliveryFee: number
  items: ApiCartItem[]
  subtotal: number
}

interface ApiCart {
  cartId: string
  items: ApiShopCart[]
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
}

interface ShopInfo {
  slug: string
  deliveryFee?: number
}

const EMPTY_CART: ApiCart = {
  cartId: "",
  items: [],
  itemCount: 0,
  subtotal: 0,
  deliveryFee: 0,
  total: 0,
}

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
}

async function cartRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>
    throw new Error((err.error as string) ?? `Cart request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

interface CartContextType {
  isOpen: boolean
  addItem: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant,
    shopInfo?: ShopInfo,
  ) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  clearShopCart: (shopId: string) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getDeliveryFee: () => number
  getTotal: () => number
  getShopCarts: () => ApiShopCart[]
  getItemQuantity: (productId: string, variantId?: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ApiCart>(EMPTY_CART)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    cartRequest<ApiCart>(`${getApiBase()}/api/cart`)
      .then(setCart)
      .catch((err: unknown) => console.error("Failed to load cart:", err))
  }, [])

  const addItem = useCallback(
    (product: Product, quantity = 1, _variant?: ProductVariant, _shopInfo?: ShopInfo) => {
      cartRequest<ApiCart>(`${getApiBase()}/api/cart/items`, {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity }),
      })
        .then(setCart)
        .catch((err: unknown) => console.error("Failed to add item:", err))
    },
    [],
  )

  const removeItem = useCallback(
    (productId: string, _variantId?: string) => {
      const item = cart.items.flatMap((sc) => sc.items).find((i) => i.productId === productId)
      if (!item) return
      cartRequest<ApiCart>(`${getApiBase()}/api/cart/items/${item.id}`, {
        method: "DELETE",
      })
        .then(setCart)
        .catch((err: unknown) => console.error("Failed to remove item:", err))
    },
    [cart.items],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number, _variantId?: string) => {
      const item = cart.items.flatMap((sc) => sc.items).find((i) => i.productId === productId)
      if (!item) return
      if (quantity <= 0) {
        cartRequest<ApiCart>(`${getApiBase()}/api/cart/items/${item.id}`, {
          method: "DELETE",
        })
          .then(setCart)
          .catch((err: unknown) => console.error("Failed to remove item:", err))
      } else {
        cartRequest<ApiCart>(`${getApiBase()}/api/cart/items/${item.id}`, {
          method: "PUT",
          body: JSON.stringify({ quantity }),
        })
          .then(setCart)
          .catch((err: unknown) => console.error("Failed to update item:", err))
      }
    },
    [cart.items],
  )

  const clearCart = useCallback(() => {
    cartRequest<ApiCart>(`${getApiBase()}/api/cart`, { method: "DELETE" })
      .then(setCart)
      .catch((err: unknown) => console.error("Failed to clear cart:", err))
  }, [])

  const clearShopCart = useCallback(
    (shopId: string) => {
      const shopCart = cart.items.find((sc) => sc.shopId === shopId)
      if (!shopCart || shopCart.items.length === 0) return
      Promise.all(
        shopCart.items.map((item) =>
          cartRequest<ApiCart>(`${getApiBase()}/api/cart/items/${item.id}`, {
            method: "DELETE",
          }),
        ),
      )
        .then((results) => {
          if (results.length > 0) setCart(results[results.length - 1])
        })
        .catch((err: unknown) => console.error("Failed to clear shop cart:", err))
    },
    [cart.items],
  )

  const toggleCart = () => setIsOpen((v) => !v)
  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const getItemCount = () => cart.itemCount
  const getSubtotal = () => cart.subtotal
  const getDeliveryFee = () => cart.deliveryFee
  const getTotal = () => cart.total
  const getShopCarts = () => cart.items
  const getItemQuantity = (productId: string, _variantId?: string) =>
    cart.items
      .flatMap((sc) => sc.items)
      .find((i) => i.productId === productId)?.quantity ?? 0

  return (
    <CartContext.Provider
      value={{
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearShopCart,
        toggleCart,
        openCart,
        closeCart,
        getItemCount,
        getSubtotal,
        getDeliveryFee,
        getTotal,
        getShopCarts,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
