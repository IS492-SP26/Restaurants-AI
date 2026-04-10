import { buildConceptSuggestions } from "@/data/conceptTemplates";
import type { FounderInput, SuggestionsResponse } from "@/types/founder";

export function generateSuggestions(founderInput: FounderInput): SuggestionsResponse {
  return {
    concepts: buildConceptSuggestions(founderInput),
    normalizedInput: founderInput,
  };
}
