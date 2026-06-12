"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Store, ImageIcon, Upload } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useCategories } from "@/lib/contexts/category-context"
import type { Category } from "@/lib/types"

type DraftCategory = {
  name: string
  nameNepali: string
  description: string
  image: string
}

const emptyDraft: DraftCategory = { name: "", nameNepali: "", description: "", image: "" }

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=240&width=240"

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function CategoryManager() {
  const { toast } = useToast()
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [draft, setDraft] = useState<DraftCategory>(emptyDraft)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openAdd = () => {
    setEditing(null)
    setDraft(emptyDraft)
    setDialogOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setDraft({
      name: category.name,
      nameNepali: category.nameNepali,
      description: category.description,
      image: category.image,
    })
    setDialogOpen(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setDraft((d) => ({ ...d, image: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!draft.name.trim()) return
    const image = draft.image || PLACEHOLDER_IMAGE
    if (editing) {
      updateCategory({
        ...editing,
        name: draft.name,
        nameNepali: draft.nameNepali,
        description: draft.description,
        image,
      })
      toast({ title: "Category updated", description: `${draft.name} has been saved.` })
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: draft.name,
        nameNepali: draft.nameNepali,
        slug: slugify(draft.name),
        icon: "Store",
        image,
        description: draft.description,
        shopCount: 0,
      }
      addCategory(newCategory)
      toast({
        title: "Category added",
        description: `${draft.name} is now live in Browse by Category.`,
      })
    }
    setDialogOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteCategory(deleteTarget.id)
    toast({ title: "Category deleted", description: `${deleteTarget.name} has been removed.` })
    setDeleteTarget(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length} categories shown in Browse by Category
        </p>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="relative aspect-[5/3] w-full bg-muted">
              <Image
                src={category.image || PLACEHOLDER_IMAGE}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.nameNepali}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {category.name}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteTarget(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {category.name}</span>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Store className="h-3.5 w-3.5" />
                {category.shopCount} shops
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the category details below."
                : "Create a new category. It will appear in Browse by Category and in every merchant's product form."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Category image</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {draft.image ? (
                    <Image
                      src={draft.image || PLACEHOLDER_IMAGE}
                      alt="Category preview"
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {draft.image ? "Change image" : "Upload image"}
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG or PNG, square works best.</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g., Spices & Masala"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-nepali">Nepali name</Label>
              <Input
                id="cat-nepali"
                value={draft.nameNepali}
                onChange={(e) => setDraft((d) => ({ ...d, nameNepali: e.target.value }))}
                placeholder="नेपाली नाम"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Short description of this category"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!draft.name.trim()}>
              {editing ? "Save changes" : "Add category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &quot;{deleteTarget?.name}&quot; from Browse by Category and the
              merchant product form. Shops in this category will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
