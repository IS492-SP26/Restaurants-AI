package com.restaurant.marketing.orchestration;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class AgentResponse {

    private String agentId;
    private String sessionId;
    private boolean success;
    private String errorMessage;

    /** Mode 1: structured sections rendered as cards in the UI */
    private List<InsightSection> sections;

    /**
     * Mode 2: plain conversational reply rendered as a chat bubble.
     * If this is set, the frontend shows it as a message not a card.
     */
    private String conversationalReply;

    /** Which mode produced this response */
    private ResponseMode responseMode = ResponseMode.STRUCTURED;

    private Map<String, Object> sharedData;
    private Instant generatedAt = Instant.now();

    public enum ResponseMode { STRUCTURED, CONVERSATIONAL }

    private AgentResponse(Builder b) {
        this.agentId           = b.agentId;
        this.sessionId         = b.sessionId;
        this.success           = b.success;
        this.errorMessage      = b.errorMessage;
        this.sections          = b.sections;
        this.conversationalReply = b.conversationalReply;
        this.responseMode      = b.responseMode;
        this.sharedData        = b.sharedData;
    }

    public AgentResponse() {}

    public static Builder builder() { return new Builder(); }

    public String getAgentId()                    { return agentId; }
    public String getSessionId()                  { return sessionId; }
    public boolean isSuccess()                    { return success; }
    public String getErrorMessage()               { return errorMessage; }
    public List<InsightSection> getSections()     { return sections; }
    public String getConversationalReply()        { return conversationalReply; }
    public ResponseMode getResponseMode()         { return responseMode; }
    public Map<String, Object> getSharedData()    { return sharedData; }
    public Instant getGeneratedAt()               { return generatedAt; }

    public static class Builder {
        private String agentId;
        private String sessionId;
        private boolean success;
        private String errorMessage;
        private List<InsightSection> sections;
        private String conversationalReply;
        private ResponseMode responseMode = ResponseMode.STRUCTURED;
        private Map<String, Object> sharedData;

        public Builder agentId(String v)                   { this.agentId             = v; return this; }
        public Builder sessionId(String v)                 { this.sessionId           = v; return this; }
        public Builder success(boolean v)                  { this.success             = v; return this; }
        public Builder errorMessage(String v)              { this.errorMessage        = v; return this; }
        public Builder sections(List<InsightSection> v)    { this.sections            = v; return this; }
        public Builder conversationalReply(String v)       { this.conversationalReply = v; return this; }
        public Builder responseMode(ResponseMode v)        { this.responseMode        = v; return this; }
        public Builder sharedData(Map<String, Object> v)   { this.sharedData          = v; return this; }
        public AgentResponse build()                       { return new AgentResponse(this); }
    }

    public enum ConfidenceLevel { HIGH, MEDIUM, LOW }

    public static class InsightSection {
        private String title;
        private String summary;
        private String detail;
        private ConfidenceLevel confidence;
        private List<String> sources;

        private InsightSection(Builder b) {
            this.title      = b.title;
            this.summary    = b.summary;
            this.detail     = b.detail;
            this.confidence = b.confidence;
            this.sources    = b.sources;
        }

        public InsightSection() {}
        public static Builder builder() { return new Builder(); }

        public String getTitle()                 { return title; }
        public String getSummary()               { return summary; }
        public String getDetail()                { return detail; }
        public ConfidenceLevel getConfidence()   { return confidence; }
        public List<String> getSources()         { return sources; }

        public static class Builder {
            private String title;
            private String summary;
            private String detail;
            private ConfidenceLevel confidence;
            private List<String> sources;

            public Builder title(String v)                  { this.title      = v; return this; }
            public Builder summary(String v)                { this.summary    = v; return this; }
            public Builder detail(String v)                 { this.detail     = v; return this; }
            public Builder confidence(ConfidenceLevel v)    { this.confidence = v; return this; }
            public Builder sources(List<String> v)          { this.sources    = v; return this; }
            public InsightSection build()                   { return new InsightSection(this); }
        }
    }
}
