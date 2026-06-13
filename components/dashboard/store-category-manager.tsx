"use client"

import { useState } from "react"
import { Plus, GripVertical, Eye, EyeOff, Trash2 } from "lucide-react"

import type { StoreCategory } from "@/lib/types"
import { storeCategories } from "@/lib/mock-data/merchant-management"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export function StoreCategoryManager() {
  const [categories, setCategories] = useState<StoreCategory[]>(storeCategories)
  const [name, setName] = useState("")

  const add = () => {
    if (!name.trim()) return
    setCategories((prev) => [
      ...prev,
      { id: `sc-${Date.now()}`, name: name.trim(), productCount: 0, visible: true },
    ])
    setName("")
    toast({ title: "Category added" })
  }

  const toggle = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))
  }

  const remove = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast({ title: "Category removed" })
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

      <Card>
        <CardContent className="divide-y p-0">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.name}</span>
                  {!c.visible ? (
                    <Badge variant="outline" className="text-muted-foreground">
                      Hidden
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{c.productCount} products</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggle(c.id)}>
                {c.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="sr-only">Toggle visibility</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(c.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
