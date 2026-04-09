import type { AgentRunContext, OperationsAgentOutput } from "@/types/agents";
import {
  CHAMPAIGN_FOOD_INSPECTION_BASELINE,
} from "@/data/operations/champaignOpsSnapshot";
import { BLS_FOOD_OCCUPATIONS_2024 } from "@/data/operations/laborSnapshot";
import { RESTAURANT_WORKFLOW_PLAYBOOK } from "@/data/operations/workflowPlaybook";
import { NSF_EQUIPMENT_STANDARD_HINTS, QUALITY_SYSTEM_HINTS } from "@/data/operations/equipmentStandards";
import { OPERATIONS_DATA_VERSION } from "@/data/operations/uploadsProvenance";
import { isChampaignUrbanaArea } from "@/lib/isChampaignUrbanaArea";
import { getOperationsKnowledgePack } from "@/lib/ai/knowledgePacks";
import { getFineTunedModel } from "@/lib/ai/models";
import { runStructuredAgentWithFallback } from "@/lib/ai/runStructuredAgent";
import {
  getOperationsAgentSystemPrompt,
  getOperationsAgentUserPrompt,
} from "@/lib/ai/agentPromptBuilders";

function isOpsRowArray<T extends string>(
  value: unknown,
  requiredKeys: readonly T[],
): boolean {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return requiredKeys.every((key) => typeof row[key] === "string");
    })
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isOperationsAgentOutput(
  value: unknown,
): value is OperationsAgentOutput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    isOpsRowArray(candidate.staffingPlan, [
      "role",
      "headcountAtOpen",
      "hiringNotes",
    ]) &&
    isOpsRowArray(candidate.supplierCategories, ["category", "sourcingTips"]) &&
    isOpsRowArray(candidate.equipmentHighlights, ["area", "starterItems"]) &&
    isStringArray(candidate.dailyOpsRhythm)
  );
}

