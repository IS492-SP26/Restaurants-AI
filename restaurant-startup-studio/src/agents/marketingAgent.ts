import type { AgentRunContext, MarketingAgentOutput } from "@/types/agents";
import { isChampaignUrbanaArea } from "@/lib/isChampaignUrbanaArea";
import { CHAMPAIGN_AUDIENCE_HINTS, CHAMPAIGN_MARKET_SIGNALS } from "@/data/marketing/champaignMarketSnapshot";
import { BRAND_POSITIONING_HINTS, KPI_HINTS, MARKETING_PROCESS_HINTS } from "@/data/marketing/strategyFrameworks";
import { MARKETING_DATA_VERSION } from "@/data/marketing/uploadsProvenance";
import { getMarketingKnowledgePack } from "@/lib/ai/knowledgePacks";
import { getFineTunedModel } from "@/lib/ai/models";
import { runStructuredAgentWithFallback } from "@/lib/ai/runStructuredAgent";
import {
  getMarketingAgentSystemPrompt,
  getMarketingAgentUserPrompt,
} from "@/lib/ai/agentPromptBuilders";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isMarketingAgentOutput(value: unknown): value is MarketingAgentOutput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.brandPositioningStatement === "string" &&
    typeof candidate.namingGuidance === "string" &&
    isStringArray(candidate.preLaunchChecklist) &&
    isStringArray(candidate.launchWeekPlaybook) &&
    isStringArray(candidate.ongoingMarketingIdeas)
  );
}

function buildMarketingFallback(ctx: AgentRunContext): MarketingAgentOutput {
  const loc = ctx.founderInput.locationDescription;
  const local = isChampaignUrbanaArea(loc);
  const segment = ctx.founderInput.targetCustomerHint?.trim()
    ? ctx.founderInput.targetCustomerHint.trim()
    : local
      ? CHAMPAIGN_AUDIENCE_HINTS[0]
      : "people within a 10-15 minute travel radius";

  const nichePromise = `${ctx.selectedConcept.restaurantType} done with consistent quality, quick ordering, and a distinct signature experience.`;

  return {
    brandPositioningStatement: `For ${segment} near ${loc}, we are the ${ctx.selectedConcept.restaurantType.toLowerCase()} brand known for ${nichePromise} ${local ? `Local market signal: ${CHAMPAIGN_MARKET_SIGNALS.campustownCompetition}` : ""} ${BRAND_POSITIONING_HINTS[0]}.`,
    namingGuidance:
      "Pick a name you can own on maps, easy to spell after hearing once, and aligned to one clear niche promise. Keep tone and visual identity consistent across menu, signage, photos, and social touchpoints.",
    preLaunchChecklist: [
      "Claim Google Business Profile early; match address and hours precisely",
      "Define one target segment and one primary value proposition before campaign spend (STP first)",
      "Professional photos of 5 hero items + storefront + one team/process shot",
      "Soft opening for neighbors and stress-test line speed + customer messaging",
      "Train staff on one-sentence answers: what you’re known for + dietary basics",
      ...(local ? ["Build a competitor map for Campustown vs Downtown corridors and pick one beachhead zone"] : []),
    ],
    launchWeekPlaybook: [
      "Day 1–2: prioritize throughput + order accuracy over promotion complexity",
      "Day 3–5: ask for reviews from delighted guests; close recurring complaint loops immediately",
      "Day 5–7: run one simple signature bundle and track redemption + repeat intent",
      "End of week: review KPI board (awareness, acquisition, repeat, ROI) and reallocate budget",
    ],
    ongoingMarketingIdeas: [
      "Weekly regulars ritual (quiet-day perk, loyalty mechanic, birthday trigger)",
      "Monthly local partnership with student orgs, offices, or community events with clear offer tracking",
      "Short-form content showing prep/process honesty, not only polished visuals",
      `Run a weekly marketing review using ${KPI_HINTS.slice(0, 3).join(", ")}.`,
      `Quarterly reset using ${MARKETING_PROCESS_HINTS[0]} and ${MARKETING_PROCESS_HINTS[1]} (data pack v${MARKETING_DATA_VERSION}).`,
    ],
  };
}

export async function runMarketingAgent(ctx: AgentRunContext): Promise<MarketingAgentOutput> {
  const fallback = () => buildMarketingFallback(ctx);
  const pack = getMarketingKnowledgePack(ctx);

  return runStructuredAgentWithFallback({
    agentName: "MarketingAgent",
    ctx,
    model: getFineTunedModel("marketing"),
    schemaName: "marketing_agent_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        brandPositioningStatement: { type: "string" },
        namingGuidance: { type: "string" },
        preLaunchChecklist: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
        },
        launchWeekPlaybook: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
        },
        ongoingMarketingIdeas: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
        },
      },
      required: [
        "brandPositioningStatement",
        "namingGuidance",
        "preLaunchChecklist",
        "launchWeekPlaybook",
        "ongoingMarketingIdeas",
      ],
    },
    systemPrompt: getMarketingAgentSystemPrompt(),
    userPrompt: getMarketingAgentUserPrompt(ctx),
    sources: pack.sources,
    validate: isMarketingAgentOutput,
    fallback,
  });
}
