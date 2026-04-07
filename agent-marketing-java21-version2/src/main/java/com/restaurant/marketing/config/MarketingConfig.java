package com.restaurant.marketing.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "marketing")
public class MarketingConfig {

    private Groq groq = new Groq();
    private Search search = new Search();
    private Yelp yelp = new Yelp();
    private Agent agent = new Agent();

    public Groq getGroq()     { return groq; }
    public Search getSearch() { return search; }
    public Yelp getYelp()     { return yelp; }
    public Agent getAgent()   { return agent; }

    public static class Groq {
        private String apiKey;
        private String baseUrl       = "https://api.groq.com/openai/v1";
        private String primaryModel  = "llama-3.3-70b-versatile";
        private String fastModel     = "llama-3.1-8b-instant";
        private int    maxTokens     = 4096;
        private double temperature   = 0.3;

        public String getApiKey()        { return apiKey; }
        public void   setApiKey(String v){ this.apiKey = v; }
        public String getBaseUrl()       { return baseUrl; }
        public void   setBaseUrl(String v){ this.baseUrl = v; }
        public String getPrimaryModel()  { return primaryModel; }
        public void   setPrimaryModel(String v){ this.primaryModel = v; }
        public String getFastModel()     { return fastModel; }
        public void   setFastModel(String v){ this.fastModel = v; }
        public int    getMaxTokens()     { return maxTokens; }
        public void   setMaxTokens(int v){ this.maxTokens = v; }
        public double getTemperature()   { return temperature; }
        public void   setTemperature(double v){ this.temperature = v; }
    }

    public static class Search {
        private String provider   = "serper";
        private String apiKey;
        private String baseUrl    = "https://google.serper.dev/search";
        private int    maxResults = 5;

        public String getProvider()       { return provider; }
        public void   setProvider(String v){ this.provider = v; }
        public String getApiKey()         { return apiKey; }
        public void   setApiKey(String v) { this.apiKey = v; }
        public String getBaseUrl()        { return baseUrl; }
        public void   setBaseUrl(String v){ this.baseUrl = v; }
        public int    getMaxResults()     { return maxResults; }
        public void   setMaxResults(int v){ this.maxResults = v; }
    }

    public static class Yelp {
        private String apiKey;
        private String baseUrl       = "https://api.yelp.com/v3";
        private int    searchRadius  = 5000;
        private int    maxCompetitors = 20;

        public String getApiKey()             { return apiKey; }
        public void   setApiKey(String v)     { this.apiKey = v; }
        public String getBaseUrl()            { return baseUrl; }
        public void   setBaseUrl(String v)    { this.baseUrl = v; }
        public int    getSearchRadius()       { return searchRadius; }
        public void   setSearchRadius(int v)  { this.searchRadius = v; }
        public int    getMaxCompetitors()     { return maxCompetitors; }
        public void   setMaxCompetitors(int v){ this.maxCompetitors = v; }
    }

    public static class Agent {
        private int     maxToolLoops       = 5;
        private int     toolTimeoutSeconds = 10;
        private boolean parallelToolCalls  = true;
        private String  allowedOrigin      = "http://localhost:3000";

        public int     getMaxToolLoops()          { return maxToolLoops; }
        public void    setMaxToolLoops(int v)     { this.maxToolLoops = v; }
        public int     getToolTimeoutSeconds()    { return toolTimeoutSeconds; }
        public void    setToolTimeoutSeconds(int v){ this.toolTimeoutSeconds = v; }
        public boolean isParallelToolCalls()      { return parallelToolCalls; }
        public void    setParallelToolCalls(boolean v){ this.parallelToolCalls = v; }
        public String  getAllowedOrigin()          { return allowedOrigin; }
        public void    setAllowedOrigin(String v) { this.allowedOrigin = v; }
    }
}
