import type { Request, Response, NextFunction } from "express";

export type AppRole = "PSA" | "TENANT_ADMIN" | "MERCHANT" | "CUSTOMER";

const ROLE_HIERARCHY: Record<AppRole, number> = {
  PSA: 4,
  TENANT_ADMIN: 3,
  MERCHANT: 2,
  CUSTOMER: 1,
};

function meetsMinimumRole(userRoles: string[], minimumRole: AppRole): boolean {
  const minLevel = ROLE_HIERARCHY[minimumRole];
  return userRoles.some((r) => {
    const level = ROLE_HIERARCHY[r as AppRole];
    return level !== undefined && level >= minLevel;
  });
}

export function authorize(...requiredRoles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const hasRole = requiredRoles.some((role) =>
      meetsMinimumRole(req.user!.roles, role),
    );

    if (!hasRole) {
      req.log.warn(
        { userId: req.user.id, requiredRoles, userRoles: req.user.roles },
        "Authorization failed",
      );
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}

export function authorizeExact(...requiredRoles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const hasRole = requiredRoles.some((role) =>
      req.user!.roles.includes(role),
    );

    if (!hasRole) {
      req.log.warn(
        { userId: req.user.id, requiredRoles, userRoles: req.user.roles },
        "Authorization failed (exact)",
      );
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
