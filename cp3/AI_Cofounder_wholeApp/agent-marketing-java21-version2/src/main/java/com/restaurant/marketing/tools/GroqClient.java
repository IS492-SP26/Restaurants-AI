package com.restaurant.marketing.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.restaurant.marketing.config.MarketingConfig;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
public class GroqClient {

    private static final Logger log = LoggerFactory.getLogger(GroqClient.class);
    private static final MediaType JSON_TYPE = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient httpClient;
    private final ObjectMapper mapper;
    private final MarketingConfig config;

    // BUG FIX: inject shared ObjectMapper instead of creating a new one
    // This ensures consistent Jackson config (JavaTimeModule, ignore unknown props)
    public GroqClient(MarketingConfig config, ObjectMapper mapper) {
        this.config = config;
        this.mapper = mapper;
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(90, TimeUnit.SECONDS)
                .writeTimeout(15, TimeUnit.SECONDS)
                .build();
    }

    public String complete(String systemPrompt, String userMessage, String model) throws IOException {
        ObjectNode body = mapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", config.getGroq().getMaxTokens());
        body.put("temperature", config.getGroq().getTemperature());

        ArrayNode messages = body.putArray("messages");
        messages.addObject().put("role", "system").put("content", systemPrompt);
        messages.addObject().put("role", "user").put("content", userMessage);

        return executeAndExtractText(body);
    }

    public JsonNode completeWithTools(
            String systemPrompt,
            ArrayNode messageHistory,
            String toolsJson,
            String model) throws IOException {

        ObjectNode body = mapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", config.getGroq().getMaxTokens());
        body.put("temperature", config.getGroq().getTemperature());
        body.set("messages", buildMessagesArray(systemPrompt, messageHistory));
        body.set("tools", mapper.readTree(toolsJson));
        body.put("tool_choice", "auto");

        return executeRaw(body);
    }

    private ArrayNode buildMessagesArray(String systemPrompt, ArrayNode existingHistory) {
        ArrayNode messages = mapper.createArrayNode();
        messages.addObject().put("role", "system").put("content", systemPrompt);
        if (existingHistory != null) {
            existingHistory.forEach(messages::add);
        }
        return messages;
    }

    private String executeAndExtractText(ObjectNode body) throws IOException {
        JsonNode response = executeRaw(body);
        return response.path("choices").path(0)
                .path("message").path("content").asText("");
    }

    private JsonNode executeRaw(ObjectNode body) throws IOException {
        String bodyJson = mapper.writeValueAsString(body);
        log.debug("Groq request → model={} size={}chars",
                body.path("model").asText(), bodyJson.length());

        Request request = new Request.Builder()
                .url(config.getGroq().getBaseUrl() + "/chat/completions")
                .header("Authorization", "Bearer " + config.getGroq().getApiKey())
                .header("Content-Type", "application/json")
                .post(RequestBody.create(bodyJson, JSON_TYPE))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                log.error("Groq API error {}: {}", response.code(), responseBody);
                throw new IOException("Groq API returned " + response.code() + ": " + responseBody);
            }

            JsonNode parsed = mapper.readTree(responseBody);
            log.debug("Groq response ← finish_reason={}",
                    parsed.path("choices").path(0).path("finish_reason").asText());
            return parsed;
        }
    }

    public ObjectMapper getMapper() {
        return mapper;
    }
}
