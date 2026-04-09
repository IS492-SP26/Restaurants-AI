import type { ConceptOption, FounderInput } from "./founder";

export type AgentRuntimeName =
  | "MarketResearchAgent"
  | "ConceptStrategyAgent"
  | "FinancialPlanningAgent"
  | "LegalComplianceAgent"
  | "OperationsAgent"
  | "MarketingAgent"
  | "ManualComposerAgent";

export interface AgentCitation {
  sourceTitle: string;
  sourceNotes?: string;
}

export interface AgentExecutionDetails {
  agentName: AgentRuntimeName;
  mode: "mock" | "fine_tuned";
  provider: "local" | "openai";
  model?: string;
  sourceCount: number;
  sources: AgentCitation[];
  statusNote?: string;
}

/**
 * Shared context passed into every agent. Later you can add real market snapshots,
 * embeddings, RAG chunks, etc. without changing agent function shapes.
 */
export interface AgentRunContext {
  founderInput: FounderInput;
  selectedConcept: ConceptOption;
  /** Stable seed for deterministic mock outputs (hash of input + concept id) */
  deterministicSeed: string;
  agentExecution: Partial<Record<AgentRuntimeName, AgentExecutionDetails>>;
}

/** Market Research Agent */
export interface MarketResearchAgentOutput {
  locationSummary: string;
  demandSignals: string[];
  neighborhoodNotes: string[];
  competitorSnapshot: {
    name: string;
    positioning: string;
    approximatePriceTier: "budget" | "mid" | "premium";
  }[];
  cautions: string[];
}

/** Concept Strategy Agent */
export interface ConceptStrategyAgentOutput {
  conceptSummary: string;
  menuAnchorIdeas: string[];
  serviceModel: "counter" | "fast_casual" | "full_service" | "hybrid";
  differentiationAngles: string[];
  nonNegotiablesForBeginners: string[];
}

/** Financial Planning Agent */
export interface FinancialPlanningAgentOutput {
  roughStartupRangeLabel: string;
  budgetBreakdown: { category: string; percentOrRange: string; notes: string }[];
  cashFlowTips: string[];
  firstYearRealityCheck: string;
}

/** Legal & Compliance Agent (high-level checklist only — not legal advice) */
export interface LegalComplianceAgentOutput {
  disclaimer: string;
  entityTypesToDiscussWithPro: string[];
  permitChecklist: { item: string; whyItMatters: string }[];
  insuranceBasics: string[];
}

/** Operations Agent */
export interface OperationsAgentOutput {
  staffingPlan: { role: string; headcountAtOpen: string; hiringNotes: string }[];
  supplierCategories: { category: string; sourcingTips: string }[];
  equipmentHighlights: { area: string; starterItems: string }[];
  dailyOpsRhythm: string[];
}

/** Marketing Agent */
export interface MarketingAgentOutput {
  brandPositioningStatement: string;
  namingGuidance: string;
  preLaunchChecklist: string[];
  launchWeekPlaybook: string[];
  ongoingMarketingIdeas: string[];
}

/** Final composer — beginner-friendly playbook */
export interface ManualComposerOutput {
  title: string;
  howToUseThisPlaybook: string;
  stepByStepPhases: {
    phaseTitle: string;
    timelineHint: string;
    actions: string[];
  }[];
  preOpeningChecklist: string[];
  openingTimeline: { weekOffset: string; milestone: string; ownerTasks: string[] }[];
  riskWarnings: string[];
  beginnerMistakes: string[];
}

/** Full manual returned to the UI and future export/PDF flows */
export interface RestaurantStartupManual {
  generatedAtIso: string;
  founderInput: FounderInput;
  selectedConcept: ConceptOption;
  agentRuns: AgentExecutionDetails[];
  sections: {
    concept: ConceptStrategyAgentOutput;
    customers: { profile: string; notes: string[] };
    locationLogic: { recommendationNarrative: string; selectionCriteria: string[] };
    marketAndCompetitors: MarketResearchAgentOutput;
    financials: FinancialPlanningAgentOutput;
    legal: LegalComplianceAgentOutput;
    operations: OperationsAgentOutput;
    marketing: MarketingAgentOutput;
    playbook: ManualComposerOutput;
  };
}

/** For debugging / future observability UI */
export interface AgentPipelineTrace {
  agentName: AgentRuntimeName;
  completedAtIso: string;
  mockLatencyMs: number;
  executionMode: "mock" | "fine_tuned";
  provider: "local" | "openai";
  model?: string;
  sourceCount: number;
}
