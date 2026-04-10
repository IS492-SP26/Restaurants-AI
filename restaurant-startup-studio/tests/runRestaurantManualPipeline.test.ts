import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runRestaurantManualPipeline } from "@/lib/runAgentPipeline";
import type { ConceptOption, FounderInput } from "@/types/founder";

const ENV_KEYS = [
  "OPENAI_API_KEY",
  "OPENAI_FINETUNED_MARKETING_MODEL",
  "OPENAI_FINETUNED_FINANCIAL_MODEL",
  "OPENAI_FINETUNED_REGULATORY_MODEL",
  "OPENAI_FINETUNED_OPERATIONS_MODEL",
] as const;

const envSnapshot = new Map<string, string | undefined>();

describe("runRestaurantManualPipeline", () => {
  beforeEach(() => {
    for (const key of ENV_KEYS) {
      envSnapshot.set(key, process.env[key]);
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = envSnapshot.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    envSnapshot.clear();
  });

  it("returns a complete manual, trace, and agent run metadata", async () => {
    const founderInput: FounderInput = {
      locationDescription: "Champaign Campustown near Green Street",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "healthy bowls and soup",
      targetCustomerHint: "students and campus staff",
      businessGoalsText: "low risk first business with repeat lunch demand",
    };

    const selectedConcept: ConceptOption = {
      id: "concept_counter_bowl_0",
      restaurantType: "Fast assembly counter / grain-bowl & soup spot",
      estimatedBudgetFit: "~$75k – $200k",
      recommendedLocationStyle: "High-foot-traffic weekday lunch corridor",
      targetCustomers: "Students, office workers, and locals seeking quick lunch",
      suggestedOpeningHours: "Mon-Fri 10:30am-8pm",
      marketFitExplanation: "Simple menu and repeatable lunch demand fit the budget.",
    };

    const { manual, trace } = await runRestaurantManualPipeline(
      founderInput,
      selectedConcept,
    );

    expect(manual.selectedConcept.restaurantType).toBe(selectedConcept.restaurantType);
    expect(manual.sections.financials.budgetBreakdown.length).toBeGreaterThan(0);
    expect(manual.sections.legal.permitChecklist.length).toBeGreaterThan(0);
    expect(manual.sections.operations.staffingPlan.length).toBeGreaterThan(0);
    expect(manual.sections.marketing.launchWeekPlaybook.length).toBeGreaterThan(0);
    expect(manual.agentRuns).toHaveLength(7);
    expect(trace).toHaveLength(7);
    expect(trace.every((entry) => entry.executionMode === "mock")).toBe(true);
  });
});
