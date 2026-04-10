import type { BudgetRangeId, FounderInput } from "@/types/founder";

const BUDGET_IDS = new Set<BudgetRangeId>([
  "under_75k",
  "75k_200k",
  "200k_500k",
  "500k_plus",
]);

function asBudgetRangeId(v: unknown): BudgetRangeId | null {
  return typeof v === "string" && BUDGET_IDS.has(v as BudgetRangeId)
    ? (v as BudgetRangeId)
    : null;
}

export function normalizeFounderInput(body: unknown): FounderInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const locationDescription =
    typeof b.locationDescription === "string" ? b.locationDescription.trim() : "";
  const budgetRangeId = asBudgetRangeId(b.budgetRangeId);

  if (!locationDescription || !budgetRangeId) return null;

  const cuisineOrConceptHint =
    typeof b.cuisineOrConceptHint === "string" ? b.cuisineOrConceptHint.trim() : undefined;
  const targetCustomerHint =
    typeof b.targetCustomerHint === "string" ? b.targetCustomerHint.trim() : undefined;
  const businessGoalsText =
    typeof b.businessGoalsText === "string" ? b.businessGoalsText.trim() : "";

  return {
    locationDescription,
    budgetRangeId,
    cuisineOrConceptHint: cuisineOrConceptHint || undefined,
    targetCustomerHint: targetCustomerHint || undefined,
    businessGoalsText,
  };
}
