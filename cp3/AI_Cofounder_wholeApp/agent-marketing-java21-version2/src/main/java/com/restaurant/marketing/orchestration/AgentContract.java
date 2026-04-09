package com.restaurant.marketing.orchestration;

import java.util.Map;

/**
 * AgentContract — the interface every sub-agent in the system implements.
 *
 * WHY THIS EXISTS:
 * When you build the Orchestrator later, it will hold a Map<String, AgentContract>
 * and call agents uniformly without knowing their internal implementation.
 * The Marketing Agent implements this now so zero refactoring is needed later.
 *
 * The Orchestrator will look like:
 *
 *   Map<String, AgentContract> agents = Map.of(
 *       "marketing",   marketingAgent,
 *       "operations",  operationsAgent,   // built by someone else
 *       "financial",   financialAgent,    // built by someone else
 *       "regulatory",  regulatoryAgent    // built by someone else
 *   );
 *
 *   AgentResponse result = agents.get("marketing").execute(request);
 */
public interface AgentContract {

    /**
     * Unique identifier for this agent.
     * The orchestrator uses this to route tasks and tag responses.
     */
    String getAgentId();

    /**
     * Describes what this agent can do.
     * The orchestrator can use this for dynamic task routing.
     */
    String getCapabilityDescription();

    /**
     * Main entry point. Takes a standardized request, returns a standardized response.
     * This is what the orchestrator calls.
     */
    AgentResponse execute(AgentRequest request);

    /**
     * Health check — lets the orchestrator know if this agent is ready.
     * Returns true if API keys are valid and external tools are reachable.
     */
    boolean isHealthy();
}
