import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool, { schema });

export * from "./schema/index.js";

export {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  and,
  or,
  not,
  sql,
  asc,
  desc,
  inArray,
  notInArray,
  isNull,
  isNotNull,
  count,
  sum,
  avg,
  min,
  max,
} from "drizzle-orm";
