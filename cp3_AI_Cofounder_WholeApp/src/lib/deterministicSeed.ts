import type { ConceptOption, FounderInput } from "@/types/founder";

export function makeDeterministicSeed(
  founderInput: FounderInput,
  selectedConcept: ConceptOption,
): string {
  return [
    founderInput.locationDescription,
    founderInput.budgetRangeId,
    founderInput.businessGoalsText,
    selectedConcept.id,
    selectedConcept.restaurantType,
  ].join("::");
}
