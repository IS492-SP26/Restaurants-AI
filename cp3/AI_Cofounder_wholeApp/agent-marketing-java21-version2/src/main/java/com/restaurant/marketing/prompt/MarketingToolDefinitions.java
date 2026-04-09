package com.restaurant.marketing.prompt;

/**
 * MarketingToolDefinitions — JSON schemas for every tool the Marketing Agent can call.
 *
 * These are passed to Groq as the `tools` array in the API request.
 * The LLM decides which tools to call based on the user's query.
 *
 * Adding a new tool: add a constant here AND a handler in ToolDispatcher.java.
 */
public final class MarketingToolDefinitions {

    private MarketingToolDefinitions() {}

    /**
     * All tools as a JSON array — passed directly to the Groq API.
     * Uses OpenAI-compatible tool format (which Groq accepts).
     */
    public static final String ALL_TOOLS_JSON = """
            [
              {
                "type": "function",
                "function": {
                  "name": "search_local_competitors",
                  "description": "Search for restaurants and food businesses near a location in Champaign-Urbana IL. Use this to find competitors, assess market saturation, and identify what cuisines are already present.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "cuisine_type": {
                        "type": "string",
                        "description": "Type of cuisine to search for, e.g. 'Italian', 'ramen', 'brunch'. Use 'restaurants' for a broad search."
                      },
                      "district": {
                        "type": "string",
                        "description": "Champaign-Urbana district to focus on: 'Campustown', 'Downtown Champaign', 'Downtown Urbana', 'North Prospect', or 'general'"
                      },
                      "price_tier": {
                        "type": "string",
                        "enum": ["budget", "mid-range", "upscale", "any"],
                        "description": "Price tier to filter by"
                      }
                    },
                    "required": ["cuisine_type", "district"]
                  }
                }
              },
              {
                "type": "function",
                "function": {
                  "name": "search_labor_market",
                  "description": "Find job posting data and wage information for restaurant workers in Champaign IL. Use this to assess labor availability and hiring difficulty.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "role": {
                        "type": "string",
                        "description": "Restaurant role to search for: 'line cook', 'server', 'bartender', 'dishwasher', 'kitchen manager', or 'all restaurant staff'"
                      },
                      "experience_level": {
                        "type": "string",
                        "enum": ["entry", "experienced", "management", "any"],
                        "description": "Experience level to target"
                      }
                    },
                    "required": ["role"]
                  }
                }
              },
              {
                "type": "function",
                "function": {
                  "name": "search_local_demographics",
                  "description": "Search for demographic and foot traffic data for a specific area in Champaign-Urbana. Use this to understand target customers.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "area": {
                        "type": "string",
                        "description": "Specific area or neighborhood in Champaign-Urbana, e.g. 'Green Street Campustown', 'Downtown Champaign Neil Street'"
                      },
                      "data_type": {
                        "type": "string",
                        "enum": ["foot_traffic", "demographics", "income", "age_distribution", "general"],
                        "description": "Type of demographic data to retrieve"
                      }
                    },
                    "required": ["area", "data_type"]
                  }
                }
              },
              {
                "type": "function",
                "function": {
                  "name": "search_real_estate",
                  "description": "Search for commercial real estate availability and rental rates for restaurant space in Champaign-Urbana IL.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "district": {
                        "type": "string",
                        "description": "District or neighborhood to search: 'Campustown', 'Downtown Champaign', 'Downtown Urbana', 'North Prospect', 'Research Park'"
                      },
                      "min_sqft": {
                        "type": "integer",
                        "description": "Minimum square footage needed"
                      },
                      "max_sqft": {
                        "type": "integer",
                        "description": "Maximum square footage needed"
                      }
                    },
                    "required": ["district"]
                  }
                }
              },
              {
                "type": "function",
                "function": {
                  "name": "web_search",
                  "description": "General web search for any Champaign-Urbana restaurant market information not covered by other tools. Use for recent news, specific business info, local events, or anything else.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "query": {
                        "type": "string",
                        "description": "Search query. Always include 'Champaign IL' or 'Champaign-Urbana' to keep results local."
                      }
                    },
                    "required": ["query"]
                  }
                }
              }
            ]
            """;

    // Tool name constants to avoid magic strings in ToolDispatcher
    public static final String TOOL_SEARCH_COMPETITORS = "search_local_competitors";
    public static final String TOOL_SEARCH_LABOR = "search_labor_market";
    public static final String TOOL_SEARCH_DEMOGRAPHICS = "search_local_demographics";
    public static final String TOOL_SEARCH_REAL_ESTATE = "search_real_estate";
    public static final String TOOL_WEB_SEARCH = "web_search";
}
