import type { AgentRunContext, ConceptStrategyAgentOutput } from "@/types/agents";

export async function runConceptStrategyAgent(
  ctx: AgentRunContext,
): Promise<ConceptStrategyAgentOutput> {
  const hint = ctx.founderInput.cuisineOrConceptHint?.trim();
  const cuisineLine = hint
    ? `We anchored ideas around your hint (“${hint}”), but kept the concept executable for beginners.`
    : "Without a cuisine lock-in, the plan emphasizes a tight menu you can train quickly.";

  return {
    conceptSummary: `${ctx.selectedConcept.restaurantType}. ${cuisineLine} Goal: be unmistakably good at a small set of items before expanding.`,
    menuAnchorIdeas: [
      "One signature item that can be photographed, described in 5 words, and made reliably during rush",
      "One secondary item that uses the same prep station to reduce complexity",
      "One dietary-friendly option that doesn’t require a parallel kitchen",
    ],
    serviceModel:
      ctx.selectedConcept.id.includes("counter") || ctx.selectedConcept.restaurantType.includes("counter")
        ? "counter"
        : ctx.selectedConcept.restaurantType.toLowerCase().includes("wine")
          ? "full_service"
          : "fast_casual",
    differentiationAngles: [
      "Speed + kindness at the handoff (people remember how they felt when it was busy)",
      "A repeatable plating standard—photos should look like the real plate",
      "Transparent allergen handling and consistent portioning",
    ],
    nonNegotiablesForBeginners: [
      "Do not open with a large menu ‘to please everyone’",
      "Do not skip a written recipe spec for your top 5 items",
      "Do not assume your friends’ feedback equals market demand",
    ],
  };
}
