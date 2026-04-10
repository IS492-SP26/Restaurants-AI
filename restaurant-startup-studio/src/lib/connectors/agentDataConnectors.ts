import {
  getFinancialKnowledgePack,
  getMarketingKnowledgePack,
  getOperationsKnowledgePack,
  getRegulatoryKnowledgePack,
} from "@/lib/ai/knowledgePacks";
import type { AgentRunContext } from "@/types/agents";

/**
 * Local connectors that adapt uploaded/static data packs into per-agent
 * context payloads. In production these can be replaced with DB, vector,
 * or third-party API backed connectors without changing the agent interfaces.
 */
export const agentDataConnectors = {
  marketing(ctx: AgentRunContext) {
    return getMarketingKnowledgePack(ctx);
  },
  financial(ctx: AgentRunContext) {
    return getFinancialKnowledgePack(ctx);
  },
  regulatory() {
    return getRegulatoryKnowledgePack();
  },
  operations() {
    return getOperationsKnowledgePack();
  },
};
