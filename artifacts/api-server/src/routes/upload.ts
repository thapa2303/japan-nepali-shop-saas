import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { Storage } from "@google-cloud/storage";
import { authenticate } from "../middleware/authenticate.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, and webp images are allowed"));
    }
  },
});

function getExt(mimetype: string): string {
  if (mimetype === "image/jpeg" || mimetype === "image/jpg") return "jpg";
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  return "jpg";
}

router.post(
  "/upload",
  authenticate,
  (req: Request, res: Response, next: () => void) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "File too large. Max 5MB allowed." });
        return;
      }
      if (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : "Upload error" });
        return;
      }
      next();
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    const file = (req as unknown as { file?: Express.Multer.File }).file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded. Send a file in the 'file' field." });
      return;
    }

    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      res.status(500).json({ error: "Object storage not configured" });
      return;
    }

    const tenantCode = req.user?.tenantId ?? "platform";
    const ext = getExt(file.mimetype);
    const uuid = randomUUID();
    const type = (req.query.type as string) || "products";
    const objectPath = `tenants/${tenantCode}/${type}/${uuid}.${ext}`;

    try {
      const storage = new Storage();
      const bucket = storage.bucket(bucketId);
      const blob = bucket.file(objectPath);

      await blob.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        resumable: false,
      });

      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucketId}/${objectPath}`;

      res.json({ url: publicUrl, path: objectPath });
    } catch (err) {
      logger.error({ err }, "Failed to upload file to object storage");
      res.status(500).json({ error: "Failed to store file" });
    }
  }
);

export default router;