function buildOperationsFallback(ctx: AgentRunContext): OperationsAgentOutput {
  const isLocal = isChampaignUrbanaArea(ctx.founderInput.locationDescription);
  const text = [
    ctx.selectedConcept.restaurantType,
    ctx.founderInput.cuisineOrConceptHint ?? "",
    ctx.founderInput.businessGoalsText,
  ]
    .join(" ")
    .toLowerCase();

  const fullService =
    text.includes("wine") || text.includes("full") || text.includes("bar");

  return {
    staffingPlan: fullService
      ? [
          {
            role: "GM / owner-operator",
            headcountAtOpen: "1",
            hiringNotes:
              "Owns scheduling, vendor issues, and guest recovery early on. Use daily pre-shift huddles and weekly KPI review.",
          },
          {
            role: "Kitchen lead",
            headcountAtOpen: "1",
            hiringNotes:
              "Must enforce specs, pars, and food safety culture. Critical/major corrections should close fast before they compound.",
          },
          {
            role: "Line + prep",
            headcountAtOpen: "1–2",
            hiringNotes:
              `Cross-training reduces single points of failure. Entry labor market context: cooks median ~$${BLS_FOOD_OCCUPATIONS_2024.medianAnnualWageCooks.toLocaleString()}/yr (BLS).`,
          },
          {
            role: "Front-of-house",
            headcountAtOpen: "2–4",
            hiringNotes:
              `Start with a strong trainer shift and written service steps. FOH labor context: waitstaff median ~$${BLS_FOOD_OCCUPATIONS_2024.medianAnnualWageWaitersWaitresses.toLocaleString()}/yr.`,
          },
        ]
      : [
          {
            role: "Owner-operator / shift lead",
            headcountAtOpen: "1–2",
            hiringNotes:
              "You need coverage for opens, closes, and rush without burning out. Treat 30+ hr roles as full-time structure for policy consistency.",
          },
          {
            role: "Kitchen production",
            headcountAtOpen: "1–2",
            hiringNotes:
              "Train one station deeply before adding complexity. Use a 7-day workflow reset plan with day-by-day ownership.",
          },
          {
            role: "Cashier / expo / runner",
            headcountAtOpen: "1–2 (may overlap roles)",
            hiringNotes:
              "Clear responsibilities prevent duplicated motion during peaks. Use POS/KDS routing to reduce verbal relay errors.",
          },
        ],
    supplierCategories: [
      {
        category: "Broadline distributor or local wholesalers",
        sourcingTips:
          "Compare minimums, delivery windows, and credit terms; do not optimize only for price. Add a backup vendor for top-20 SKUs.",
      },
      {
        category: "Produce & specialty",
        sourcingTips:
          "Keep backup vendor list for volatile items and apply FIFO + date labeling to reduce spoilage.",
      },
      {
        category: "Packaging & disposables",
        sourcingTips:
          "Match packaging to real order mix (dine-in vs. takeout) and track waste reason codes weekly.",
      },
    ],
    equipmentHighlights: [
      {
        area: "Cold holding",
        starterItems:
          `Reach-in fridge/freezer sized for pars; thermometers + labeling discipline. Prefer equipment aligned with ${NSF_EQUIPMENT_STANDARD_HINTS[3]} and ${NSF_EQUIPMENT_STANDARD_HINTS[5]}.`,
      },
      {
        area: "Cook line",
        starterItems:
          `Prioritize minimum set that can execute top sellers at peak. Validate line against ${NSF_EQUIPMENT_STANDARD_HINTS[2]}.`,
      },
      {
        area: "Dish / three-compartment sink compliance",
        starterItems:
          `Confirm health authority layout expectations before buying used equipment. Include warewashing assumptions from ${NSF_EQUIPMENT_STANDARD_HINTS[1]}.`,
      },
    ],
    dailyOpsRhythm: [
      `Open checklist: equipment temps, sanitizer setup, prep status, register/POS readiness${isLocal ? `; remember local permit cadence (Cat 1 inspected ${CHAMPAIGN_FOOD_INSPECTION_BASELINE.inspectionCadence.category1})` : ""}.`,
      "Mid-shift: line tasting, ticket times, 86 alerts, waste log, FOH/BOH communication check.",
      `Close: deep clean targets, waste reasons, tomorrow prep list, cash handling discipline, and corrective-action log (${QUALITY_SYSTEM_HINTS[2]}).`,
      `Continuous improvement: run PDCA loop weekly using metrics (${RESTAURANT_WORKFLOW_PLAYBOOK.coreMetrics.slice(0, 3).join(", ")}). Data pack v${OPERATIONS_DATA_VERSION}.`,
    ],
  };
}

export async function runOperationsAgent(
  ctx: AgentRunContext,
): Promise<OperationsAgentOutput> {
  const fallback = () => buildOperationsFallback(ctx);
  const pack = getOperationsKnowledgePack();

  return runStructuredAgentWithFallback({
    agentName: "OperationsAgent",
    ctx,
    model: getFineTunedModel("operations"),
    schemaName: "operations_agent_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        staffingPlan: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              role: { type: "string" },
              headcountAtOpen: { type: "string" },
              hiringNotes: { type: "string" },
            },
            required: ["role", "headcountAtOpen", "hiringNotes"],
          },
        },
        supplierCategories: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: { type: "string" },
              sourcingTips: { type: "string" },
            },
            required: ["category", "sourcingTips"],
          },
        },
        equipmentHighlights: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              area: { type: "string" },
              starterItems: { type: "string" },
            },
            required: ["area", "starterItems"],
          },
        },
        dailyOpsRhythm: {
          type: "array",
          minItems: 4,
          items: { type: "string" },
        },
      },
      required: [
        "staffingPlan",
        "supplierCategories",
        "equipmentHighlights",
        "dailyOpsRhythm",
      ],
    },
    systemPrompt: getOperationsAgentSystemPrompt(),
    userPrompt: getOperationsAgentUserPrompt(ctx),
    sources: pack.sources,
    validate: isOperationsAgentOutput,
    fallback,
  });
}
