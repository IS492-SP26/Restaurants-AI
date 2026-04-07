package com.restaurant.marketing.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.marketing.prompt.MarketingToolDefinitions;
import org.springframework.stereotype.Component;

/**
 * ToolDispatcher — routes LLM tool call requests to the right implementation.
 *
 * When the LLM returns a tool_call in its response, the agent loop passes
 * the tool name and arguments here. This class figures out which Java method
 * to invoke and returns the result as a string to feed back to the LLM.
 *
 * Adding a new tool:
 * 1. Add the tool schema to MarketingToolDefinitions.ALL_TOOLS_JSON
 * 2. Add a constant for the tool name in MarketingToolDefinitions
 * 3. Add a case here in dispatch()
 * 4. Implement the handler method (or inject a new tool component)
 */
@Component
public class ToolDispatcher {
    private static final Logger log = LoggerFactory.getLogger(ToolDispatcher.class);


    private final WebSearchTool webSearchTool;
    private final YelpClient yelpClient;
    private final ObjectMapper mapper;

    public ToolDispatcher(WebSearchTool webSearchTool, YelpClient yelpClient) {
        this.webSearchTool = webSearchTool;
        this.yelpClient    = yelpClient;
        this.mapper        = new ObjectMapper();
    }

    /**
     * Dispatch a tool call and return the result as a string.
     *
     * @param toolName   The function name from the LLM's tool_call
     * @param argsJson   The arguments JSON string from the LLM's tool_call
     * @return           Result string to inject back into the conversation
     */
    public String dispatch(String toolName, String argsJson) {
        log.info("Dispatching tool: {} with args: {}", toolName, argsJson);

        try {
            JsonNode args = mapper.readTree(argsJson);

            return switch (toolName) {
                case MarketingToolDefinitions.TOOL_SEARCH_COMPETITORS ->
                        handleCompetitorSearch(args);

                case MarketingToolDefinitions.TOOL_SEARCH_LABOR ->
                        handleLaborSearch(args);

                case MarketingToolDefinitions.TOOL_SEARCH_DEMOGRAPHICS ->
                        handleDemographicsSearch(args);

                case MarketingToolDefinitions.TOOL_SEARCH_REAL_ESTATE ->
                        handleRealEstateSearch(args);

                case MarketingToolDefinitions.TOOL_WEB_SEARCH ->
                        handleWebSearch(args);

                default -> {
                    log.warn("Unknown tool: {}", toolName);
                    yield "Tool '" + toolName + "' is not implemented.";
                }
            };

        } catch (Exception e) {
            log.error("Tool dispatch failed for {}: {}", toolName, e.getMessage(), e);
            return "Tool execution failed: " + e.getMessage();
        }
    }

    // -------------------------------------------------------------------------
    // Tool handlers — each builds a targeted search query and calls the
    // appropriate API. Right now they all route through WebSearchTool.
    // Later you can swap in dedicated APIs (Yelp, BLS, Loopnet) per handler.
    // -------------------------------------------------------------------------

    private String handleCompetitorSearch(JsonNode args) {
        String cuisine  = args.path("cuisine_type").asText("restaurants");
        String district = args.path("district").asText("Champaign IL");
        String priceTier = args.path("price_tier").asText("any");

        // Prefer Yelp — structured data with ratings, review counts, price tiers
        if (yelpClient.isConfigured()) {
            String yelpResult = yelpClient.searchCompetitors(cuisine, district);
            if (yelpResult != null) {
                // Supplement Yelp with a web search for recent news/openings
                String webQuery = buildCompetitorQuery(cuisine, district, priceTier) + " new opening 2024 2025";
                String webResult = webSearchTool.search(webQuery);
                return yelpResult + "\n\nRECENT WEB MENTIONS:\n" + webResult;
            }
        }

        // Fallback: web search only
        String query = buildCompetitorQuery(cuisine, district, priceTier);
        String searchResults = webSearchTool.search(query);

        return String.format("""
                COMPETITOR SEARCH RESULTS
                Query: %s restaurants in %s (price: %s)
                Location: Champaign-Urbana, IL

                %s

                Note: Cross-reference these results with the local market intelligence
                you already have about this district.
                """, cuisine, district, priceTier, searchResults);
    }

