/**
 * User-provided startup constraints collected in the planning form.
 */
export type BudgetRangeId =
  | "under_75k"
  | "75k_200k"
  | "200k_500k"
  | "500k_plus";

export interface FounderInput {
  /** City, neighborhood, street, or target area description */
  locationDescription: string;
  budgetRangeId: BudgetRangeId;
  cuisineOrConceptHint?: string;
  targetCustomerHint?: string;
  /** Free-text goals such as fast profit, low risk, student market */
  businessGoalsText: string;
}

/**
 * One of three AI-suggested restaurant directions shown before manual generation.
 */
export interface ConceptOption {
  id: string;
  restaurantType: string;
  estimatedBudgetFit: string;
  recommendedLocationStyle: string;
  targetCustomers: string;
  suggestedOpeningHours: string;
  marketFitExplanation: string;
}

export interface SuggestionsResponse {
  concepts: ConceptOption[];
  /** Echo for traceability when generating the manual */
  normalizedInput: FounderInput;
}
