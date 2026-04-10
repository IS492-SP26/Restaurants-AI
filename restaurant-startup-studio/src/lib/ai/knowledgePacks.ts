import {
  CHAMPAIGN_AUDIENCE_HINTS,
  CHAMPAIGN_MARKET_SIGNALS,
} from "@/data/marketing/champaignMarketSnapshot";
import {
  BRAND_POSITIONING_HINTS,
  KPI_HINTS,
  MARKETING_PROCESS_HINTS,
} from "@/data/marketing/strategyFrameworks";
import {
  MARKETING_DATA_VERSION,
  MARKETING_UPLOAD_SOURCES,
} from "@/data/marketing/uploadsProvenance";
import { budgetLabel } from "@/data/budgetLabels";
import { CPI_U_US_CITY_ALL_ITEMS } from "@/data/financial/cpiSnapshot";
import { CE_SURVEY_ALL_UNITS } from "@/data/financial/consumerUnitsSnapshot";
import {
  FINANCIAL_DATA_VERSION,
  FINANCIAL_UPLOAD_SOURCES,
} from "@/data/financial/uploadsProvenance";
import {
  ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025,
  US_MEDIAN_WEEKLY_EARNINGS_2025,
} from "@/data/financial/laborMarketSnapshot";
import {
  FRB_H15_LATEST_PERIOD,
  FRB_H15_SNAPSHOT,
} from "@/data/financial/macroRates";
import { CHAMPAIGN_RULES } from "@/data/regulatoryKnowledgeBase";
import {
  CHAMPAIGN_FOOD_INSPECTION_BASELINE,
  CHAMPAIGN_PERSONNEL_POLICY_SIGNALS,
} from "@/data/operations/champaignOpsSnapshot";
import { NSF_EQUIPMENT_STANDARD_HINTS, QUALITY_SYSTEM_HINTS } from "@/data/operations/equipmentStandards";
import { BLS_FOOD_OCCUPATIONS_2024 } from "@/data/operations/laborSnapshot";
import {
  OPERATIONS_DATA_VERSION,
  OPERATIONS_UPLOAD_SOURCES,
} from "@/data/operations/uploadsProvenance";
import { RESTAURANT_WORKFLOW_PLAYBOOK } from "@/data/operations/workflowPlaybook";
import { makeCitation } from "./models";
import type { AgentCitation, AgentRunContext } from "@/types/agents";

export function getMarketingKnowledgePack(ctx: AgentRunContext): {
  knowledge: string;
  sources: AgentCitation[];
} {
  const knowledge = [
    `Marketing data pack version: ${MARKETING_DATA_VERSION}.`,
    `Uploaded source files: ${MARKETING_UPLOAD_SOURCES.join("; ")}.`,
    `Founder segment hint: ${ctx.founderInput.targetCustomerHint || CHAMPAIGN_AUDIENCE_HINTS[0]}.`,
    `Champaign market signals: ${CHAMPAIGN_MARKET_SIGNALS.campustownCompetition} ${CHAMPAIGN_MARKET_SIGNALS.downtownDiningDensity} ${CHAMPAIGN_MARKET_SIGNALS.practicalImplication}`,
    `Brand positioning hints: ${BRAND_POSITIONING_HINTS.join(" | ")}.`,
    `Marketing process hints: ${MARKETING_PROCESS_HINTS.join(" | ")}.`,
    `KPI hints: ${KPI_HINTS.join(" | ")}.`,
  ].join("\n");

  return {
    knowledge,
    sources: [
      makeCitation("Marketing uploads", MARKETING_UPLOAD_SOURCES.join("; ")),
      makeCitation("Champaign market snapshot", `Data pack v${MARKETING_DATA_VERSION}`),
      makeCitation("Marketing strategy frameworks", "Positioning, STP, KPI, and process hints"),
    ],
  };
}

