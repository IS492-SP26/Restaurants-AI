package com.restaurant.marketing.agent;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.restaurant.marketing.config.MarketingConfig;
import com.restaurant.marketing.context.ChampaignContextProvider;
import com.restaurant.marketing.orchestration.AgentContract;
import com.restaurant.marketing.orchestration.AgentRequest;
import com.restaurant.marketing.orchestration.AgentResponse;
import com.restaurant.marketing.orchestration.AgentResponse.ResponseMode;
import com.restaurant.marketing.prompt.MarketingToolDefinitions;
import com.restaurant.marketing.session.ConversationSession;
import com.restaurant.marketing.session.QueryClassifier;
import com.restaurant.marketing.session.QueryClassifier.QueryMode;
import com.restaurant.marketing.session.SessionStore;
import com.restaurant.marketing.tools.GroqClient;
import com.restaurant.marketing.tools.ToolDispatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class MarketingAgent implements AgentContract {

    private static final Logger log = LoggerFactory.getLogger(MarketingAgent.class);
    private static final String AGENT_ID = "marketing";

    private final GroqClient groqClient;
    private final ToolDispatcher toolDispatcher;
    private final ChampaignContextProvider contextProvider;
    private final MarketingConfig config;
    private final ResponseParser responseParser;
    private final SessionStore sessionStore;
    private final QueryClassifier classifier;
    private final ObjectMapper mapper;

    public MarketingAgent(
            GroqClient groqClient,
            ToolDispatcher toolDispatcher,
            ChampaignContextProvider contextProvider,
            MarketingConfig config,
            ResponseParser responseParser,
            SessionStore sessionStore,
            QueryClassifier classifier) {
        this.groqClient      = groqClient;
        this.toolDispatcher  = toolDispatcher;
        this.contextProvider = contextProvider;
        this.config          = config;
        this.responseParser  = responseParser;
        this.sessionStore    = sessionStore;
        this.classifier      = classifier;
        this.mapper          = groqClient.getMapper();
    }

    @Override
    public String getAgentId() { return AGENT_ID; }

    @Override
    public String getCapabilityDescription() {
        return "Analyzes local restaurant market conditions for Champaign-Urbana, IL. " +
               "Supports deep research analysis and conversational follow-up questions.";
    }

    @Override
    public AgentResponse execute(AgentRequest request) {
        log.info("MarketingAgent.execute() | session={} | query={}",
                request.getSessionId(), request.getUserQuery());

        try {
            // Load or create session
            ConversationSession session = sessionStore.getOrCreate(request.getSessionId());

            // Store user's location if provided
            if (request.getLocation() != null) {
                session.setLastLocation(request.getLocation());
            }

            // Record user message in history
            session.addMessage("user", request.getUserQuery());

            // Classify: does this need fresh research or a conversational reply?
            QueryMode mode = classifier.classify(request.getUserQuery(), session);
            log.info("Query mode: {} | session={}", mode, request.getSessionId());

            AgentResponse response;

            if (mode == QueryMode.NEW_RESEARCH) {
                response = runDeepResearch(request, session);
            } else {
                response = runConversationalReply(request, session);
            }

            // Record agent response in history
            String agentReply = response.getConversationalReply() != null
                    ? response.getConversationalReply()
                    : summarizeSectionsForHistory(response);
            session.addMessage("agent", agentReply);

            return response;

        } catch (Exception e) {
            log.error("MarketingAgent failed | session={} | error={}",
                    request.getSessionId(), e.getMessage(), e);
            return AgentResponse.builder()
                    .agentId(AGENT_ID)
                    .sessionId(request.getSessionId())
                    .success(false)
                    .errorMessage("Marketing analysis failed: " + e.getMessage())
                    .sections(List.of())
                    .sharedData(Map.of())
                    .build();
        }
    }

    @Override
    public boolean isHealthy() {
        if (config.getGroq().getApiKey() == null || config.getGroq().getApiKey().isBlank()) {
            log.warn("MarketingAgent health check FAILED: API key not configured");
            return false;
        }
        return true;
    }

    // =========================================================================
    // Mode 1 — Deep research
    // =========================================================================

    private AgentResponse runDeepResearch(AgentRequest request, ConversationSession session)
            throws Exception {

        log.info("Mode 1: running deep research | session={}", request.getSessionId());

        String enrichedQuery = enrichQueryWithContext(request);
        String rawAnalysis   = runAgentLoop(enrichedQuery);

        ResponseParser.ParseResult parsed = responseParser.parse(rawAnalysis);

        // Store the structured analysis in session for future follow-ups
        if (parsed.structuredAnalysis() != null) {
            session.setLastAnalysis(parsed.structuredAnalysis());
        }

        return AgentResponse.builder()
                .agentId(AGENT_ID)
                .sessionId(request.getSessionId())
                .success(true)
                .responseMode(ResponseMode.STRUCTURED)
                .sections(parsed.sections())
                .sharedData(parsed.sharedData())
                .build();
    }

    // =========================================================================
    // Mode 2 — Conversational reply
    // =========================================================================

    private AgentResponse runConversationalReply(AgentRequest request, ConversationSession session)
            throws Exception {

        log.info("Mode 2: conversational reply | session={}", request.getSessionId());

        String prompt = buildConversationalPrompt(request.getUserQuery(), session);

        String reply = groqClient.complete(
                contextProvider.buildSystemPrompt(),
                prompt,
                config.getGroq().getPrimaryModel()
        );

        return AgentResponse.builder()
                .agentId(AGENT_ID)
                .sessionId(request.getSessionId())
                .success(true)
                .responseMode(ResponseMode.CONVERSATIONAL)
                .conversationalReply(reply)
                .sections(List.of())
                .sharedData(Map.of())
                .build();
    }

    private String buildConversationalPrompt(String userQuery, ConversationSession session) {
        StringBuilder sb = new StringBuilder();

        sb.append("You are continuing a conversation about opening a restaurant in ")
          .append(session.getLastLocation() != null ? session.getLastLocation() : "Champaign, IL")
          .append(".\n\n");

        if (session.hasPriorAnalysis()) {
            sb.append("=== PRIOR RESEARCH FINDINGS ===\n");
            sb.append(session.getPriorAnalysisSummary());
            sb.append("\n\n");
        }

        if (!session.getMessageHistory().isEmpty()) {
            sb.append("=== CONVERSATION SO FAR ===\n");
            sb.append(session.formatHistoryForPrompt());
            sb.append("\n\n");
        }

        sb.append("=== USER'S FOLLOW-UP QUESTION ===\n");
        sb.append(userQuery);
        sb.append("\n\n");
        sb.append("""
                Answer conversationally and specifically. Draw on the prior research findings above.
                Be helpful and natural — this is a conversation, not a formal report.
                Don't repeat the full structured analysis — just answer what was asked.
                If you need to reference a specific finding, quote it briefly and build on it.
                Keep your response focused and 2-4 paragraphs maximum.
                """);

        return sb.toString();
    }

    // =========================================================================
    // Agent loop (Mode 1 only)
    // =========================================================================

    private String runAgentLoop(String userQuery) throws Exception {
        ArrayNode messageHistory = mapper.createArrayNode();
        messageHistory.addObject().put("role", "user").put("content", userQuery);

        int loopCount = 0;
        int maxLoops  = config.getAgent().getMaxToolLoops();

        while (loopCount < maxLoops) {
            loopCount++;
            log.debug("Agent loop iteration {}/{}", loopCount, maxLoops);

            JsonNode response = groqClient.completeWithTools(
                    contextProvider.buildSystemPrompt(),
                    messageHistory,
                    MarketingToolDefinitions.ALL_TOOLS_JSON,
                    config.getGroq().getPrimaryModel()
            );

            JsonNode choice      = response.path("choices").path(0);
            String finishReason  = choice.path("finish_reason").asText("");
            JsonNode message     = choice.path("message");

            messageHistory.add(message);

            if ("stop".equals(finishReason) || "end_turn".equals(finishReason)) {
                log.info("Research loop complete after {} iterations — synthesizing", loopCount);
                return requestFinalAnswer(messageHistory);
            }

            if ("tool_calls".equals(finishReason)) {
                JsonNode toolCalls = message.path("tool_calls");
                if (!toolCalls.isArray() || toolCalls.isEmpty()) break;

                for (JsonNode toolCall : toolCalls) {
                    String toolCallId = toolCall.path("id").asText();
                    String toolName   = toolCall.path("function").path("name").asText();
                    String toolArgs   = toolCall.path("function").path("arguments").asText("{}");

                    log.info("Tool: {} | args: {}", toolName, toolArgs);
                    String toolResult = toolDispatcher.dispatch(toolName, toolArgs);

                    ObjectNode toolMsg = mapper.createObjectNode();
                    toolMsg.put("role",         "tool");
                    toolMsg.put("tool_call_id", toolCallId);
                    toolMsg.put("name",         toolName);
                    toolMsg.put("content",      toolResult);
                    messageHistory.add(toolMsg);
                }
                continue;
            }

            String content = message.path("content").asText("");
            if (!content.isBlank()) return content;
            break;
        }

        log.warn("Loop hit max iterations — forcing synthesis");
        return requestFinalAnswer(messageHistory);
    }

    private String requestFinalAnswer(ArrayNode messageHistory) throws Exception {
        String synthesisPrompt = """
                Based on all the research above, produce your final marketing analysis
                as a single JSON object. Output ONLY valid JSON — no markdown, no preamble.

                {
                  "executiveSummary": "2-3 sentence overview",
                  "recommendedDistrict": "e.g. Downtown Champaign",
                  "suggestedConceptType": "e.g. Korean BBQ",
                  "primaryTargetDemographic": "e.g. UIUC students 18-24",
                  "secondaryTargetDemographic": "string or null",
                  "competitorLandscape": {
                    "competitionLevel": "HIGH | MEDIUM | LOW",
                    "estimatedDirectCompetitors": 0,
                    "namedCompetitors": ["string"],
                    "marketGaps": ["string"],
                    "summary": "string"
                  },
                  "brandPositioning": {
                    "positioningStatement": "string",
                    "priceTier": "BUDGET | MID_RANGE | UPSCALE",
                    "recommendedAvgCheckUsd": 0.0,
                    "differentiators": ["string"],
                    "recommendedChannels": ["string"]
                  },
                  "laborMarket": {
                    "availability": "TIGHT | MODERATE | ABUNDANT",
                    "estimatedFohWageUsd": 0.0,
                    "estimatedBohWageUsd": 0.0,
                    "bestHiringWindow": "string",
                    "challenges": ["string"]
                  },
                  "seasonality": {
                    "studentDependencyHigh": true,
                    "summerRevenueDropEstimate": 0.0,
                    "peakMonths": ["string"],
                    "lowMonths": ["string"],
                    "revenueSpikingEvents": ["string"],
                    "summary": "string"
                  },
                  "orchestratorSignals": {
                    "modelSummerRevenueDip": true,
                    "highStaffTurnoverExpected": true,
                    "highCompetitionMarket": false,
                    "recommendedMinSeats": 0,
                    "recommendedMaxSeats": 0,
                    "liquorLicenseRecommended": false,
                    "analysisConfidence": "HIGH | MEDIUM | LOW"
                  }
                }
                """;

        messageHistory.addObject().put("role", "user").put("content", synthesisPrompt);

        JsonNode response = groqClient.completeWithTools(
                contextProvider.buildSystemPrompt(),
                messageHistory,
                MarketingToolDefinitions.ALL_TOOLS_JSON,
                config.getGroq().getPrimaryModel()
        );

        return response.path("choices").path(0)
                .path("message").path("content").asText("");
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private String enrichQueryWithContext(AgentRequest request) {
        StringBuilder enriched = new StringBuilder(request.getUserQuery());

        Object budget = request.getContextValue("financial.budget", null);
        if (budget != null) {
            enriched.append(String.format(
                    "\n\nBudget context from Financial Agent: approximately $%s.", budget));
        }
        Object zoning = request.getContextValue("regulatory.zoningDistrict", null);
        if (zoning != null) {
            enriched.append(String.format(
                    "\n\nRegulatory context: zoned %s.", zoning));
        }
        Object seating = request.getContextValue("operations.seatingCapacity", null);
        if (seating != null) {
            enriched.append(String.format(
                    "\n\nOperations context: seating capacity %s.", seating));
        }
        return enriched.toString();
    }

    private String summarizeSectionsForHistory(AgentResponse response) {
        if (response.getSections() == null || response.getSections().isEmpty()) {
            return "Analysis complete.";
        }
        StringBuilder sb = new StringBuilder("Analysis complete. Sections: ");
        response.getSections().forEach(s -> sb.append(s.getTitle()).append(", "));
        return sb.toString();
    }
}
