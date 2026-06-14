import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";
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

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

    const ext = getExt(file.mimetype);
    const uuid = randomUUID();
    const type = (req.query.type as string) || "products";
    const filename = `${uuid}.${ext}`;
    const subdir = path.join(UPLOADS_DIR, type);

    if (!fs.existsSync(subdir)) {
      fs.mkdirSync(subdir, { recursive: true });
    }

    const filePath = path.join(subdir, filename);

    try {
      fs.writeFileSync(filePath, file.buffer);

      const publicUrl = `/uploads/${type}/${filename}`;

      logger.info({ path: filePath }, "File uploaded to local disk");
      res.json({ url: publicUrl, path: filePath });
    } catch (err) {
      logger.error({ err }, "Failed to save uploaded file");
      res.status(500).json({ error: "Failed to store file" });
    }
  }
);

export default router;
