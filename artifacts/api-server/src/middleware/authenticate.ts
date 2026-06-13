import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, usersTable, userRolesTable, rolesTable, eq } from "@workspace/db";

interface JwtPayload {
  sub: string;
  tenantId: string | null;
  roles: string[];
  tokenVersion: number;
  iat: number;
  exp: number;
}

function getJwtSecret(): string {
  return (
    process.env.SESSION_SECRET ??
    process.env.AUTH_SECRET ??
    "dev-secret-change-in-prod"
  );
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else if (req.cookies?.token) {
    token = req.cookies.token as string;
  }

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    }) as JwtPayload;
  } catch (err) {
    req.log.warn({ err }, "JWT verification failed");
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const [user] = await db
    .select({ id: usersTable.id, tokenVersion: usersTable.tokenVersion, tenantId: usersTable.tenantId, isActive: usersTable.isActive })
    .from(usersTable)
    .where(eq(usersTable.id, decoded.sub));

  if (!user || !user.isActive) {
    res.status(401).json({ error: "User not found or deactivated" });
    return;
  }

  if (user.tokenVersion !== decoded.tokenVersion) {
    res.status(401).json({ error: "Token has been invalidated" });
    return;
  }

  const roleRows = await db
    .select({ name: rolesTable.name })
    .from(userRolesTable)
    .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
    .where(eq(userRolesTable.userId, user.id));

  req.user = {
    id: user.id,
    tenantId: user.tenantId,
    roles: roleRows.map((r) => r.name),
    tokenVersion: user.tokenVersion,
  };

  next();
}
