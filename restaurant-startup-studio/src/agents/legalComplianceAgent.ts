import type { AgentRunContext, LegalComplianceAgentOutput } from "@/types/agents";
import { CHAMPAIGN_RULES } from "@/data/regulatoryKnowledgeBase";
import { isChampaignUrbanaArea } from "@/lib/isChampaignUrbanaArea";
import { getRegulatoryKnowledgePack } from "@/lib/ai/knowledgePacks";
import { getFineTunedModel } from "@/lib/ai/models";
import { runStructuredAgentWithFallback } from "@/lib/ai/runStructuredAgent";
import {
  getRegulatoryAgentSystemPrompt,
  getRegulatoryAgentUserPrompt,
} from "@/lib/ai/agentPromptBuilders";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isPermitChecklist(
  value: unknown,
): value is LegalComplianceAgentOutput["permitChecklist"] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return typeof row.item === "string" && typeof row.whyItMatters === "string";
    })
  );
}

function isLegalComplianceAgentOutput(
  value: unknown,
): value is LegalComplianceAgentOutput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.disclaimer === "string" &&
    isStringArray(candidate.entityTypesToDiscussWithPro) &&
    isPermitChecklist(candidate.permitChecklist) &&
    isStringArray(candidate.insuranceBasics)
  );
}

function hasAlcoholSignal(text: string): boolean {
  const s = text.toLowerCase();
  return (
    s.includes("bar") ||
    s.includes("wine") ||
    s.includes("beer") ||
    s.includes("cocktail") ||
    s.includes("alcohol") ||
    s.includes("liquor")
  );
}

function hasSpecialProcessSignal(text: string): boolean {
  const s = text.toLowerCase();
  return (
    s.includes("sous vide") ||
    s.includes("vacuum") ||
    s.includes("reduced oxygen") ||
    s.includes("raw fish") ||
    s.includes("sushi") ||
    s.includes("cure") ||
    s.includes("ferment")
  );
}

