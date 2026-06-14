"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

import { products } from "@/lib/mock-data/products"
import { getShopById } from "@/lib/mock-data/shops"
import { formatYen } from "@/lib/dashboard-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AdminProductManager() {
  const [query, setQuery] = useState("")
  const [stock, setStock] = useState<"all" | "in" | "out">("all")

  const filtered = products.filter((p) => {
    const q = query.toLowerCase()
    const shopName = getShopById(p.shopId)?.name ?? ""
    const matchesQuery =
      !q || p.name.toLowerCase().includes(q) || shopName.toLowerCase().includes(q)
    const matchesStock =
      stock === "all" || (stock === "in" ? p.inStock : !p.inStock)
    return matchesQuery && matchesStock
  })

  const stats = [
    { label: "Total products", value: products.length.toLocaleString() },
    { label: "In stock", value: products.filter((p) => p.inStock).length },
    { label: "Out of stock", value: products.filter((p) => !p.inStock).length },
    { label: "Featured", value: products.filter((p) => p.featured).length },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or shops"
                className="pl-9"
              />
            </div>
            <Select value={stock} onValueChange={(v) => setStock(v as "all" | "in" | "out")}>
              <SelectTrigger className="sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stock</SelectItem>
                <SelectItem value="in">In stock</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={p.images?.[0] || "/placeholder.svg"}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{getShopById(p.shopId)?.name}</TableCell>
                    <TableCell className="text-right font-medium">{formatYen(p.price)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{p.stockCount ?? "—"}</TableCell>
                    <TableCell>
                      {p.inStock ? (
                        <Badge variant="outline" className="border-chart-2/50 bg-chart-2/20 text-foreground">
                          In stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                          Out of stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No products match your filters.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
