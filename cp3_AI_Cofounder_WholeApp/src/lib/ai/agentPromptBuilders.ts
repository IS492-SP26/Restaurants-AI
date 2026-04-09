import type { AgentRunContext } from "@/types/agents";
import { agentDataConnectors } from "@/lib/connectors/agentDataConnectors";

export function getMarketingAgentSystemPrompt(): string {
  return "You are the fine-tuned marketing agent for a restaurant startup planning app. Use the provided uploaded-data pack as grounding. Produce practical, concrete, beginner-friendly restaurant marketing guidance. Return strict JSON only.";
}

export function getMarketingAgentUserPrompt(ctx: AgentRunContext): string {
  const pack = agentDataConnectors.marketing(ctx);
  return [
    `Founder location: ${ctx.founderInput.locationDescription}`,
    `Budget band: ${ctx.founderInput.budgetRangeId}`,
    `Cuisine hint: ${ctx.founderInput.cuisineOrConceptHint ?? "none"}`,
    `Target customer hint: ${ctx.founderInput.targetCustomerHint ?? "none"}`,
    `Business goals: ${ctx.founderInput.businessGoalsText}`,
    `Selected concept: ${ctx.selectedConcept.restaurantType}`,
    `Selected concept target customers: ${ctx.selectedConcept.targetCustomers}`,
    `Selected concept location style: ${ctx.selectedConcept.recommendedLocationStyle}`,
    `Knowledge pack:\n${pack.knowledge}`,
  ].join("\n\n");
}

export function getFinancialAgentSystemPrompt(): string {
  return "You are the fine-tuned financial planning agent for a restaurant startup planning app. Use only the uploaded financial data pack and the founder context provided. Produce conservative, beginner-friendly financial planning guidance. Return strict JSON only.";
}

export function getFinancialAgentUserPrompt(ctx: AgentRunContext): string {
  const pack = agentDataConnectors.financial(ctx);
  return [
    `Founder location: ${ctx.founderInput.locationDescription}`,
    `Budget band: ${ctx.founderInput.budgetRangeId}`,
    `Cuisine hint: ${ctx.founderInput.cuisineOrConceptHint ?? "none"}`,
    `Business goals: ${ctx.founderInput.businessGoalsText}`,
    `Selected concept: ${ctx.selectedConcept.restaurantType}`,
    `Knowledge pack:\n${pack.knowledge}`,
  ].join("\n\n");
}

export function getRegulatoryAgentSystemPrompt(): string {
  return "You are the fine-tuned regulatory agent for a restaurant startup planning app. Use the uploaded legal and regulatory knowledge pack to generate a cautious, high-level compliance checklist. Do not claim legal certainty. Return strict JSON only.";
}

export function getRegulatoryAgentUserPrompt(ctx: AgentRunContext): string {
  const pack = agentDataConnectors.regulatory();
  return [
    `Founder location: ${ctx.founderInput.locationDescription}`,
    `Budget band: ${ctx.founderInput.budgetRangeId}`,
    `Cuisine hint: ${ctx.founderInput.cuisineOrConceptHint ?? "none"}`,
    `Business goals: ${ctx.founderInput.businessGoalsText}`,
    `Selected concept: ${ctx.selectedConcept.restaurantType}`,
    `Selected concept target customers: ${ctx.selectedConcept.targetCustomers}`,
    `Knowledge pack:\n${pack.knowledge}`,
  ].join("\n\n");
}

export function getOperationsAgentSystemPrompt(): string {
  return "You are the fine-tuned operations agent for a restaurant startup planning app. Use the uploaded operations data pack and stay operationally concrete, beginner-friendly, and realistic. Return strict JSON only.";
}

export function getOperationsAgentUserPrompt(ctx: AgentRunContext): string {
  const pack = agentDataConnectors.operations();
  return [
    `Founder location: ${ctx.founderInput.locationDescription}`,
    `Budget band: ${ctx.founderInput.budgetRangeId}`,
    `Cuisine hint: ${ctx.founderInput.cuisineOrConceptHint ?? "none"}`,
    `Business goals: ${ctx.founderInput.businessGoalsText}`,
    `Selected concept: ${ctx.selectedConcept.restaurantType}`,
    `Selected concept opening hours: ${ctx.selectedConcept.suggestedOpeningHours}`,
    `Knowledge pack:\n${pack.knowledge}`,
  ].join("\n\n");
}