    private String handleLaborSearch(JsonNode args) {
        String role = args.path("role").asText("restaurant staff");
        String level = args.path("experience_level").asText("any");

        String query = String.format(
                "%s jobs Champaign IL %s",
                role,
                level.equals("any") ? "" : level + " level"
        ).trim();

        String searchResults = webSearchTool.search(query);

        return String.format("""
                LABOR MARKET SEARCH RESULTS
                Role: %s | Experience: %s | Location: Champaign, IL
                
                %s
                
                Context: The Champaign market has a large student workforce.
                Peak hiring is late July/August before fall semester.
                Typical wages: FOH $13-16/hr + tips, BOH $15-19/hr (2024).
                """, role, level, searchResults);
    }

    private String handleDemographicsSearch(JsonNode args) {
        String area = args.path("area").asText("Champaign IL");
        String dataType = args.path("data_type").asText("general");

        String query = switch (dataType) {
            case "foot_traffic" -> "foot traffic pedestrian count " + area + " Champaign Illinois";
            case "demographics" -> "demographics population " + area + " Champaign Urbana IL";
            case "income" -> "median household income " + area + " Champaign IL census";
            case "age_distribution" -> "age demographics median age " + area + " Champaign IL";
            default -> area + " demographics Champaign Urbana Illinois";
        };

        String searchResults = webSearchTool.search(query);

        return String.format("""
                DEMOGRAPHICS SEARCH RESULTS
                Area: %s | Data type: %s
                
                %s
                
                Context: UIUC's 57,000 students heavily skew demographics in
                campus-adjacent areas. Census data may undercount student population
                since many are counted at home addresses.
                """, area, dataType, searchResults);
    }

    private String handleRealEstateSearch(JsonNode args) {
        String district = args.path("district").asText("Champaign IL");
        int minSqft = args.path("min_sqft").asInt(0);
        int maxSqft = args.path("max_sqft").asInt(0);

        String sizeFilter = (minSqft > 0 || maxSqft > 0)
                ? String.format(" %d-%d sqft", minSqft, maxSqft)
                : "";

        String query = String.format(
                "restaurant space for lease%s %s Champaign Illinois commercial real estate",
                sizeFilter, district
        );

        String searchResults = webSearchTool.search(query);

        return String.format("""
                REAL ESTATE SEARCH RESULTS
                District: %s%s | Champaign-Urbana, IL
                
                %s
                
                Typical rent ranges by district:
                - Campustown: $25-45/sqft/yr NNN (high competition, limited availability)
                - Downtown Champaign: $18-30/sqft/yr (improving infrastructure)
                - Downtown Urbana: $10-20/sqft/yr (flexible landlords, lower traffic)
                - North Prospect: $15-25/sqft/yr (larger spaces, parking available)
                """, district, sizeFilter, searchResults);
    }

    private String handleWebSearch(JsonNode args) {
        String query = args.path("query").asText("");
        if (query.isBlank()) {
            return "Error: no query provided to web_search tool.";
        }

        // Ensure the query is geographically anchored if it isn't already
        if (!query.toLowerCase().contains("champaign") && !query.toLowerCase().contains("urbana")) {
            query = query + " Champaign IL";
        }

        return webSearchTool.search(query);
    }

    // -------------------------------------------------------------------------
    // Query builders
    // -------------------------------------------------------------------------

    private String buildCompetitorQuery(String cuisine, String district, String priceTier) {
        StringBuilder q = new StringBuilder();
        q.append(cuisine).append(" restaurant ");

        // Map our district names to search-friendly terms
        q.append(switch (district) {
            case "Campustown" -> "Green Street Campustown Champaign IL";
            case "Downtown Champaign" -> "Downtown Champaign Neil Street IL";
            case "Downtown Urbana" -> "Downtown Urbana Main Street IL";
            case "North Prospect" -> "North Prospect Avenue Champaign IL";
            case "Research Park" -> "Research Park South First Street Champaign IL";
            default -> "Champaign Urbana IL";
        });

        if (!priceTier.equals("any")) {
            q.append(" ").append(priceTier);
        }

        return q.toString();
    }
}
