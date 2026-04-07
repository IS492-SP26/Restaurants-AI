package com.restaurant.marketing.orchestration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.HashMap;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AgentRequest {

    private String sessionId;
    private String location;
    private String userQuery;
    private Map<String, Object> context = new HashMap<>();

    public AgentRequest() {}

    private AgentRequest(Builder b) {
        this.sessionId = b.sessionId;
        this.location  = b.location;
        this.userQuery = b.userQuery;
        this.context   = b.context != null ? b.context : new HashMap<>();
    }

    public static Builder builder() { return new Builder(); }

    @SuppressWarnings("unchecked")
    public <T> T getContextValue(String key, T defaultValue) {
        Object val = context.get(key);
        if (val == null) return defaultValue;
        try { return (T) val; } catch (ClassCastException e) { return defaultValue; }
    }

    public String getSessionId()                   { return sessionId; }
    public void   setSessionId(String v)           { this.sessionId = v; }
    public String getLocation()                    { return location; }
    public void   setLocation(String v)            { this.location = v; }
    public String getUserQuery()                   { return userQuery; }
    public void   setUserQuery(String v)           { this.userQuery = v; }
    public Map<String, Object> getContext()        { return context; }
    public void   setContext(Map<String, Object> v){ this.context = v; }

    public static class Builder {
        private String sessionId;
        private String location;
        private String userQuery;
        private Map<String, Object> context = new HashMap<>();

        public Builder sessionId(String v)            { this.sessionId = v; return this; }
        public Builder location(String v)             { this.location  = v; return this; }
        public Builder userQuery(String v)            { this.userQuery = v; return this; }
        public Builder context(Map<String, Object> v) { this.context   = v; return this; }
        public AgentRequest build()                   { return new AgentRequest(this); }
    }
}
