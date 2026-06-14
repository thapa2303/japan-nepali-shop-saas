import { db, subscriptionPlans, eq } from "@workspace/db";

export type PlanLimits = {
  id: string;
  tier: string;
  name: string;
  monthlyPrice: number;
  productLimit: number;
  commissionRate: number;
  features: string[];
  highlighted: boolean;
};

const DEFAULT_PLAN: PlanLimits = {
  id: "",
  tier: "starter",
  name: "Starter",
  monthlyPrice: 2980,
  productLimit: 30,
  commissionRate: 8,
  features: [],
  highlighted: false,
};

let _cache: PlanLimits[] | null = null;
let _cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function loadPlans(): Promise<PlanLimits[]> {
  if (_cache && Date.now() < _cacheExpiry) return _cache;
  const rows = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, true))
    .orderBy(subscriptionPlans.monthlyPrice);
  _cache = rows.map((r) => ({
    id: r.id,
    tier: r.tier,
    name: r.name,
    monthlyPrice: r.monthlyPrice,
    productLimit: r.productLimit,
    commissionRate: r.commissionRate,
    features: r.features ?? [],
    highlighted: r.highlighted,
  }));
  _cacheExpiry = Date.now() + CACHE_TTL_MS;
  return _cache;
}

export async function getAllPlans(): Promise<PlanLimits[]> {
  return loadPlans();
}

export async function getPlanForTier(tier: string): Promise<PlanLimits> {
  const plans = await loadPlans();
  return plans.find((p) => p.tier === tier) ?? DEFAULT_PLAN;
}

export function invalidatePlanCache(): void {
  _cache = null;
  _cacheExpiry = 0;
}
