import { runConceptStrategyAgent } from "@/agents/conceptStrategyAgent";
import { runFinancialPlanningAgent } from "@/agents/financialPlanningAgent";
import { runLegalComplianceAgent } from "@/agents/legalComplianceAgent";
import { runManualComposerAgent } from "@/agents/manualComposerAgent";
import { runMarketingAgent } from "@/agents/marketingAgent";
import { runMarketResearchAgent } from "@/agents/marketResearchAgent";
import { runOperationsAgent } from "@/agents/operationsAgent";
import type {
  AgentExecutionDetails,
  AgentPipelineTrace,
  AgentRunContext,
  AgentRuntimeName,
  RestaurantStartupManual,
} from "@/types/agents";
import type { ConceptOption, FounderInput } from "@/types/founder";
import { makeDeterministicSeed } from "./deterministicSeed";
import { defaultAgentExecution } from "./ai/models";

function nowIso(): string {
  return new Date().toISOString();
}

async function mockAgentDelay(name: string): Promise<number> {
  const ms = 40 + (name.length % 5) * 15;
  await new Promise((r) => setTimeout(r, ms));
  return ms;
}

function executionFor(
  ctx: AgentRunContext,
  agentName: AgentRuntimeName,
): AgentExecutionDetails {
  return ctx.agentExecution[agentName] ?? defaultAgentExecution(agentName);
}

/**
 * Orchestrates multi-agent manual generation. Swap implementations inside
 * `run*Agent` modules (or inject providers here) when wiring real LLMs.
 */
export async function runRestaurantManualPipeline(
  founderInput: FounderInput,
  selectedConcept: ConceptOption,
): Promise<{ manual: RestaurantStartupManual; trace: AgentPipelineTrace[] }> {
  const ctx: AgentRunContext = {
    founderInput,
    selectedConcept,
    deterministicSeed: makeDeterministicSeed(founderInput, selectedConcept),
    agentExecution: {},
  };

  const trace: AgentPipelineTrace[] = [];

  const t0 = nowIso();
  const market = await runMarketResearchAgent(ctx);
  trace.push({
    agentName: "MarketResearchAgent",
    completedAtIso: t0,
    mockLatencyMs: await mockAgentDelay("MarketResearchAgent"),
    executionMode: executionFor(ctx, "MarketResearchAgent").mode,
    provider: executionFor(ctx, "MarketResearchAgent").provider,
    model: executionFor(ctx, "MarketResearchAgent").model,
    sourceCount: executionFor(ctx, "MarketResearchAgent").sourceCount,
  });

  const concept = await runConceptStrategyAgent(ctx);
  trace.push({
    agentName: "ConceptStrategyAgent",
    completedAtIso: nowIso(),
    mockLatencyMs: await mockAgentDelay("ConceptStrategyAgent"),
    executionMode: executionFor(ctx, "ConceptStrategyAgent").mode,
    provider: executionFor(ctx, "ConceptStrategyAgent").provider,
    model: executionFor(ctx, "ConceptStrategyAgent").model,
    sourceCount: executionFor(ctx, "ConceptStrategyAgent").sourceCount,
  });

  const financials = await runFinancialPlanningAgent(ctx);
  trace.push({
    agentName: "FinancialPlanningAgent",
    completedAtIso: nowIso(),
    mockLatencyMs: await mockAgentDelay("FinancialPlanningAgent"),
    executionMode: executionFor(ctx, "FinancialPlanningAgent").mode,
    provider: executionFor(ctx, "FinancialPlanningAgent").provider,
    model: executionFor(ctx, "FinancialPlanningAgent").model,
    sourceCount: executionFor(ctx, "FinancialPlanningAgent").sourceCount,
  });

  const legal = await runLegalComplianceAgent(ctx);
  trace.push({
    agentName: "LegalComplianceAgent",
    completedAtIso: nowIso(),
    mockLatencyMs: await mockAgentDelay("LegalComplianceAgent"),
    executionMode: executionFor(ctx, "LegalComplianceAgent").mode,
    provider: executionFor(ctx, "LegalComplianceAgent").provider,
    model: executionFor(ctx, "LegalComplianceAgent").model,
    sourceCount: executionFor(ctx, "LegalComplianceAgent").sourceCount,
  });

  const operations = await runOperationsAgent(ctx);
  trace.push({
    agentName: "OperationsAgent",
    completedAtIso: nowIso(),
    mockLatencyMs: await mockAgentDelay("OperationsAgent"),
    executionMode: executionFor(ctx, "OperationsAgent").mode,
    provider: executionFor(ctx, "OperationsAgent").provider,
    model: executionFor(ctx, "OperationsAgent").model,
    sourceCount: executionFor(ctx, "OperationsAgent").sourceCount,
  });

  const marketing = await runMarketingAgent(ctx);
  trace.push({
    agentName: "MarketingAgent",
    completedAtIso: nowIso(),
    mockLatencyMs: await mockAgentDelay("MarketingAgent"),
    executionMode: executionFor(ctx, "MarketingAgent").mode,
    provider: executionFor(ctx, "MarketingAgent").provider,
    model: executionFor(ctx, "MarketingAgent").model,
    sourceCount: executionFor(ctx, "MarketingAgent").sourceCount,
  });

  const playbook = await runManualComposerAgent({
    ctx,
    market,
    concept,
    financials,
    legal,
    operations,
    marketing,
  });
  trace.push({
    agentName: "ManualComposerAgent",
    completedAtIso: nowIso(),
    mockLatencyMs: await mockAgentDelay("ManualComposerAgent"),
    executionMode: executionFor(ctx, "ManualComposerAgent").mode,
    provider: executionFor(ctx, "ManualComposerAgent").provider,
    model: executionFor(ctx, "ManualComposerAgent").model,
    sourceCount: executionFor(ctx, "ManualComposerAgent").sourceCount,
  });

  const manual: RestaurantStartupManual = {
    generatedAtIso: nowIso(),
    founderInput,
    selectedConcept,
    agentRuns: [
      executionFor(ctx, "MarketResearchAgent"),
      executionFor(ctx, "ConceptStrategyAgent"),
      executionFor(ctx, "FinancialPlanningAgent"),
      executionFor(ctx, "LegalComplianceAgent"),
      executionFor(ctx, "OperationsAgent"),
      executionFor(ctx, "MarketingAgent"),
      executionFor(ctx, "ManualComposerAgent"),
    ],
    sections: {
      concept,
      customers: {
        profile: ctx.selectedConcept.targetCustomers,
        notes: [
          "Validate this profile with short interviews and mini surveys (not assumptions).",
          "Track who actually shows up in the first 30 days and adjust messaging.",
        ],
      },
      locationLogic: {
        recommendationNarrative: ctx.selectedConcept.recommendedLocationStyle,
        selectionCriteria: [
          "Foot traffic that matches your daypart plan",
          "Reasonable rent as % of realistic sales (use conservative sales estimates)",
          "Accessible utilities and landlord cooperation on inspections",
          "Compatible neighbors and noise constraints",
        ],
      },
      marketAndCompetitors: market,
      financials,
      legal,
      operations,
      marketing,
      playbook,
    },
  };

  return { manual, trace };
}
