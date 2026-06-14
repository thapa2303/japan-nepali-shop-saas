"use client"

import { useEffect, useState } from "react"
import { Plus, GripVertical, Eye, EyeOff, Trash2, Loader2 } from "lucide-react"

import {
  fetchDashboardStoreCategories,
  createDashboardStoreCategory,
  updateDashboardStoreCategory,
  deleteDashboardStoreCategory,
  type DashboardStoreCategory,
} from "@/lib/api-client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export function StoreCategoryManager() {
  const [categories, setCategories] = useState<DashboardStoreCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")

  useEffect(() => {
    fetchDashboardStoreCategories()
      .then((r) => setCategories(r.categories))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const add = async () => {
    if (!name.trim()) return
    try {
      const cat = await createDashboardStoreCategory({ name: name.trim() })
      setCategories((prev) => [...prev, cat])
      setName("")
      toast({ title: "Category added" })
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    }
  }

  const toggle = async (c: DashboardStoreCategory) => {
    try {
      const updated = await updateDashboardStoreCategory(c.id, { isVisible: !c.isVisible })
      setCategories((prev) => prev.map((x) => (x.id === c.id ? updated : x)))
    } catch {
      toast({ title: "Error updating category", variant: "destructive" })
    }
  }

  const remove = async (c: DashboardStoreCategory) => {
    try {
      await deleteDashboardStoreCategory(c.id)
      setCategories((prev) => prev.filter((x) => x.id !== c.id))
      toast({ title: "Category removed" })
    } catch {
      toast({ title: "Error removing category", variant: "destructive" })
    }
  }

  return (
    <>
      <DashboardHeader
        title="Store categories"
        description="Organize your products into groups customers can browse."
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category name"
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <Button onClick={add}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <CardContent className="divide-y p-0">
            {categories.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No categories yet. Add one above.
              </div>
            )}
            {categories.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-4">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.name}</span>
                    {!c.isVisible && (
                      <Badge variant="outline" className="text-muted-foreground">Hidden</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.productCount} products</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => toggle(c)}>
                  {c.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(c)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}
