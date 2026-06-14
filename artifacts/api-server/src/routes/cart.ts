import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/cart", async (_req, res): Promise<void> => {
  res.json({ items: [] });
});

router.post("/cart/items", async (_req, res): Promise<void> => {
  res.status(501).json({ error: "Not implemented" });
});

router.delete("/cart/items/:id", async (_req, res): Promise<void> => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
