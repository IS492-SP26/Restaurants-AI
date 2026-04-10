import type { BudgetRangeId } from "@/types/founder";

export const BUDGET_RANGE_LABELS: Record<BudgetRangeId, string> = {
  under_75k: "Under ~$75k",
  "75k_200k": "~$75k – $200k",
  "200k_500k": "~$200k – $500k",
  "500k_plus": "$500k+",
};

export function budgetLabel(id: BudgetRangeId): string {
  return BUDGET_RANGE_LABELS[id];
}
