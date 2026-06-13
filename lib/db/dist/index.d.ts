import { Pool } from "pg";
import * as schema from "./schema/index.js";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export * from "./schema/index.js";
export { eq, ne, gt, gte, lt, lte, and, or, not, sql, asc, desc, inArray, notInArray, isNull, isNotNull, count, sum, avg, min, max, } from "drizzle-orm";
//# sourceMappingURL=index.d.ts.map