export function getFinancialKnowledgePack(ctx: AgentRunContext): {
  knowledge: string;
  sources: AgentCitation[];
} {
  const budget = budgetLabel(ctx.founderInput.budgetRangeId);
  const champaign = ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025.champaign;
  const cook = ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025.cook;

  const knowledge = [
    `Financial data pack version: ${FINANCIAL_DATA_VERSION}.`,
    `Uploaded source files: ${FINANCIAL_UPLOAD_SOURCES.join("; ")}.`,
    `Budget band selected: ${budget}.`,
    `Macro snapshot (${FRB_H15_LATEST_PERIOD}): prime ${FRB_H15_SNAPSHOT.bankPrimeRate}%, fed funds ${FRB_H15_SNAPSHOT.federalFundsEffective}%, 10Y Treasury ${FRB_H15_SNAPSHOT.treasuryConstantMaturity10Y}%, 3M Treasury ${FRB_H15_SNAPSHOT.treasuryConstantMaturity3M}%.`,
    `CPI-U all items reference month ${CPI_U_US_CITY_ALL_ITEMS.referenceMonth}, index ${CPI_U_US_CITY_ALL_ITEMS.index198284}, y/y change ${CPI_U_US_CITY_ALL_ITEMS.percentChange12Month}%.`,
    `Consumer units income before taxes: 2021 ${CE_SURVEY_ALL_UNITS.incomeBeforeTaxesUsd["2021"]}, 2022 ${CE_SURVEY_ALL_UNITS.incomeBeforeTaxesUsd["2022"]}, 2023 ${CE_SURVEY_ALL_UNITS.incomeBeforeTaxesUsd["2023"]}, 2024 ${CE_SURVEY_ALL_UNITS.incomeBeforeTaxesUsd["2024"]}.`,
    `Illinois weekly wages: Champaign County ${champaign.avgWeeklyUsd}, Cook County ${cook.avgWeeklyUsd}. National weekly earnings ${US_MEDIAN_WEEKLY_EARNINGS_2025.allFullTime}. Service occupations men ${US_MEDIAN_WEEKLY_EARNINGS_2025.serviceOccupations.men}, women ${US_MEDIAN_WEEKLY_EARNINGS_2025.serviceOccupations.women}.`,
    "Use the uploaded startup worksheet framing for build-out, equipment, labor, marketing, soft costs, and reserve categories.",
  ].join("\n");

  return {
    knowledge,
    sources: [
      makeCitation("Financial uploads", FINANCIAL_UPLOAD_SOURCES.join("; ")),
      makeCitation("Macro rates snapshot", `Latest period ${FRB_H15_LATEST_PERIOD}`),
      makeCitation("Labor and spending snapshots", `Data pack v${FINANCIAL_DATA_VERSION}`),
    ],
  };
}

export function getRegulatoryKnowledgePack(): {
  knowledge: string;
  sources: AgentCitation[];
} {
  const groupedRules = CHAMPAIGN_RULES.map(
    (rule) =>
      `${rule.jurisdiction}/${rule.topic}: ${rule.requirement} (source: ${rule.sourceTitle}, ${rule.sourceCitation})`,
  ).join("\n");

  return {
    knowledge: [
      "Regulatory knowledge base extracted from uploaded local and federal files.",
      groupedRules,
    ].join("\n"),
    sources: [
      makeCitation("Regulatory knowledge base", "CUPHD, Champaign zoning, Illinois Part 750, FDA Food Code"),
    ],
  };
}

export function getOperationsKnowledgePack(): {
  knowledge: string;
  sources: AgentCitation[];
} {
  const knowledge = [
    `Operations data pack version: ${OPERATIONS_DATA_VERSION}.`,
    `Uploaded source files: ${OPERATIONS_UPLOAD_SOURCES.join("; ")}.`,
    `Inspection cadence baseline: Cat1 ${CHAMPAIGN_FOOD_INSPECTION_BASELINE.inspectionCadence.category1}; Cat2 ${CHAMPAIGN_FOOD_INSPECTION_BASELINE.inspectionCadence.category2}; Cat3 ${CHAMPAIGN_FOOD_INSPECTION_BASELINE.inspectionCadence.category3}.`,
    `Personnel policy signals: full-time minimum ${CHAMPAIGN_PERSONNEL_POLICY_SIGNALS.fullTimeHoursPerWeekMin} hours, part-time maximum ${CHAMPAIGN_PERSONNEL_POLICY_SIGNALS.partTimeHoursPerWeekMax} hours.`,
    `Labor market context: all food prep/serving ${BLS_FOOD_OCCUPATIONS_2024.medianAnnualWageAllFoodPrepServing}, cooks ${BLS_FOOD_OCCUPATIONS_2024.medianAnnualWageCooks}, bartenders ${BLS_FOOD_OCCUPATIONS_2024.medianAnnualWageBartenders}, waitstaff ${BLS_FOOD_OCCUPATIONS_2024.medianAnnualWageWaitersWaitresses}.`,
    `Workflow principles: ${RESTAURANT_WORKFLOW_PLAYBOOK.kitchenFlowPrinciples.join(" | ")}.`,
    `Core metrics: ${RESTAURANT_WORKFLOW_PLAYBOOK.coreMetrics.join(" | ")}.`,
    `Fast-week roadmap: ${RESTAURANT_WORKFLOW_PLAYBOOK.fastWeekRoadmap.join(" | ")}.`,
    `Equipment standards: ${NSF_EQUIPMENT_STANDARD_HINTS.join(" | ")}.`,
    `Quality system hints: ${QUALITY_SYSTEM_HINTS.join(" | ")}.`,
  ].join("\n");

  return {
    knowledge,
    sources: [
      makeCitation("Operations uploads", OPERATIONS_UPLOAD_SOURCES.join("; ")),
      makeCitation("Operations snapshot", `Data pack v${OPERATIONS_DATA_VERSION}`),
      makeCitation("Workflow and equipment standards", "BLS OOH, NSF, ISO-style process hints"),
    ],
  };
}
