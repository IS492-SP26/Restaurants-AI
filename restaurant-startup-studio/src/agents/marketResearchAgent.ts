import type { AgentRunContext, MarketResearchAgentOutput } from "@/types/agents";

/**
 * Mock agent. Replace `runMarketResearchAgent` body with:
 * - calls to a web search / market data API
 * - structured outputs from an LLM (JSON schema / tool calls)
 */
export async function runMarketResearchAgent(
  ctx: AgentRunContext,
): Promise<MarketResearchAgentOutput> {
  void ctx.deterministicSeed;
  const loc = ctx.founderInput.locationDescription;
  const concept = ctx.selectedConcept.restaurantType;

  return {
    locationSummary: `Mock research assumes your area (“${loc}”) has mixed weekday and weekend traffic. Validate foot traffic counts, parking/transit, and evening demand with on-site visits—not listings photos alone.`,
    demandSignals: [
      "Look for stable lunch anchors (offices, campuses, or retail workers) if you need predictable weekday volume.",
      "Check whether delivery demand is already saturated for your style of cuisine within ~2 miles.",
      "If you rely on dinner, confirm that residential density or date-night destinations support the hours you want.",
    ],
    neighborhoodNotes: [
      "Talk to nearby owners off the record about rent step-ups, trash rules, and recurring street issues.",
      "Identify 2–3 ‘good enough’ competitor benchmarks for price, speed, and vibe—not just the fanciest place on the block.",
    ],
    competitorSnapshot: [
      {
        name: "Neighborhood staple (mock)",
        positioning: "Consistent classics, moderate prices, family-friendly pacing",
        approximatePriceTier: "mid",
      },
      {
        name: "Trend-forward indie spot (mock)",
        positioning: "Seasonal menu, higher check, smaller footprint",
        approximatePriceTier: "premium",
      },
      {
        name: "Chain adjacent fast option (mock)",
        positioning: "Speed and coupons; training and ops are highly standardized",
        approximatePriceTier: "budget",
      },
    ],
    cautions: [
      `Your selected direction (${concept}) will live or die on throughput and consistency during peak—mock framing only.`,
      "If alcohol is part of the plan, licensing lead times can reorder your entire pre-opening timeline.",
    ],
  };
}
