package com.restaurant.marketing.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.marketing.config.MarketingConfig;
import okhttp3.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * WebSearchTool — calls the Serper.dev API (Google Search results).
 *
 * Used by the Marketing Agent for:
 * - Live competitor searches ("ramen restaurants in Campustown Champaign IL")
 * - Labor market queries ("line cook jobs Champaign IL Indeed")
 * - Real estate queries ("restaurant space for lease Downtown Champaign")
 * - General local news and market intel
 *
 * SWITCHING PROVIDERS:
 * If you want to use Brave Search or SerpAPI instead of Serper, only this
 * class needs to change. ToolDispatcher calls this via interface, so
 * MarketingAgent is unaffected.
 *
 * SERPER API:
 * Free tier: 2,500 searches/month
 * Sign up: https://serper.dev
 * Set env var: MARKETING_SEARCH_API_KEY
 */
@Component
public class WebSearchTool {
    private static final Logger log = LoggerFactory.getLogger(WebSearchTool.class);


    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient httpClient;
    private final ObjectMapper mapper;
    private final MarketingConfig config;

    public WebSearchTool(MarketingConfig config) {
        this.config = config;
        this.mapper = new ObjectMapper();
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .build();
    }

    /**
     * Execute a web search and return summarized results as a string.
     * The string gets fed back to the LLM as a tool result.
     */
    public String search(String query) {
        log.info("Web search: '{}'", query);

        if (config.getSearch().getApiKey() == null || config.getSearch().getApiKey().isBlank()) {
            log.warn("No search API key configured — returning mock data");
            return buildMockSearchResult(query);
        }

        try {
            return switch (config.getSearch().getProvider().toLowerCase()) {
                case "serper" -> searchWithSerper(query);
                case "brave" -> searchWithBrave(query);
                default -> {
                    log.warn("Unknown search provider '{}', falling back to Serper",
                            config.getSearch().getProvider());
                    yield searchWithSerper(query);
                }
            };
        } catch (IOException e) {
            log.error("Search failed for query '{}': {}", query, e.getMessage());
            return "Search unavailable: " + e.getMessage();
        }
    }

    // -------------------------------------------------------------------------
    // Serper implementation
    // -------------------------------------------------------------------------

    private String searchWithSerper(String query) throws IOException {
        String requestBody = String.format(
                "{\"q\": \"%s\", \"num\": %d, \"gl\": \"us\", \"hl\": \"en\"}",
                query.replace("\"", "\\\""),
                config.getSearch().getMaxResults()
        );

        Request request = new Request.Builder()
                .url(config.getSearch().getBaseUrl())
                .header("X-API-KEY", config.getSearch().getApiKey())
                .header("Content-Type", "application/json")
                .post(RequestBody.create(requestBody, JSON))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Serper returned " + response.code());
            }
            String body = response.body() != null ? response.body().string() : "{}";
            return parseSerperResults(mapper.readTree(body));
        }
    }

    private String parseSerperResults(JsonNode root) {
        List<String> results = new ArrayList<>();

        // Organic results
        JsonNode organic = root.path("organic");
        if (organic.isArray()) {
            for (JsonNode item : organic) {
                String title = item.path("title").asText("");
                String snippet = item.path("snippet").asText("");
                String link = item.path("link").asText("");
                if (!title.isBlank()) {
                    results.add(String.format("• %s\n  %s\n  Source: %s", title, snippet, link));
                }
            }
        }

        // Knowledge graph if present (useful for specific businesses)
        JsonNode kg = root.path("knowledgeGraph");
        if (!kg.isMissingNode()) {
            String kgTitle = kg.path("title").asText("");
            String kgDesc = kg.path("description").asText("");
            if (!kgTitle.isBlank()) {
                results.add(0, String.format("[Featured] %s: %s", kgTitle, kgDesc));
            }
        }

        if (results.isEmpty()) {
            return "No results found.";
        }

        return String.join("\n\n", results);
    }

    // -------------------------------------------------------------------------
    // Brave Search implementation (alternative provider)
    // -------------------------------------------------------------------------

    private String searchWithBrave(String query) throws IOException {
        HttpUrl url = HttpUrl.parse("https://api.search.brave.com/res/v1/web/search")
                .newBuilder()
                .addQueryParameter("q", query)
                .addQueryParameter("count", String.valueOf(config.getSearch().getMaxResults()))
                .addQueryParameter("country", "us")
                .build();

        Request request = new Request.Builder()
                .url(url)
                .header("Accept", "application/json")
                .header("Accept-Encoding", "gzip")
                .header("X-Subscription-Token", config.getSearch().getApiKey())
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Brave Search returned " + response.code());
            }
            String body = response.body() != null ? response.body().string() : "{}";
            return parseBraveResults(mapper.readTree(body));
        }
    }

    private String parseBraveResults(JsonNode root) {
        List<String> results = new ArrayList<>();
        JsonNode webResults = root.path("web").path("results");
        if (webResults.isArray()) {
            for (JsonNode item : webResults) {
                String title = item.path("title").asText("");
                String description = item.path("description").asText("");
                String url = item.path("url").asText("");
                if (!title.isBlank()) {
                    results.add(String.format("• %s\n  %s\n  Source: %s", title, description, url));
                }
            }
        }
        return results.isEmpty() ? "No results found." : String.join("\n\n", results);
    }

    // -------------------------------------------------------------------------
    // Mock data for development without an API key
    // -------------------------------------------------------------------------

    private String buildMockSearchResult(String query) {
        return String.format("""
                [MOCK DATA - configure MARKETING_SEARCH_API_KEY for live results]
                
                Query: "%s"
                
                • Example Result 1 in Champaign IL
                  Sample snippet about restaurants or labor market in Champaign area.
                  Source: https://example.com/result1
                
                • Example Result 2 in Champaign IL
                  Another sample result relevant to the query topic.
                  Source: https://example.com/result2
                
                • University of Illinois market context
                  With 57,000 students, UIUC dominates the Champaign food market,
                  especially in the Campustown corridor on Green Street.
                  Source: https://example.com/uiuc-market
                """, query);
    }
}
