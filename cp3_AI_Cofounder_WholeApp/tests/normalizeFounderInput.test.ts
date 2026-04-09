import { describe, expect, it } from "vitest";
import { normalizeFounderInput } from "@/lib/normalizeFounderInput";

describe("normalizeFounderInput", () => {
  it("trims fields and accepts a valid founder payload", () => {
    const result = normalizeFounderInput({
      locationDescription: "  Champaign Campustown  ",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "  bowls  ",
      targetCustomerHint: "  students  ",
      businessGoalsText: "  low risk and repeat lunch  ",
    });

    expect(result).toEqual({
      locationDescription: "Champaign Campustown",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "bowls",
      targetCustomerHint: "students",
      businessGoalsText: "low risk and repeat lunch",
    });
  });

  it("rejects invalid payloads", () => {
    expect(
      normalizeFounderInput({
        locationDescription: "",
        budgetRangeId: "not_real",
      }),
    ).toBeNull();
  });
});
