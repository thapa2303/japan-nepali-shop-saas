"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Category } from "@/lib/types"
import { fetchCategories } from "@/lib/api-client"

interface CategoryState {
  categories: Category[]
  loaded: boolean
}

type CategoryAction =
  | { type: "LOAD"; payload: Category[] }
  | { type: "ADD"; payload: Category }
  | { type: "UPDATE"; payload: Category }
  | { type: "DELETE"; payload: { id: string } }

function categoryReducer(state: CategoryState, action: CategoryAction): CategoryState {
  switch (action.type) {
    case "LOAD":
      return { categories: action.payload, loaded: true }
    case "ADD":
      return { ...state, categories: [...state.categories, action.payload] }
    case "UPDATE":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      }
    case "DELETE":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload.id),
      }
    default:
      return state
  }
}

interface CategoryContextType {
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  getCategoryBySlug: (slug: string) => Category | undefined
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(categoryReducer, {
    categories: [],
    loaded: false,
  })

  useEffect(() => {
    fetchCategories()
      .then(({ categories }) => {
        dispatch({ type: "LOAD", payload: categories })
      })
      .catch((err) => {
        console.error("Failed to load categories from API:", err)
        dispatch({ type: "LOAD", payload: [] })
      })
  }, [])

  const addCategory = (category: Category) => dispatch({ type: "ADD", payload: category })
  const updateCategory = (category: Category) => dispatch({ type: "UPDATE", payload: category })
  const deleteCategory = (id: string) => dispatch({ type: "DELETE", payload: { id } })
  const getCategoryBySlug = (slug: string) =>
    state.categories.find((c) => c.slug === slug)

  return (
    <CategoryContext.Provider
      value={{
        categories: state.categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryBySlug,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}
