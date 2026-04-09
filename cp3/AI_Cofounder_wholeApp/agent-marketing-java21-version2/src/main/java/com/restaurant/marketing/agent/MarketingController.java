package com.restaurant.marketing.agent;

import com.restaurant.marketing.orchestration.AgentRequest;
import com.restaurant.marketing.orchestration.AgentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/v1/marketing")
// BUG FIX: allow ALL origins so the local HTML file (file://) can call this
// In production, restrict this to your actual frontend domain
@CrossOrigin(origins = "*")
public class MarketingController {

    private static final Logger log = LoggerFactory.getLogger(MarketingController.class);

    private final MarketingAgent marketingAgent;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public MarketingController(MarketingAgent marketingAgent) {
        this.marketingAgent = marketingAgent;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AgentResponse> analyze(@RequestBody AgentRequest request) {
        if (request.getSessionId() == null || request.getSessionId().isBlank()) {
            request = AgentRequest.builder()
                    .sessionId(UUID.randomUUID().toString())
                    .location(request.getLocation())
                    .userQuery(request.getUserQuery())
                    .context(request.getContext())
                    .build();
        }

        log.info("POST /analyze | session={} | query={}", request.getSessionId(), request.getUserQuery());
        AgentResponse response = marketingAgent.execute(request);

        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.internalServerError().body(response);
    }

    @GetMapping(value = "/analyze/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter analyzeStream(
            @RequestParam String query,
            @RequestParam(defaultValue = "Champaign, IL") String location,
            @RequestParam(required = false) String sessionId) {

        String session = (sessionId != null && !sessionId.isBlank())
                ? sessionId : UUID.randomUUID().toString();

        SseEmitter emitter = new SseEmitter(120_000L);

        AgentRequest request = AgentRequest.builder()
                .sessionId(session)
                .location(location)
                .userQuery(query)
                .build();

        executor.submit(() -> {
            try {
                emitter.send(SseEmitter.event().name("status")
                        .data("Starting analysis for " + location));
                emitter.send(SseEmitter.event().name("status")
                        .data("Researching local market..."));

                AgentResponse response = marketingAgent.execute(request);

                emitter.send(SseEmitter.event().name("result").data(response));
                emitter.send(SseEmitter.event().name("done").data("Complete"));
                emitter.complete();
            } catch (Exception e) {
                log.error("SSE error | session={}: {}", session, e.getMessage());
                try {
                    emitter.send(SseEmitter.event().name("error")
                            .data("Analysis failed: " + e.getMessage()));
                } catch (Exception ignored) {}
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean healthy = marketingAgent.isHealthy();
        Map<String, Object> status = Map.of(
                "status",       healthy ? "UP" : "DEGRADED",
                "agentId",      marketingAgent.getAgentId(),
                "healthy",      healthy,
                "capabilities", marketingAgent.getCapabilityDescription().trim()
        );
        return healthy
                ? ResponseEntity.ok(status)
                : ResponseEntity.status(503).body(status);
    }
}
