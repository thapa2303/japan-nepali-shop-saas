import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import shopsRouter from "./shops.js";
import productsRouter from "./products.js";
import merchantRouter from "./merchant.js";
import searchRouter from "./search.js";
import locationsRouter from "./locations.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import accountRouter from "./account.js";
import dashboardRouter from "./dashboard.js";
import consoleRouter from "./console.js";
import tenantAdminRouter from "./tenant-admin.js";
import uploadRouter from "./upload.js";
import couponsRouter from "./coupons.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(shopsRouter);
router.use(productsRouter);
router.use(merchantRouter);
router.use(searchRouter);
router.use(locationsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(accountRouter);
router.use(couponsRouter);

router.use(
  "/dashboard",
  authenticate,
  authorize("MERCHANT"),
  dashboardRouter,
);

router.use(
  "/console",
  authenticate,
  authorize("PSA"),
  consoleRouter,
);

router.use(
  "/tenant-admin",
  authenticate,
  authorize("TENANT_ADMIN"),
  tenantAdminRouter,
);

router.use("/upload", authenticate, uploadRouter);

export default router;
