"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react"

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
import { formatYen } from "@/lib/dashboard-utils"
import { toast } from "@/hooks/use-toast"

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
  category: string
  unit: string
  stockCount: string
  inStock: boolean
}

const emptyForm: FormState = {
  name: "",
  nameNepali: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "",
  unit: "",
  stockCount: "",
  inStock: true,
}

const LOW_STOCK_THRESHOLD = 50

export function ProductManager({ initialProducts, shopId, productLimit }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

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
      category: product.category,
      unit: product.unit ?? "",
      stockCount: product.stockCount !== undefined ? String(product.stockCount) : "",
      inStock: product.inStock,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      toast({ title: "Missing details", description: "Name and price are required.", variant: "destructive" })
      return
    }

    if (editing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: form.name,
                nameNepali: form.nameNepali || undefined,
                description: form.description,
                price: Number(form.price),
                compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
                category: form.category,
                unit: form.unit || undefined,
                stockCount: form.stockCount ? Number(form.stockCount) : undefined,
                inStock: form.inStock,
              }
            : p
        )
      )
      toast({ title: "Product updated", description: `${form.name} has been saved.` })
    } else {
      if (products.length >= productLimit) {
        toast({
          title: "Plan limit reached",
          description: `Your plan allows up to ${productLimit} products. Upgrade to add more.`,
          variant: "destructive",
        })
        return
      }
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        shopId,
        name: form.name,
        nameNepali: form.nameNepali || undefined,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        images: ["/placeholder.svg?height=400&width=400"],
        category: form.category || "general",
        inStock: form.inStock,
        stockCount: form.stockCount ? Number(form.stockCount) : undefined,
        unit: form.unit || undefined,
      }
      setProducts((prev) => [newProduct, ...prev])
      toast({ title: "Product added", description: `${form.name} is now live in your shop.` })
    }
    setDialogOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    toast({ title: "Product removed", description: `${deleteTarget.name} has been deleted.` })
    setDeleteTarget(null)
  }

  const toggleStock = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, inStock: !p.inStock } : p))
    )
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
                        <Badge variant="secondary" className="capitalize">
                          {product.category}
                        </Badge>
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="rice"
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
