import { z } from "zod";

export const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100),
  tenantName: z.string().min(1).max(100),
  tenantSlug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
});
export type RegisterBody = z.infer<typeof RegisterBody>;

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginBody = z.infer<typeof LoginBody>;

export const AuthUserResponse = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  tenantId: z.string().nullable(),
  roles: z.array(z.string()),
});
export type AuthUserResponse = z.infer<typeof AuthUserResponse>;

export const LoginResponse = z.object({
  user: AuthUserResponse,
  token: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponse>;

export const MessageResponse = z.object({
  message: z.string(),
});
export type MessageResponse = z.infer<typeof MessageResponse>;

export const ErrorResponse = z.object({
  error: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;
