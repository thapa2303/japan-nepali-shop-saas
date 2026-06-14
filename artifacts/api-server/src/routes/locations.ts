import { Router, type IRouter } from "express";
import { db, shopLocations } from "@workspace/db";

const router: IRouter = Router();

router.get("/locations", async (_req, res): Promise<void> => {
  const rows = await db
    .selectDistinct({ prefecture: shopLocations.prefecture, city: shopLocations.city })
    .from(shopLocations);
  res.json({ locations: rows });
});

export default router;