function buildLegalFallback(ctx: AgentRunContext): LegalComplianceAgentOutput {
  const loc = ctx.founderInput.locationDescription;
  const champaignContext = isChampaignUrbanaArea(loc);
  const contextBlob = [
    ctx.founderInput.locationDescription,
    ctx.founderInput.cuisineOrConceptHint ?? "",
    ctx.founderInput.businessGoalsText,
    ctx.selectedConcept.restaurantType,
  ].join(" ");
  const alcoholFlag = hasAlcoholSignal(contextBlob);
  const specialProcessFlag = hasSpecialProcessSignal(contextBlob);

  const champaignPermitItems = champaignContext
    ? [
        {
          item: "[Before buildout] CUPHD operating permit + posting",
          whyItMatters:
            `Required for lawful operation and public posting (source: ${CHAMPAIGN_RULES.find((r) => r.id === "cuphd-permit-required")?.sourceCitation}).`,
        },
        {
          item: "[Before opening + annual] Renewal calendar (Apr 30) + manager cert posting",
          whyItMatters:
            `Missing renewal or posting can trigger compliance action (source: ${CHAMPAIGN_RULES.find((r) => r.id === "cuphd-permit-renewal")?.sourceCitation}).`,
        },
        {
          item: "[Before lease signature] Site zoning and use authorization",
          whyItMatters:
            `Use/build actions must align with Champaign zoning and approved plans (source: ${CHAMPAIGN_RULES.find((r) => r.id === "champaign-zoning-compliance")?.sourceCitation}).`,
        },
      ]
    : [];

  return {
    disclaimer:
      `This is educational planning content, not legal advice. Requirements vary by city, county, and state (your described area: “${loc}”). Confirm everything with qualified attorneys, CPAs, and local authorities.`,
    entityTypesToDiscussWithPro: [
      "LLC vs. S-corp / partnership structuring (liability + taxes)",
      "Operating agreement / shareholder expectations if you have co-founders",
      "Trademark basics for your brand name before printing menus",
      ...(alcoholFlag
        ? ["Liquor-license compatible entity/ownership structure and BASSET obligations"]
        : []),
    ],
    permitChecklist: [
      ...champaignPermitItems,
      {
        item: "[Before opening] Business license / registration",
        whyItMatters: "Establishes lawful operation and tax accounts.",
      },
      {
        item: "[Before opening] Food service / health permit path",
        whyItMatters:
          "Inspection timing can gate your opening date. FDA/Illinois baseline includes TCS, sanitation, and operational controls.",
      },
      {
        item: "[Before opening] Building + fire + occupancy approvals as applicable",
        whyItMatters: "Landlords may require certificates before you receive keys or open doors.",
      },
      {
        item: "[Early if applicable] Alcohol licensing",
        whyItMatters: "Lead times and community process can dominate the timeline.",
      },
      {
        item: "[Before first hire] Employer obligations (workers comp, payroll, posters)",
        whyItMatters: "Hiring before setup creates compliance exposure.",
      },
      {
        item: "[Pre-opening inspection gate] Water/plumbing and handwashing readiness",
        whyItMatters:
          `Approved water source, backflow prevention, and handwashing sink placement are enforceable items (source: ${CHAMPAIGN_RULES.find((r) => r.id === "fda-approved-water")?.sourceCitation}; ${CHAMPAIGN_RULES.find((r) => r.id === "fda-handwash-sink-location")?.sourceCitation}).`,
      },
      {
        item: "[Before launching special process] HACCP/variance packet (if applicable)",
        whyItMatters:
          `Specialized operations can require documented HACCP plans and recordkeeping (source: ${CHAMPAIGN_RULES.find((r) => r.id === "fda-haccp-plan-contents")?.sourceCitation}).`,
      },
      ...(alcoholFlag
        ? [
            {
              item: "[Red flag] Confirm alcohol pathway now (local + state)",
              whyItMatters:
                "Your concept signals alcohol service; delayed liquor licensing can block opening even when buildout is complete.",
            },
          ]
        : []),
      ...(specialProcessFlag
        ? [
            {
              item: "[Red flag] Specialized process review (sous vide/ROP/raw service)",
              whyItMatters:
                "Your concept signals processes that may trigger additional HACCP/variance scrutiny and stricter record retention.",
            },
          ]
        : []),
      {
        item: "[Ongoing] Compliance cadence and recordkeeping",
        whyItMatters:
          "Run weekly temp/sanitation checks, keep training logs, and prepare records for routine inspection and corrective actions.",
      },
    ],
    insuranceBasics: [
      "General liability",
      "Property / inventory coverage appropriate for your lease",
      "Workers compensation once you hire",
      "Product liability coverage aligned to menu risk and service model",
    ],
  };
}

export async function runLegalComplianceAgent(
  ctx: AgentRunContext,
): Promise<LegalComplianceAgentOutput> {
  const fallback = () => buildLegalFallback(ctx);
  const pack = getRegulatoryKnowledgePack();

  return runStructuredAgentWithFallback({
    agentName: "LegalComplianceAgent",
    ctx,
    model: getFineTunedModel("regulatory"),
    schemaName: "regulatory_agent_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disclaimer: { type: "string" },
        entityTypesToDiscussWithPro: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
        },
        permitChecklist: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              item: { type: "string" },
              whyItMatters: { type: "string" },
            },
            required: ["item", "whyItMatters"],
          },
          minItems: 6,
        },
        insuranceBasics: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
        },
      },
      required: [
        "disclaimer",
        "entityTypesToDiscussWithPro",
        "permitChecklist",
        "insuranceBasics",
      ],
    },
    systemPrompt: getRegulatoryAgentSystemPrompt(),
    userPrompt: getRegulatoryAgentUserPrompt(ctx),
    sources: pack.sources,
    validate: isLegalComplianceAgentOutput,
    fallback,
  });
}
