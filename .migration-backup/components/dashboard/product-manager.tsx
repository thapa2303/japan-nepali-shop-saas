"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, AlertTriangle, Upload, X, ImageIcon } from "lucide-react"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useCategories } from "@/lib/contexts/category-context"
import { formatYen } from "@/lib/dashboard-utils"
import { toast } from "@/hooks/use-toast"
import {
  createDashboardProduct,
  updateDashboardProduct,
  deleteDashboardProduct,
} from "@/lib/api-client"

interface ProductManagerProps {
  initialProducts: Product[]
  shopId: string
  productLimit: number
}

interface FormState {
  name: string
  nameNepali: string
  description: string
  price: string
  compareAtPrice: string
  browseCategory: string
  category: string
  unit: string
  stockCount: string
  inStock: boolean
  images: string[]
}

const emptyForm: FormState = {
  name: "",
  nameNepali: "",
  description: "",
  price: "",
  compareAtPrice: "",
  browseCategory: "",
  category: "",
  unit: "",
  stockCount: "",
  inStock: true,
  images: [],
}

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=400&width=400"

const LOW_STOCK_THRESHOLD = 50

export function ProductManager({ initialProducts, shopId, productLimit }: ProductManagerProps) {
  const { categories } = useCategories()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      nameNepali: product.nameNepali ?? "",
      description: product.description,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      browseCategory: product.browseCategory ?? "",
      category: product.storeCategory ?? product.category,
      unit: product.unit ?? "",
      stockCount: product.stockCount !== undefined ? String(product.stockCount) : "",
      inStock: product.inStock,
      images: product.images?.filter((img) => img && !img.includes("placeholder.svg")) ?? [],
    })
    setDialogOpen(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" })
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        setForm((f) => ({ ...f, images: [...f.images, reader.result as string] }))
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast({ title: "Missing details", description: "Name and price are required.", variant: "destructive" })
      return
    }
    if (!form.browseCategory) {
      toast({
        title: "Browse category required",
        description: "Select which platform category this product belongs to.",
        variant: "destructive",
      })
      return
    }

    const storeCategory = form.category.trim() || "general"
    const images = form.images.length > 0 ? form.images : [PLACEHOLDER_IMAGE]
    const payload = {
      name: form.name,
      nameNepali: form.nameNepali || null,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      browseCategory: form.browseCategory,
      storeCategory,
      images,
      unit: form.unit || null,
      stockCount: form.stockCount ? Number(form.stockCount) : null,
      inStock: form.inStock,
    }

    if (editing) {
      try {
        const updated = await updateDashboardProduct(editing.id, payload)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editing.id
              ? { ...p, ...payload, id: editing.id, shopId, category: storeCategory, nameNepali: form.nameNepali || undefined, compareAtPrice: payload.compareAtPrice ?? undefined, unit: form.unit || undefined, stockCount: payload.stockCount ?? undefined }
              : p
          )
        )
        toast({ title: "Product updated", description: `${form.name} has been saved.` })
      } catch {
        toast({ title: "Failed to update product", variant: "destructive" })
        return
      }
    } else {
      if (products.length >= productLimit) {
        toast({
          title: "Plan limit reached",
          description: `Your plan allows up to ${productLimit} products. Upgrade to add more.`,
          variant: "destructive",
        })
        return
      }
      try {
        const created = await createDashboardProduct(payload)
        const newProduct: Product = {
          id: String(created.id ?? `p-${Date.now()}`),
          shopId,
          name: form.name,
          nameNepali: form.nameNepali || undefined,
          description: form.description,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
          images,
          browseCategory: form.browseCategory,
          storeCategory,
          category: storeCategory,
          inStock: form.inStock,
          stockCount: form.stockCount ? Number(form.stockCount) : undefined,
          unit: form.unit || undefined,
        }
        setProducts((prev) => [newProduct, ...prev])
        toast({ title: "Product added", description: `${form.name} is now live in your shop.` })
      } catch {
        toast({ title: "Failed to add product", variant: "destructive" })
        return
      }
    }
    setDialogOpen(false)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteDashboardProduct(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast({ title: "Product removed", description: `${deleteTarget.name} has been deleted.` })
    } catch {
      toast({ title: "Failed to delete product", variant: "destructive" })
    }
    setDeleteTarget(null)
  }

  const toggleStock = async (product: Product) => {
    try {
      await updateDashboardProduct(product.id, { inStock: !product.inStock })
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: !p.inStock } : p))
      )
    } catch {
      toast({ title: "Failed to update stock status", variant: "destructive" })
    }
  }

  return (
    <>
      <DashboardHeader
        title="Products & Inventory"
        description={`${products.length} of ${productLimit} products used on your current plan.`}
      >
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </DashboardHeader>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => {
                  const lowStock = (product.stockCount ?? 0) < LOW_STOCK_THRESHOLD
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{product.name}</p>
                            {product.unit ? (
                              <p className="text-xs text-muted-foreground">{product.unit}</p>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          {product.browseCategory ? (
                            <Badge variant="outline" className="w-fit capitalize">
                              {product.browseCategory.replace("-", " ")}
                            </Badge>
                          ) : null}
                          <span className="text-xs capitalize text-muted-foreground">
                            {product.storeCategory ?? product.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatYen(product.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1">
                          {lowStock ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                          ) : null}
                          {product.stockCount ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={product.inStock}
                          onCheckedChange={() => toggleStock(product)}
                          aria-label="Toggle availability"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the details for this product." : "Add a new product to your shop."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Product images</Label>
              <div className="flex flex-wrap items-center gap-3">
                {form.images.map((img, index) => (
                  <div
                    key={index}
                    className="group relative h-20 w-20 overflow-hidden rounded-md border bg-muted"
                  >
                    <Image
                      src={img || PLACEHOLDER_IMAGE}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5 text-foreground shadow-sm transition-opacity hover:bg-background"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {form.images.length === 0 ? (
                    <ImageIcon className="h-5 w-5" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  <span className="text-xs">Upload</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                The first image is used as the main product photo. JPG or PNG.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Product name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Basmati Rice 5kg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameNepali">Nepali name</Label>
              <Input
                id="nameNepali"
                value={form.nameNepali}
                onChange={(e) => setForm((f) => ({ ...f, nameNepali: e.target.value }))}
                placeholder="नेपाली नाम"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short product description"
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (¥) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="2980"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="compareAtPrice">Compare-at price (¥)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(e) => setForm((f) => ({ ...f, compareAtPrice: e.target.value }))}
                  placeholder="3400"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="browseCategory">Browse category *</Label>
              <Select
                value={form.browseCategory}
                onValueChange={(value) => setForm((f) => ({ ...f, browseCategory: value }))}
              >
                <SelectTrigger id="browseCategory">
                  <SelectValue placeholder="Select a platform category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The platform category this product is listed under in Browse by Category.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="category">Your store category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g., Rice & Grains"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  placeholder="5kg bag"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stockCount">Stock</Label>
                <Input
                  id="stockCount"
                  type="number"
                  value={form.stockCount}
                  onChange={(e) => setForm((f) => ({ ...f, stockCount: e.target.value }))}
                  placeholder="80"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="inStock">Available for sale</Label>
                <p className="text-xs text-muted-foreground">Show this product in your storefront</p>
              </div>
              <Switch
                id="inStock"
                checked={form.inStock}
                onCheckedChange={(v) => setForm((f) => ({ ...f, inStock: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Add product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.name} from your shop. This action cannot be undone.
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
    </>
  )
}
