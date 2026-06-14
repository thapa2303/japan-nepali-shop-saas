import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import {
  db,
  users,
  tenants,
  roles,
  userRoles,
  eq,
} from "@workspace/db";
import { RegisterBody, LoginBody, LoginResponse, AuthUserResponse } from "@workspace/api-zod";
import { authenticate } from "../middleware/authenticate.js";
import { signToken } from "../middleware/authenticate.js";
import { writeAuditLog } from "../lib/audit.js";

const router: IRouter = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

async function getUserRoles(userId: string): Promise<string[]> {
  const rows = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));
  return rows.map((r) => r.name);
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password, displayName, tenantName, tenantSlug } = parsed.data;

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()));

  if (existingUser) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const [existingTenant] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, tenantSlug));

  if (existingTenant) {
    res.status(409).json({ error: "Tenant slug already taken" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [tenant] = await db
    .insert(tenants)
    .values({ name: tenantName, slug: tenantSlug })
    .returning();

  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      name: displayName,
      tenantId: tenant.id,
    })
    .returning();

  const [merchantRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "MERCHANT"));

  if (merchantRole) {
    await db.insert(userRoles).values({
      userId: user.id,
      roleId: merchantRole.id,
    });
  }

  const [tenantAdminRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "TENANT_ADMIN"));

  if (tenantAdminRole) {
    await db.insert(userRoles).values({
      userId: user.id,
      roleId: tenantAdminRole.id,
    });
  }

  const userRoleNames = await getUserRoles(user.id);

  const token = signToken({
    sub: user.id,
    tenantId: user.tenantId,
    roles: userRoleNames,
  });

  res.cookie("token", token, COOKIE_OPTIONS);

  await writeAuditLog({
    req,
    userId: user.id,
    tenantId: tenant.id,
    action: "register",
    resource: "user",
    resourceId: user.id,
  });

  req.log.info({ userId: user.id, tenantId: tenant.id }, "User registered");

  const responseUser = AuthUserResponse.parse({
    id: user.id,
    email: user.email,
    displayName: user.name,
    tenantId: user.tenantId,
    roles: userRoleNames,
  });

  res.status(201).json(
    LoginResponse.parse({ user: responseUser, token }),
  );
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));

  if (!user || !user.isActive) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    await writeAuditLog({
      req,
      userId: user.id,
      tenantId: user.tenantId,
      action: "login_failed",
      resource: "user",
      resourceId: user.id,
    });
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const userRoleNames = await getUserRoles(user.id);

  const token = signToken({
    sub: user.id,
    tenantId: user.tenantId,
    roles: userRoleNames,
  });

  res.cookie("token", token, COOKIE_OPTIONS);

  await writeAuditLog({
    req,
    userId: user.id,
    tenantId: user.tenantId,
    action: "login",
    resource: "user",
    resourceId: user.id,
  });

  req.log.info({ userId: user.id }, "User logged in");

  const responseUser = AuthUserResponse.parse({
    id: user.id,
    email: user.email,
    displayName: user.name,
    tenantId: user.tenantId,
    roles: userRoleNames,
  });

  res.json(LoginResponse.parse({ user: responseUser, token }));
});

router.post("/auth/logout", authenticate, async (req, res): Promise<void> => {
  await writeAuditLog({
    req,
    action: "logout",
    resource: "user",
    resourceId: req.user!.id,
  });

  req.log.info({ userId: req.user!.id }, "User logged out");

  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", authenticate, async (req, res): Promise<void> => {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      tenantId: users.tenantId,
    })
    .from(users)
    .where(eq(users.id, req.user!.id));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const userRoleNames = await getUserRoles(user.id);

  res.json(
    AuthUserResponse.parse({
      id: user.id,
      email: user.email,
      displayName: user.name,
      tenantId: user.tenantId,
      roles: userRoleNames,
    }),
  );
});

export default router;
