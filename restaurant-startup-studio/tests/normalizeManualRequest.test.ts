import { describe, expect, it } from "vitest";
import { normalizeManualRequest } from "@/lib/normalizeManualRequest";

describe("normalizeManualRequest", () => {
  it("accepts a valid manual request", () => {
    const result = normalizeManualRequest({
      founderInput: {
        locationDescription: "Downtown Champaign",
        budgetRangeId: "200k_500k",
        cuisineOrConceptHint: "small plates",
        targetCustomerHint: "young professionals",
        businessGoalsText: "premium but approachable",
      },
      selectedConcept: {
        id: "concept_1",
        restaurantType: "Neighborhood small-plates & wine bar",
        estimatedBudgetFit: "~$200k – $500k",
        recommendedLocationStyle: "Downtown evening corridor",
        targetCustomers: "Young professionals and date-night diners",
        suggestedOpeningHours: "Tue-Sun 4pm-11pm",
        marketFitExplanation: "Fits evening traffic and higher check averages.",
      },
    });

    expect(result?.founderInput.locationDescription).toBe("Downtown Champaign");
    expect(result?.selectedConcept.restaurantType).toBe(
      "Neighborhood small-plates & wine bar",
    );
  });

  it("rejects requests with incomplete concept payloads", () => {
    const result = normalizeManualRequest({
      founderInput: {
        locationDescription: "Downtown Champaign",
        budgetRangeId: "200k_500k",
      },
      selectedConcept: {
        id: "concept_1",
      },
    });

    expect(result).toBeNull();
  });
});
