import { Router, type IRouter, type Request, type Response } from "express";
import authRouter from "./auth.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router: IRouter = Router();

router.use(authRouter);

router.get(
  "/dashboard",
  authenticate,
  authorize("MERCHANT"),
  (req: Request, res: Response): void => {
    res.json({ message: "Merchant dashboard", userId: req.user!.id });
  },
);

router.get(
  "/admin",
  authenticate,
  authorize("TENANT_ADMIN"),
  (req: Request, res: Response): void => {
    res.json({ message: "Tenant admin panel", userId: req.user!.id, tenantId: req.user!.tenantId });
  },
);

router.get(
  "/console",
  authenticate,
  authorize("PSA"),
  (req: Request, res: Response): void => {
    res.json({ message: "Platform super-admin console", userId: req.user!.id });
  },
);

export default router;
