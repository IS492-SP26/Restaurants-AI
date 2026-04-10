import type { ConceptOption, FounderInput } from "@/types/founder";
import { normalizeFounderInput } from "./normalizeFounderInput";

function normalizeConceptOption(v: unknown): ConceptOption | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;

  const id = typeof o.id === "string" ? o.id.trim() : "";
  const restaurantType = typeof o.restaurantType === "string" ? o.restaurantType.trim() : "";
  const estimatedBudgetFit =
    typeof o.estimatedBudgetFit === "string" ? o.estimatedBudgetFit.trim() : "";
  const recommendedLocationStyle =
    typeof o.recommendedLocationStyle === "string" ? o.recommendedLocationStyle.trim() : "";
  const targetCustomers = typeof o.targetCustomers === "string" ? o.targetCustomers.trim() : "";
  const suggestedOpeningHours =
    typeof o.suggestedOpeningHours === "string" ? o.suggestedOpeningHours.trim() : "";
  const marketFitExplanation =
    typeof o.marketFitExplanation === "string" ? o.marketFitExplanation.trim() : "";

  if (
    !id ||
    !restaurantType ||
    !estimatedBudgetFit ||
    !recommendedLocationStyle ||
    !targetCustomers ||
    !suggestedOpeningHours ||
    !marketFitExplanation
  ) {
    return null;
  }

  return {
    id,
    restaurantType,
    estimatedBudgetFit,
    recommendedLocationStyle,
    targetCustomers,
    suggestedOpeningHours,
    marketFitExplanation,
  };
}

export function normalizeManualRequest(body: unknown): {
  founderInput: FounderInput;
  selectedConcept: ConceptOption;
} | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const founderInput = normalizeFounderInput(b.founderInput);
  const selectedConcept = normalizeConceptOption(b.selectedConcept);
  if (!founderInput || !selectedConcept) return null;

  return { founderInput, selectedConcept };
}
