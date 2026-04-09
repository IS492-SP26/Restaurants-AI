package com.restaurant.marketing.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.marketing.config.MarketingConfig;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * YelpClient — fetches live competitor data from the Yelp Fusion API.
 *
 * Used by ToolDispatcher for the "search_local_competitors" tool.
 * Returns structured business data: name, rating, review count, price tier,
 * categories, address — much richer than a generic web search.
 *
 * YELP FUSION API:
 * Free tier: 500 calls/day
 * Sign up: https://www.yelp.com/developers/documentation/v3/get_started
 * Set env var: MARKETING_YELP_API_KEY
 *
 * If no API key is configured, falls back to WebSearchTool.
 */
@Component
public class YelpClient {
    private static final Logger log = LoggerFactory.getLogger(YelpClient.class);


    // Champaign, IL coordinates — used as the center point for radius searches
    private static final double CHAMPAIGN_LAT = 40.1164;
    private static final double CHAMPAIGN_LON = -88.2434;

    private final OkHttpClient httpClient;
    private final ObjectMapper mapper;
    private final MarketingConfig config;

    public YelpClient(MarketingConfig config) {
        this.config = config;
        this.mapper = new ObjectMapper();
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .build();
    }

    public boolean isConfigured() {
        return config.getYelp().getApiKey() != null
                && !config.getYelp().getApiKey().isBlank();
    }

    /**
     * Search for restaurants by cuisine type and district in Champaign-Urbana.
     *
     * @param cuisineType  e.g. "korean", "ramen", "brunch", "restaurants"
     * @param district     e.g. "Campustown", "Downtown Champaign"
     * @return             Formatted competitor summary string for the LLM
     */
    public String searchCompetitors(String cuisineType, String district) {
        if (!isConfigured()) {
            log.warn("YelpClient: no API key configured, skipping Yelp search");
            return null; // caller falls back to WebSearchTool
        }

        try {
            String locationQuery = buildLocationQuery(district);
            List<YelpBusiness> businesses = fetchBusinesses(cuisineType, locationQuery);

            if (businesses.isEmpty()) {
                return "No Yelp results found for " + cuisineType + " in " + district;
            }

            return formatCompetitorList(businesses, cuisineType, district);

        } catch (IOException e) {
            log.error("YelpClient search failed: {}", e.getMessage());
            return null; // caller falls back to WebSearchTool
        }
    }

    // -------------------------------------------------------------------------
    // Private
    // -------------------------------------------------------------------------

    private List<YelpBusiness> fetchBusinesses(String term, String location) throws IOException {
        HttpUrl url = HttpUrl.parse(config.getYelp().getBaseUrl() + "/businesses/search")
                .newBuilder()
                .addQueryParameter("term",        term)
                .addQueryParameter("location",    location)
                .addQueryParameter("latitude",    String.valueOf(CHAMPAIGN_LAT))
                .addQueryParameter("longitude",   String.valueOf(CHAMPAIGN_LON))
                .addQueryParameter("radius",      String.valueOf(config.getYelp().getSearchRadius()))
                .addQueryParameter("limit",       String.valueOf(config.getYelp().getMaxCompetitors()))
                .addQueryParameter("sort_by",     "review_count") // most-reviewed = most established
                .addQueryParameter("categories",  "restaurants")
                .build();

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + config.getYelp().getApiKey())
                .header("Accept", "application/json")
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String body = response.body() != null ? response.body().string() : "";
                throw new IOException("Yelp API returned " + response.code() + ": " + body);
            }

            String body = response.body() != null ? response.body().string() : "{}";
            return parseBusinesses(mapper.readTree(body));
        }
    }

    private List<YelpBusiness> parseBusinesses(JsonNode root) {
        List<YelpBusiness> businesses = new ArrayList<>();
        JsonNode businessArray = root.path("businesses");

        if (!businessArray.isArray()) return businesses;

        for (JsonNode b : businessArray) {
            YelpBusiness biz = new YelpBusiness();
            biz.name        = b.path("name").asText("");
            biz.rating      = b.path("rating").asDouble(0);
            biz.reviewCount = b.path("review_count").asInt(0);
            biz.priceLevel  = b.path("price").asText("N/A");
            biz.address     = formatAddress(b.path("location"));
            biz.isClosed    = b.path("is_closed").asBoolean(false);

            // Collect category labels
            List<String> cats = new ArrayList<>();
            JsonNode categories = b.path("categories");
            if (categories.isArray()) {
                for (JsonNode cat : categories) {
                    cats.add(cat.path("title").asText(""));
                }
            }
            biz.categories = cats;

            if (!biz.name.isBlank() && !biz.isClosed) {
                businesses.add(biz);
            }
        }

        return businesses;
    }

    private String formatAddress(JsonNode location) {
        String addr1 = location.path("address1").asText("");
        String city  = location.path("city").asText("");
        return addr1.isBlank() ? city : addr1 + ", " + city;
    }

    private String formatCompetitorList(List<YelpBusiness> businesses,
                                        String cuisineType, String district) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("YELP COMPETITOR DATA: %s in %s, Champaign-Urbana IL\n",
                cuisineType, district));
        sb.append(String.format("Found %d active businesses:\n\n", businesses.size()));

        for (int i = 0; i < businesses.size(); i++) {
            YelpBusiness b = businesses.get(i);
            sb.append(String.format(
                    "%d. %s\n   Rating: %.1f ⭐ (%d reviews) | Price: %s\n   %s\n   Categories: %s\n\n",
                    i + 1,
                    b.name,
                    b.rating,
                    b.reviewCount,
                    b.priceLevel,
                    b.address,
                    String.join(", ", b.categories)
            ));
        }

        // Quick stats summary
        double avgRating = businesses.stream()
                .mapToDouble(b -> b.rating).average().orElse(0);
        int totalReviews = businesses.stream()
                .mapToInt(b -> b.reviewCount).sum();

        sb.append(String.format(
                "--- MARKET STATS ---\nAvg competitor rating: %.1f | Total reviews (market activity): %d\n",
                avgRating, totalReviews));

        return sb.toString();
    }

    private String buildLocationQuery(String district) {
        return switch (district) {
            case "Campustown"        -> "Green Street, Champaign, IL 61820";
            case "Downtown Champaign"-> "Neil Street, Champaign, IL 61820";
            case "Downtown Urbana"   -> "Main Street, Urbana, IL 61801";
            case "North Prospect"    -> "North Prospect Avenue, Champaign, IL 61822";
            case "Research Park"     -> "South First Street, Champaign, IL 61820";
            default                  -> "Champaign, IL 61820";
        };
    }

    // -------------------------------------------------------------------------
    // Internal model
    // -------------------------------------------------------------------------

    private static class YelpBusiness {
        String name;
        double rating;
        int reviewCount;
        String priceLevel;
        String address;
        List<String> categories;
        boolean isClosed;
    }
}
