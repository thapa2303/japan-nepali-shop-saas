import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  notifications,
  eq,
  and,
  desc,
} from "@workspace/db";
import { authenticate } from "../middleware/authenticate.js";

const router: IRouter = Router();

// GET /api/notifications — list notifications for the authenticated user
router.get(
  "/notifications",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
    const unreadCount = rows.filter((n) => !n.isRead).length;
    res.json({ notifications: rows, unreadCount });
  }
);

// PATCH /api/notifications/read-all — mark all notifications as read
router.patch(
  "/notifications/read-all",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    res.json({ ok: true });
  }
);

// PATCH /api/notifications/:id/read — mark a single notification as read
router.patch(
  "/notifications/:id/read",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const notifId = String(req.params.id);
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notifId), eq(notifications.userId, userId)))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    res.json({ notification: updated });
  }
);

export default router;
