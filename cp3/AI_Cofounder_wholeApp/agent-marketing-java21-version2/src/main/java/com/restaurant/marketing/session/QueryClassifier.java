package com.restaurant.marketing.session;

import com.restaurant.marketing.config.MarketingConfig;
import com.restaurant.marketing.tools.GroqClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * QueryClassifier — decides whether a user message needs a full
 * research loop (Mode 1) or a conversational reply (Mode 2).
 *
 * Uses a single fast LLM call — no tools, minimal tokens.
 * Falls back to Mode 1 if anything goes wrong, so the user
 * always gets a response.
 */
@Component
public class QueryClassifier {

    private static final Logger log = LoggerFactory.getLogger(QueryClassifier.class);

    public enum QueryMode { NEW_RESEARCH, FOLLOW_UP }

    private final GroqClient groqClient;
    private final MarketingConfig config;

    public QueryClassifier(GroqClient groqClient, MarketingConfig config) {
        this.groqClient = groqClient;
        this.config     = config;
    }

    /**
     * Classify the user's message as new research or a follow-up.
     *
     * @param userQuery       What the user typed
     * @param session         Current conversation session
     * @return                QueryMode.NEW_RESEARCH or QueryMode.FOLLOW_UP
     */
    public QueryMode classify(String userQuery, ConversationSession session) {
        // No prior analysis → always new research
        if (!session.hasPriorAnalysis()) {
            log.debug("Classifier: no prior analysis → NEW_RESEARCH");
            return QueryMode.NEW_RESEARCH;
        }

        // Very short messages are almost always follow-ups
        if (userQuery.trim().split("\\s+").length <= 3) {
            log.debug("Classifier: short query → FOLLOW_UP");
            return QueryMode.FOLLOW_UP;
        }

        // Ask the LLM to classify
        try {
            String prompt = buildClassifierPrompt(userQuery, session);
            String response = groqClient.complete(
                    CLASSIFIER_SYSTEM,
                    prompt,
                    config.getGroq().getFastModel()
            );

            String cleaned = response.trim().toUpperCase();
            log.debug("Classifier raw response: '{}'", cleaned);

            if (cleaned.contains("NEW")) {
                return QueryMode.NEW_RESEARCH;
            } else {
                return QueryMode.FOLLOW_UP;
            }

        } catch (Exception e) {
            // Safe fallback — if classifier fails, run full research
            log.warn("Classifier failed, defaulting to NEW_RESEARCH: {}", e.getMessage());
            return QueryMode.NEW_RESEARCH;
        }
    }

    private String buildClassifierPrompt(String userQuery, ConversationSession session) {
        return String.format("""
                Prior analysis was done for: %s
                Prior analysis covered: %s
                
                Conversation turns so far: %d
                
                New message: "%s"
                
                Is this a NEW research request or a FOLLOW_UP?
                Reply with exactly one word: NEW or FOLLOW_UP
                """,
                session.getLastLocation() != null ? session.getLastLocation() : "unknown location",
                session.getPriorAnalysisSummary().substring(0,
                        Math.min(200, session.getPriorAnalysisSummary().length())),
                session.getTotalTurns(),
                userQuery
        );
    }

    private static final String CLASSIFIER_SYSTEM = """
            You classify restaurant market research questions.
            
            NEW: A completely new restaurant concept, new location, or entirely new market question
            that requires fresh research. Keywords: "analyze", "research", "what about [new place]",
            "run analysis", "start over", "different concept".
            
            FOLLOW_UP: Asking for more detail, clarification, or a variation on what was already
            discussed. Keywords: "tell me more", "what about", "explain", "why", "how", "what if",
            "can you elaborate", "I'm curious about", references to prior findings.
            
            When in doubt, reply FOLLOW_UP.
            Reply with exactly one word: NEW or FOLLOW_UP
            """;
}
