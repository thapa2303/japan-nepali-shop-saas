declare namespace Express {
  interface Request {
    user?: {
      id: string;
      tenantId: string | null;
      roles: string[];
    };
  }
}
