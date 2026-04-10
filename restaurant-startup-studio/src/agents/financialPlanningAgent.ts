import type { AgentRunContext, FinancialPlanningAgentOutput } from "@/types/agents";
import { budgetLabel } from "@/data/budgetLabels";
import { CPI_U_US_CITY_ALL_ITEMS } from "@/data/financial/cpiSnapshot";
import { CE_SURVEY_ALL_UNITS } from "@/data/financial/consumerUnitsSnapshot";
import {
  ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025,
  US_MEDIAN_WEEKLY_EARNINGS_2025,
} from "@/data/financial/laborMarketSnapshot";
import { FRB_H15_LATEST_PERIOD, FRB_H15_SNAPSHOT } from "@/data/financial/macroRates";
import { FINANCIAL_DATA_VERSION } from "@/data/financial/uploadsProvenance";
import { isChampaignUrbanaArea } from "@/lib/isChampaignUrbanaArea";
import { getFinancialKnowledgePack } from "@/lib/ai/knowledgePacks";
import { getFineTunedModel } from "@/lib/ai/models";
import { runStructuredAgentWithFallback } from "@/lib/ai/runStructuredAgent";
import {
  getFinancialAgentSystemPrompt,
  getFinancialAgentUserPrompt,
} from "@/lib/ai/agentPromptBuilders";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isBudgetBreakdown(
  value: unknown,
): value is FinancialPlanningAgentOutput["budgetBreakdown"] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return (
        typeof row.category === "string" &&
        typeof row.percentOrRange === "string" &&
        typeof row.notes === "string"
      );
    })
  );
}

function isFinancialPlanningAgentOutput(
  value: unknown,
): value is FinancialPlanningAgentOutput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.roughStartupRangeLabel === "string" &&
    isBudgetBreakdown(candidate.budgetBreakdown) &&
    isStringArray(candidate.cashFlowTips) &&
    typeof candidate.firstYearRealityCheck === "string"
  );
}

