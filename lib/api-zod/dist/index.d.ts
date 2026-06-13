import { z } from "zod";
export declare const RegisterBody: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    tenantName: z.ZodString;
    tenantSlug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    displayName: string;
    tenantName: string;
    tenantSlug: string;
}, {
    email: string;
    password: string;
    displayName: string;
    tenantName: string;
    tenantSlug: string;
}>;
export type RegisterBody = z.infer<typeof RegisterBody>;
export declare const LoginBody: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginBody = z.infer<typeof LoginBody>;
export declare const AuthUserResponse: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    displayName: z.ZodString;
    tenantId: z.ZodNullable<z.ZodString>;
    roles: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    email: string;
    displayName: string;
    id: string;
    tenantId: string | null;
    roles: string[];
}, {
    email: string;
    displayName: string;
    id: string;
    tenantId: string | null;
    roles: string[];
}>;
export type AuthUserResponse = z.infer<typeof AuthUserResponse>;
export declare const LoginResponse: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        displayName: z.ZodString;
        tenantId: z.ZodNullable<z.ZodString>;
        roles: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        email: string;
        displayName: string;
        id: string;
        tenantId: string | null;
        roles: string[];
    }, {
        email: string;
        displayName: string;
        id: string;
        tenantId: string | null;
        roles: string[];
    }>;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user: {
        email: string;
        displayName: string;
        id: string;
        tenantId: string | null;
        roles: string[];
    };
    token: string;
}, {
    user: {
        email: string;
        displayName: string;
        id: string;
        tenantId: string | null;
        roles: string[];
    };
    token: string;
}>;
export type LoginResponse = z.infer<typeof LoginResponse>;
export declare const MessageResponse: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type MessageResponse = z.infer<typeof MessageResponse>;
export declare const ErrorResponse: z.ZodObject<{
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
}, {
    error: string;
}>;
export type ErrorResponse = z.infer<typeof ErrorResponse>;
//# sourceMappingURL=index.d.ts.map