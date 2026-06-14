"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { CartItem, Product, ProductVariant, ShopCart } from "@/lib/types"
import { getShopById } from "@/lib/mock-data/shops"

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; variant?: ProductVariant } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId?: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "CLEAR_SHOP_CART"; payload: { shopId: string } }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, variant } = action.payload
      const shop = getShopById(product.shopId)
      
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          (variant ? item.variant?.id === variant.id : !item.variant)
      )

      if (existingIndex > -1) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product,
            quantity,
            variant,
            shopId: product.shopId,
            shopName: shop?.name || "Unknown Shop",
          },
        ],
      }
    }

    case "REMOVE_ITEM": {
      const { productId, variantId } = action.payload
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.product.id === productId &&
              (variantId ? item.variant?.id === variantId : !item.variant))
        ),
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId &&
                (variantId ? item.variant?.id === variantId : !item.variant))
          ),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId &&
          (variantId ? item.variant?.id === variantId : !item.variant)
            ? { ...item, quantity }
            : item
        ),
      }
    }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "CLEAR_SHOP_CART": {
      const { shopId } = action.payload
      return {
        ...state,
        items: state.items.filter((item) => item.shopId !== shopId),
      }
    }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    case "LOAD_CART":
      return { ...state, items: action.payload }

    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  clearShopCart: (shopId: string) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getShopCarts: () => ShopCart[]
  getItemQuantity: (productId: string, variantId?: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "shop-saas-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored)
        dispatch({ type: "LOAD_CART", payload: items })
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
    }
  }, [])

  // Save cart to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error("Failed to save cart:", error)
    }
  }, [state.items])

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, variant } })
  }

  const removeItem = (productId: string, variantId?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } })
  }

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const clearShopCart = (shopId: string) => {
    dispatch({ type: "CLEAR_SHOP_CART", payload: { shopId } })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.variant?.price || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const getShopCarts = (): ShopCart[] => {
    const shopMap = new Map<string, CartItem[]>()

    state.items.forEach((item) => {
      const existing = shopMap.get(item.shopId) || []
      shopMap.set(item.shopId, [...existing, item])
    })

    return Array.from(shopMap.entries()).map(([shopId, items]) => {
      const shop = getShopById(shopId)
      const subtotal = items.reduce((total, item) => {
        const price = item.variant?.price || item.product.price
        return total + price * item.quantity
      }, 0)

      return {
        shopId,
        shopName: shop?.name || "Unknown Shop",
        shopSlug: shop?.slug || "",
        items,
        subtotal,
        deliveryFee: shop?.deliveryFee || 0,
      }
    })
  }

  const getItemQuantity = (productId: string, variantId?: string) => {
    const item = state.items.find(
      (item) =>
        item.product.id === productId &&
        (variantId ? item.variant?.id === variantId : !item.variant)
    )
    return item?.quantity || 0
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
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