function buildFinancialFallback(
  ctx: AgentRunContext,
): FinancialPlanningAgentOutput {
  const band = budgetLabel(ctx.founderInput.budgetRangeId);
  const local = isChampaignUrbanaArea(ctx.founderInput.locationDescription);
  const cc = ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025.champaign;
  const cook = ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025.cook;

  const macroLine = `Macro snapshot (${FRB_H15_LATEST_PERIOD}, FRB H.15): bank prime ~${FRB_H15_SNAPSHOT.bankPrimeRate}%, 10Y Treasury ~${FRB_H15_SNAPSHOT.treasuryConstantMaturity10Y}%. CPI-U all items +${CPI_U_US_CITY_ALL_ITEMS.percentChange12Month}% y/y (Feb 2026 index ${CPI_U_US_CITY_ALL_ITEMS.index198284}, 1982–84=100).`;

  const wageLine = local
    ? `Champaign County Q3 2025 avg weekly wage ~$${cc.avgWeeklyUsd.toLocaleString()} (BLS county table); Cook County ~$${cook.avgWeeklyUsd.toLocaleString()} for comparison. National median full-time weekly earnings 2025: $${US_MEDIAN_WEEKLY_EARNINGS_2025.allFullTime.toLocaleString()} (BLS usual weekly earnings).`
    : `National median full-time weekly earnings 2025: $${US_MEDIAN_WEEKLY_EARNINGS_2025.allFullTime.toLocaleString()}. Service occupations (planning anchor): men ~$${US_MEDIAN_WEEKLY_EARNINGS_2025.serviceOccupations.men}/$${US_MEDIAN_WEEKLY_EARNINGS_2025.serviceOccupations.women} median weekly.`;

  const spendingLine = `Consumer units’ income before taxes averaged $${CE_SURVEY_ALL_UNITS.incomeBeforeTaxesUsd["2024"].toLocaleString()} in 2024 vs $${CE_SURVEY_ALL_UNITS.incomeBeforeTaxesUsd["2021"].toLocaleString()} in 2021 (CE Survey, all units)—context for local spending power, not your sales forecast.`;

  return {
    roughStartupRangeLabel: `${band}. ${macroLine} ${wageLine} Data pack v${FINANCIAL_DATA_VERSION} — still replace totals with your quotes, lease, and menu math.`,
    budgetBreakdown: [
      {
        category: "Build-out & signage",
        percentOrRange: "Often 25–45% for a first brick-and-mortar",
        notes:
          "Prior-tenant condition and landlord TI drive variance. Map spend to your Startup Costs Worksheet “Improvement costs” and “Rent” lines.",
      },
      {
        category: "Equipment & smallwares",
        percentOrRange: "Often 15–30%",
        notes:
          "Reliability beats aesthetics early. Align with worksheet “Supplies” / equipment columns and financing term vs useful life.",
      },
      {
        category: "Soft costs (design, permits, consultants)",
        percentOrRange: "Often 5–15%",
        notes: `Use worksheet “Professional services.” Higher inflation (+${CPI_U_US_CITY_ALL_ITEMS.percentChange12Month}% CPI y/y) increases nominal bids—re-quote often.`,
      },
      {
        category: "Pre-opening labor + training",
        percentOrRange: "Often 5–12%",
        notes: `Worksheet “Employees.” ${local ? `Budget hourly wages against Champaign County ~$${cc.avgWeeklyUsd}/wk average (all industries in source file), not only service medians.` : `Anchor to BLS service medians ~$${US_MEDIAN_WEEKLY_EARNINGS_2025.serviceOccupations.men}/$${US_MEDIAN_WEEKLY_EARNINGS_2025.serviceOccupations.women} weekly where relevant.`}`,
      },
      {
        category: "Marketing launch + PR basics",
        percentOrRange: "Often 3–8%",
        notes: "Worksheet “Marketing.” Keep a defined opening-week and first-30-days paid + organic plan.",
      },
      {
        category: "Operating reserve",
        percentOrRange: "Plan multiple months of fixed costs + payroll",
        notes: `Debt service is sensitive to prime (~${FRB_H15_SNAPSHOT.bankPrimeRate}% latest upload). Stress-test slower ramp; ${spendingLine}`,
      },
    ],
    cashFlowTips: [
      "Split fixed (rent, insurance, term loan) vs variable (COGS, hourly labor, utilities). Model a downside month with revenue −20–30% from base.",
      `Revisit prices and supplier contracts as CPI moves; your upload shows +${CPI_U_US_CITY_ALL_ITEMS.percentChange12Month}% on all items year over year (national retail context).`,
      `If you borrow, stress-test at prime near ${FRB_H15_SNAPSHOT.bankPrimeRate}% and shorter-term rates (e.g. 3M Treasury ~${FRB_H15_SNAPSHOT.treasuryConstantMaturity3M}%) from the same H.15 extract.`,
      "Weekly P&L for the first 90 days; tie break-even to covers per day or tickets per hour, not vibes.",
    ],
    firstYearRealityCheck:
      "Most independents need several quarters to stabilize. Use uploaded macro and wage data as guardrails, not guarantees—local lease, labor market, and concept drive outcomes. Update projections when you have signed quotes and a trailing 4-week sales trend.",
  };
}

export async function runFinancialPlanningAgent(
  ctx: AgentRunContext,
): Promise<FinancialPlanningAgentOutput> {
  const fallback = () => buildFinancialFallback(ctx);
  const pack = getFinancialKnowledgePack(ctx);

  return runStructuredAgentWithFallback({
    agentName: "FinancialPlanningAgent",
    ctx,
    model: getFineTunedModel("financial"),
    schemaName: "financial_agent_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roughStartupRangeLabel: { type: "string" },
        budgetBreakdown: {
          type: "array",
          minItems: 5,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: { type: "string" },
              percentOrRange: { type: "string" },
              notes: { type: "string" },
            },
            required: ["category", "percentOrRange", "notes"],
          },
        },
        cashFlowTips: {
          type: "array",
          minItems: 4,
          items: { type: "string" },
        },
        firstYearRealityCheck: { type: "string" },
      },
      required: [
        "roughStartupRangeLabel",
        "budgetBreakdown",
        "cashFlowTips",
        "firstYearRealityCheck",
      ],
    },
    systemPrompt: getFinancialAgentSystemPrompt(),
    userPrompt: getFinancialAgentUserPrompt(ctx),
    sources: pack.sources,
    validate: isFinancialPlanningAgentOutput,
    fallback,
  });
}
