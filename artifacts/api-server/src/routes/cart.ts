import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  carts,
  cartItems,
  products,
  eq,
  and,
} from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";

const router: IRouter = Router();

async function getOrCreateCart(userId: string): Promise<string> {
  const [existing] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);
  if (existing) return existing.id;
  const [created] = await db.insert(carts).values({ userId }).returning({ id: carts.id });
  return created.id;
}

// GET /api/cart — fetch current user's cart with product details
router.get("/cart", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const [cart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);

  if (!cart) {
    res.json({ items: [] });
    return;
  }

  const rows = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      shopId: cartItems.shopId,
      quantity: cartItems.quantity,
      price: products.price,
      name: products.name,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));

  res.json({ items: rows });
});

// POST /api/cart/items — add a product to cart
router.post("/cart/items", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { productId, quantity = 1 } = req.body as { productId: string; quantity?: number };

  if (!productId) {
    res.status(400).json({ error: "productId is required" });
    return;
  }
  const qty = Math.max(1, Math.round(Number(quantity) || 1));

  // Look up product to get shopId, price, name
  const [product] = await db
    .select({ id: products.id, shopId: products.shopId, price: products.price, name: products.name, isActive: products.isActive })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product || !product.isActive) {
    res.status(404).json({ error: "Product not found or unavailable" });
    return;
  }

  const cartId = await getOrCreateCart(userId);

  // Upsert: if same product already in cart, increment quantity
  const [existing] = await db
    .select({ id: cartItems.id, quantity: cartItems.quantity })
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .limit(1);

  let itemId: string;
  let finalQty: number;

  if (existing) {
    finalQty = existing.quantity + qty;
    await db
      .update(cartItems)
      .set({ quantity: finalQty })
      .where(eq(cartItems.id, existing.id));
    itemId = existing.id;
  } else {
    const [inserted] = await db
      .insert(cartItems)
      .values({ cartId, shopId: product.shopId!, productId, quantity: qty })
      .returning({ id: cartItems.id, quantity: cartItems.quantity });
    itemId = inserted.id;
    finalQty = inserted.quantity;
  }

  res.status(201).json({
    id: itemId,
    productId,
    shopId: product.shopId,
    quantity: finalQty,
    price: product.price,
    name: product.name,
  });
});

// DELETE /api/cart/items/:id — remove a cart item
router.delete("/cart/items/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const itemId = String(req.params.id);

  const [cart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);

  if (!cart) {
    res.status(404).json({ error: "Cart not found" });
    return;
  }

  const [deleted] = await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
    .returning({ id: cartItems.id });

  if (!deleted) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  res.json({ message: "Item removed", id: deleted.id });
});

export default router;
