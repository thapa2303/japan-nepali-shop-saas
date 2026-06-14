---
name: Product images join
description: products table has no images column; must join product_images table to get image URLs.
---

The `products` table has no `images` column. Images are stored in the separate `product_images` table with columns: `id`, `productId`, `url`, `altText`, `sortOrder`.

**Pattern for fetching products with images:**
```ts
async function attachImages(productRows) {
  if (productRows.length === 0) return productRows.map(p => ({ ...p, images: [] }));
  const ids = productRows.map(p => p.id);
  const imgs = await db
    .select({ productId: productImages.productId, url: productImages.url, sortOrder: productImages.sortOrder })
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(asc(productImages.sortOrder));
  const imgMap = {};
  for (const img of imgs) {
    if (!imgMap[img.productId]) imgMap[img.productId] = [];
    imgMap[img.productId].push(img.url);
  }
  return productRows.map(p => ({ ...p, images: imgMap[p.id] ?? [] }));
}
```

**Frontend:** Always use `product.images?.[0] ?? fallbackUrl` since a product may have no images in the DB. Never access `product.images[0]` directly — it will crash on SSR when images is null.

**Why:** This is the normalized DB design. images is a 1-to-many relation, not a JSON column.
