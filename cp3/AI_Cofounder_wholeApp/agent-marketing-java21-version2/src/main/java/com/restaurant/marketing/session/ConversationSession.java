package com.restaurant.marketing.session;

import com.restaurant.marketing.model.StructuredAnalysis;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * ConversationSession — holds everything the agent remembers about
 * an ongoing conversation with one user.
 *
 * Stored in SessionStore keyed by sessionId.
 * The agent reads this before deciding which mode to use,
 * and writes to it after every response.
 */
public class ConversationSession {

    private final String sessionId;
    private final List<ChatMessage> messageHistory = new ArrayList<>();
    private StructuredAnalysis lastAnalysis;
    private String lastLocation;
    private Instant lastActivity;
    private int totalTurns = 0;

    public ConversationSession(String sessionId) {
        this.sessionId    = sessionId;
        this.lastActivity = Instant.now();
    }

    /** Add a message to the conversation history */
    public void addMessage(String role, String content) {
        messageHistory.add(new ChatMessage(role, content));
        lastActivity = Instant.now();
        totalTurns++;
    }

    /** Whether this session has a prior deep analysis stored */
    public boolean hasPriorAnalysis() {
        return lastAnalysis != null;
    }

    /** Format history as a readable string for injection into prompts */
    public String formatHistoryForPrompt() {
        if (messageHistory.isEmpty()) return "No prior conversation.";

        StringBuilder sb = new StringBuilder();
        // Only include last 6 messages to keep context window manageable
        List<ChatMessage> recent = messageHistory.size() > 6
                ? messageHistory.subList(messageHistory.size() - 6, messageHistory.size())
                : messageHistory;

        for (ChatMessage msg : recent) {
            sb.append(msg.role().equals("user") ? "User: " : "Agent: ");
            // Truncate very long agent responses in history
            String content = msg.content();
            if (content.length() > 500) {
                content = content.substring(0, 500) + "... [truncated]";
            }
            sb.append(content).append("\n\n");
        }
        return sb.toString().trim();
    }

    /** Build a short summary of the prior analysis for context injection */
    public String getPriorAnalysisSummary() {
        if (lastAnalysis == null) return "No prior analysis.";

        StringBuilder sb = new StringBuilder();
        if (lastAnalysis.getExecutiveSummary() != null) {
            sb.append("Summary: ").append(lastAnalysis.getExecutiveSummary()).append("\n");
        }
        if (lastAnalysis.getRecommendedDistrict() != null) {
            sb.append("Recommended district: ").append(lastAnalysis.getRecommendedDistrict()).append("\n");
        }
        if (lastAnalysis.getSuggestedConceptType() != null) {
            sb.append("Concept type: ").append(lastAnalysis.getSuggestedConceptType()).append("\n");
        }
        if (lastAnalysis.getPrimaryTargetDemographic() != null) {
            sb.append("Target demographic: ").append(lastAnalysis.getPrimaryTargetDemographic()).append("\n");
        }
        if (lastAnalysis.getCompetitorLandscape() != null
                && lastAnalysis.getCompetitorLandscape().getSummary() != null) {
            sb.append("Competitor landscape: ")
              .append(lastAnalysis.getCompetitorLandscape().getSummary()).append("\n");
        }
        if (lastAnalysis.getSeasonality() != null
                && lastAnalysis.getSeasonality().getSummary() != null) {
            sb.append("Seasonality: ")
              .append(lastAnalysis.getSeasonality().getSummary()).append("\n");
        }
        return sb.toString().trim();
    }

    // Getters and setters
    public String getSessionId()                          { return sessionId; }
    public List<ChatMessage> getMessageHistory()          { return messageHistory; }
    public StructuredAnalysis getLastAnalysis()           { return lastAnalysis; }
    public void setLastAnalysis(StructuredAnalysis v)     { this.lastAnalysis = v; this.lastActivity = Instant.now(); }
    public String getLastLocation()                       { return lastLocation; }
    public void setLastLocation(String v)                 { this.lastLocation = v; }
    public Instant getLastActivity()                      { return lastActivity; }
    public int getTotalTurns()                            { return totalTurns; }

    /** Immutable chat message record */
    public record ChatMessage(String role, String content) {}
}
