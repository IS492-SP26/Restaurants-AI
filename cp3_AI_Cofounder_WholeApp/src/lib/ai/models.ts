import type {
  AgentCitation,
  AgentExecutionDetails,
  AgentRunContext,
  AgentRuntimeName,
} from "@/types/agents";

export type FineTunedAgentKey =
  | "marketing"
  | "financial"
  | "regulatory"
  | "operations";

const MODEL_ENV_BY_AGENT: Record<FineTunedAgentKey, string> = {
  marketing: "OPENAI_FINETUNED_MARKETING_MODEL",
  financial: "OPENAI_FINETUNED_FINANCIAL_MODEL",
  regulatory: "OPENAI_FINETUNED_REGULATORY_MODEL",
  operations: "OPENAI_FINETUNED_OPERATIONS_MODEL",
};

export function getFineTunedModel(agent: FineTunedAgentKey): string | null {
  const value = process.env[MODEL_ENV_BY_AGENT[agent]]?.trim();
  return value ? value : null;
}

export function getOpenAIApiKey(): string | null {
  const value = process.env.OPENAI_API_KEY?.trim();
  return value ? value : null;
}

export function recordAgentExecution(
  ctx: AgentRunContext,
  details: AgentExecutionDetails,
): void {
  ctx.agentExecution[details.agentName] = details;
}

export function defaultAgentExecution(
  agentName: AgentRuntimeName,
): AgentExecutionDetails {
  return {
    agentName,
    mode: "mock",
    provider: "local",
    sourceCount: 0,
    sources: [],
  };
}

export function makeCitation(
  sourceTitle: string,
  sourceNotes?: string,
): AgentCitation {
  return { sourceTitle, sourceNotes };
}
