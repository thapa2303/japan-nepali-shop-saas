import type { Request } from "express";
import { db, auditLogsTable } from "@workspace/db";
import { logger } from "./logger.js";

interface AuditParams {
  req?: Request;
  userId?: string | null;
  tenantId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(params: AuditParams): Promise<void> {
  const { req, userId, tenantId, action, resource, resourceId, metadata } =
    params;

  const effectiveUserId = userId ?? req?.user?.id ?? null;
  const effectiveTenantId = tenantId ?? req?.user?.tenantId ?? null;
  const ipAddress =
    (req?.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req?.socket?.remoteAddress ??
    null;
  const userAgent = req?.headers["user-agent"] ?? null;

  try {
    await db.insert(auditLogsTable).values({
      userId: effectiveUserId ?? undefined,
      tenantId: effectiveTenantId ?? undefined,
      action,
      resource,
      resourceId: resourceId ?? undefined,
      metadata: metadata ? JSON.stringify(metadata) : "{}",
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
    });
  } catch (err) {
    logger.error({ err, action, resource }, "Failed to write audit log");
  }
}
