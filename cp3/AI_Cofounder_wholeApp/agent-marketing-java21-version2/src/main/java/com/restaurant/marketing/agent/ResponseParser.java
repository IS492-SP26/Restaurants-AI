package com.restaurant.marketing.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.marketing.model.StructuredAnalysis;
import com.restaurant.marketing.orchestration.AgentResponse;
import com.restaurant.marketing.orchestration.AgentResponse.ConfidenceLevel;
import com.restaurant.marketing.orchestration.AgentResponse.InsightSection;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ResponseParser — converts the LLM's final structured JSON output into
 * the typed objects the rest of the system uses.
 *
 * TWO PATHS:
 * 1. Happy path: LLM returned valid JSON → deserialize into StructuredAnalysis,
 *    map each field to an InsightSection, populate sharedData from typed fields.
 *
 * 2. Fallback: LLM returned free-form text (shouldn't happen with good prompting,
 *    but we handle it gracefully) → wrap everything in a single "Analysis" section.
 *
 * The structured path gives sibling agents reliable typed data.
 * The fallback path ensures the frontend always gets something useful.
 */
@Component
public class ResponseParser {
    private static final Logger log = LoggerFactory.getLogger(ResponseParser.class);


    private final ObjectMapper mapper;

    public ResponseParser(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Parse the LLM's raw final response into structured sections + sharedData.
     *
     * @param rawResponse  The LLM's final message content (JSON or markdown)
     * @return             ParseResult containing sections and sharedData
     */
    public ParseResult parse(String rawResponse) {
        if (rawResponse == null || rawResponse.isBlank()) {
            return ParseResult.empty();
        }

        // Try structured JSON path first
        String jsonCandidate = extractJson(rawResponse);
        if (jsonCandidate != null) {
            try {
                StructuredAnalysis analysis = mapper.readValue(jsonCandidate, StructuredAnalysis.class);
                log.info("ResponseParser: structured JSON parsed successfully");
                return ParseResult.of(
                        buildSectionsFromStructured(analysis),
                        buildSharedDataFromStructured(analysis),
                        analysis
                );
            } catch (Exception e) {
                log.warn("ResponseParser: JSON found but failed to deserialize: {}", e.getMessage());
            }
        }

        // Fallback: treat as markdown
        log.info("ResponseParser: falling back to markdown parsing");
        return ParseResult.of(
                buildSectionsFromMarkdown(rawResponse),
                buildSharedDataFromText(rawResponse),
                null
        );
    }

    // -------------------------------------------------------------------------
    // Structured path
    // -------------------------------------------------------------------------

    private List<InsightSection> buildSectionsFromStructured(StructuredAnalysis a) {
        List<InsightSection> sections = new ArrayList<>();

        // Executive Summary
        if (a.getExecutiveSummary() != null) {
            sections.add(InsightSection.builder()
                    .title("Executive Summary")
                    .summary(truncate(a.getExecutiveSummary(), 200))
                    .detail(a.getExecutiveSummary())
                    .confidence(mapConfidence(a.getOrchestratorSignals()))
                    .sources(List.of("Groq LLM", "Champaign Market Context"))
                    .build());
        }

        // Competitor Landscape
        StructuredAnalysis.CompetitorLandscape cl = a.getCompetitorLandscape();
        if (cl != null && cl.getSummary() != null) {
            String detail = buildCompetitorDetail(cl);
            sections.add(InsightSection.builder()
                    .title("Competitor Landscape")
                    .summary(truncate(cl.getSummary(), 200))
                    .detail(detail)
                    .confidence(ConfidenceLevel.HIGH)
                    .sources(List.of("Web Search", "Yelp", "Champaign Market Context"))
                    .build());
        }

        // Brand Positioning
        StructuredAnalysis.BrandPositioning bp = a.getBrandPositioning();
        if (bp != null && bp.getPositioningStatement() != null) {
            String detail = buildBrandDetail(bp);
            sections.add(InsightSection.builder()
                    .title("Brand Positioning")
                    .summary(bp.getPositioningStatement())
                    .detail(detail)
                    .confidence(ConfidenceLevel.MEDIUM)
                    .sources(List.of("Groq LLM", "Market Gap Analysis"))
                    .build());
        }

        // Target Demographics
        if (a.getPrimaryTargetDemographic() != null) {
            String detail = "**Primary:** " + a.getPrimaryTargetDemographic() +
                    (a.getSecondaryTargetDemographic() != null
                            ? "\n\n**Secondary:** " + a.getSecondaryTargetDemographic()
                            : "");
            sections.add(InsightSection.builder()
                    .title("Target Demographics")
                    .summary(a.getPrimaryTargetDemographic())
                    .detail(detail)
                    .confidence(ConfidenceLevel.MEDIUM)
                    .sources(List.of("US Census", "UIUC Enrollment Data", "Groq LLM"))
                    .build());
        }

        // Labor Market
        StructuredAnalysis.LaborMarket lm = a.getLaborMarket();
        if (lm != null) {
            String detail = buildLaborDetail(lm);
            sections.add(InsightSection.builder()
                    .title("Labor Market")
                    .summary("Availability: " + lm.getAvailability() +
                            " | Best hiring window: " + lm.getBestHiringWindow())
                    .detail(detail)
                    .confidence(ConfidenceLevel.MEDIUM)
                    .sources(List.of("Web Search", "BLS Data", "Champaign Market Context"))
                    .build());
        }

        // Seasonality
        StructuredAnalysis.SeasonalityProfile sp = a.getSeasonality();
        if (sp != null && sp.getSummary() != null) {
            sections.add(InsightSection.builder()
                    .title("Seasonality")
                    .summary(truncate(sp.getSummary(), 200))
                    .detail(buildSeasonalityDetail(sp))
                    .confidence(ConfidenceLevel.HIGH)
                    .sources(List.of("Champaign Market Context", "UIUC Academic Calendar"))
                    .build());
        }

        // Location Recommendation
        if (a.getRecommendedDistrict() != null) {
            sections.add(InsightSection.builder()
                    .title("Location Recommendation")
                    .summary("Recommended district: " + a.getRecommendedDistrict())
                    .detail("**Recommended district:** " + a.getRecommendedDistrict() +
                            "\n\n**Concept type:** " + orEmpty(a.getSuggestedConceptType()))
                    .confidence(ConfidenceLevel.HIGH)
                    .sources(List.of("Competitor Analysis", "Demographics", "Real Estate Research"))
                    .build());
        }

        return sections;
    }

    private Map<String, Object> buildSharedDataFromStructured(StructuredAnalysis a) {
        Map<String, Object> shared = new HashMap<>();
        shared.put("marketing.analysisComplete",    true);
        shared.put("marketing.recommendedDistrict", orEmpty(a.getRecommendedDistrict()));
        shared.put("marketing.suggestedConcept",    orEmpty(a.getSuggestedConceptType()));
        shared.put("marketing.primaryDemographic",  orEmpty(a.getPrimaryTargetDemographic()));

        StructuredAnalysis.OrchestratorSignals os = a.getOrchestratorSignals();
        if (os != null) {
            shared.put("marketing.highCompetitionDetected",   os.isHighCompetitionMarket());
            shared.put("marketing.seasonalityRiskFlagged",    os.isModelSummerRevenueDip());
            shared.put("marketing.highStaffTurnover",         os.isHighStaffTurnoverExpected());
            shared.put("marketing.liquorLicenseRecommended",  os.isLiquorLicenseRecommended());
            shared.put("marketing.recommendedMinSeats",       os.getRecommendedMinSeats());
            shared.put("marketing.recommendedMaxSeats",       os.getRecommendedMaxSeats());
            shared.put("marketing.analysisConfidence",        orEmpty(os.getAnalysisConfidence()));
        }

        StructuredAnalysis.CompetitorLandscape cl = a.getCompetitorLandscape();
        if (cl != null) {
            shared.put("marketing.competitionLevel",          orEmpty(cl.getCompetitionLevel()));
            shared.put("marketing.estimatedCompetitors",      cl.getEstimatedDirectCompetitors());
        }

        StructuredAnalysis.BrandPositioning bp = a.getBrandPositioning();
        if (bp != null) {
            shared.put("marketing.priceTier",                 orEmpty(bp.getPriceTier()));
            shared.put("marketing.recommendedAvgCheck",       bp.getRecommendedAvgCheckUsd());
        }

        StructuredAnalysis.LaborMarket lm = a.getLaborMarket();
        if (lm != null) {
            shared.put("marketing.laborAvailability",         orEmpty(lm.getAvailability()));
            shared.put("marketing.estimatedFohWage",          lm.getEstimatedFohWageUsd());
            shared.put("marketing.estimatedBohWage",          lm.getEstimatedBohWageUsd());
        }

        return shared;
    }

    // -------------------------------------------------------------------------
    // Markdown fallback path
    // -------------------------------------------------------------------------

    private List<InsightSection> buildSectionsFromMarkdown(String rawText) {
        List<InsightSection> sections = new ArrayList<>();
        String[] lines = rawText.split("\n");
        String currentTitle = "Marketing Analysis";
        StringBuilder currentContent = new StringBuilder();

        for (String line : lines) {
            if (line.startsWith("## ") || line.startsWith("### ")) {
                if (!currentContent.toString().isBlank()) {
                    sections.add(markdownSection(currentTitle, currentContent.toString().trim()));
                }
                currentTitle = line.replaceAll("^#{2,3}\\s*", "").trim();
                currentContent = new StringBuilder();
            } else {
                currentContent.append(line).append("\n");
            }
        }

        if (!currentContent.toString().isBlank()) {
            sections.add(markdownSection(currentTitle, currentContent.toString().trim()));
        }

        if (sections.isEmpty()) {
            sections.add(markdownSection("Marketing Analysis", rawText));
        }

        return sections;
    }

    private InsightSection markdownSection(String title, String detail) {
        return InsightSection.builder()
                .title(title)
                .summary(truncate(detail.replace("\n", " "), 200))
                .detail(detail)
                .confidence(ConfidenceLevel.MEDIUM)
                .sources(List.of("Groq LLM", "Web Search", "Local Market Context"))
                .build();
    }

    private Map<String, Object> buildSharedDataFromText(String rawText) {
        Map<String, Object> shared = new HashMap<>();
        shared.put("marketing.analysisComplete", true);
        shared.put("marketing.analysisConfidence", "LOW"); // fallback = less reliable

        String lower = rawText.toLowerCase();
        shared.put("marketing.highCompetitionDetected",
                lower.contains("highly competitive") || lower.contains("saturated"));
        shared.put("marketing.seasonalityRiskFlagged",
                lower.contains("summer") && lower.contains("drop"));
        shared.put("marketing.studentMarketFocus",
                lower.contains("student") && lower.contains("target"));

        return shared;
    }

    // -------------------------------------------------------------------------
    // Detail builders
    // -------------------------------------------------------------------------

    private String buildCompetitorDetail(StructuredAnalysis.CompetitorLandscape cl) {
        StringBuilder sb = new StringBuilder();
        sb.append("**Competition level:** ").append(cl.getCompetitionLevel()).append("\n\n");
        sb.append("**Estimated direct competitors:** ").append(cl.getEstimatedDirectCompetitors()).append("\n\n");

        if (cl.getNamedCompetitors() != null && !cl.getNamedCompetitors().isEmpty()) {
            sb.append("**Key competitors:**\n");
            cl.getNamedCompetitors().forEach(c -> sb.append("- ").append(c).append("\n"));
            sb.append("\n");
        }

        if (cl.getMarketGaps() != null && !cl.getMarketGaps().isEmpty()) {
            sb.append("**Market gaps to exploit:**\n");
            cl.getMarketGaps().forEach(g -> sb.append("- ").append(g).append("\n"));
            sb.append("\n");
        }

        sb.append(cl.getSummary());
        return sb.toString();
    }

    private String buildBrandDetail(StructuredAnalysis.BrandPositioning bp) {
        StringBuilder sb = new StringBuilder();
        sb.append("**Positioning:** ").append(bp.getPositioningStatement()).append("\n\n");
        sb.append("**Price tier:** ").append(bp.getPriceTier()).append("\n");
        sb.append("**Recommended avg check:** $").append(String.format("%.2f", bp.getRecommendedAvgCheckUsd())).append("\n\n");

        if (bp.getDifferentiators() != null && !bp.getDifferentiators().isEmpty()) {
            sb.append("**Differentiators:**\n");
            bp.getDifferentiators().forEach(d -> sb.append("- ").append(d).append("\n"));
            sb.append("\n");
        }

        if (bp.getRecommendedChannels() != null && !bp.getRecommendedChannels().isEmpty()) {
            sb.append("**Recommended marketing channels:**\n");
            bp.getRecommendedChannels().forEach(c -> sb.append("- ").append(c).append("\n"));
        }

        return sb.toString();
    }

    private String buildLaborDetail(StructuredAnalysis.LaborMarket lm) {
        StringBuilder sb = new StringBuilder();
        sb.append("**Availability:** ").append(lm.getAvailability()).append("\n");
        sb.append("**FOH wages (est.):** $").append(String.format("%.2f", lm.getEstimatedFohWageUsd())).append("/hr\n");
        sb.append("**BOH wages (est.):** $").append(String.format("%.2f", lm.getEstimatedBohWageUsd())).append("/hr\n");
        sb.append("**Best hiring window:** ").append(lm.getBestHiringWindow()).append("\n\n");

        if (lm.getChallenges() != null && !lm.getChallenges().isEmpty()) {
            sb.append("**Champaign-specific challenges:**\n");
            lm.getChallenges().forEach(c -> sb.append("- ").append(c).append("\n"));
        }

        return sb.toString();
    }

    private String buildSeasonalityDetail(StructuredAnalysis.SeasonalityProfile sp) {
        StringBuilder sb = new StringBuilder();
        sb.append("**Student dependency:** ").append(sp.isStudentDependencyHigh() ? "High" : "Low/Moderate").append("\n");
        sb.append("**Estimated summer revenue drop:** ")
                .append(Math.round(sp.getSummerRevenueDropEstimate() * 100)).append("%\n\n");

        if (sp.getRevenueSpikingEvents() != null && !sp.getRevenueSpikingEvents().isEmpty()) {
            sb.append("**Revenue-spiking events:**\n");
            sp.getRevenueSpikingEvents().forEach(e -> sb.append("- ").append(e).append("\n"));
            sb.append("\n");
        }

        sb.append(sp.getSummary());
        return sb.toString();
    }

    // -------------------------------------------------------------------------
    // Utility
    // -------------------------------------------------------------------------

    /**
     * Find a JSON object in the LLM's response. The LLM sometimes wraps JSON
     * in ```json ... ``` fences, or adds a preamble sentence before the JSON.
     */
    private String extractJson(String text) {
        // Strip markdown code fences
        String stripped = text
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();

        // Find the first { and last } to isolate the JSON object
        int start = stripped.indexOf('{');
        int end   = stripped.lastIndexOf('}');
        if (start >= 0 && end > start) {
            String candidate = stripped.substring(start, end + 1);
            // Quick sanity check — valid JSON can be parsed as a tree
            try {
                JsonNode node = mapper.readTree(candidate);
                return node.isObject() ? candidate : null;
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    private String truncate(String s, int maxLen) {
        if (s == null) return "";
        if (s.length() <= maxLen) return s;
        int dot = s.indexOf('.', maxLen - 40);
        return (dot > 0 && dot < maxLen + 20) ? s.substring(0, dot + 1) : s.substring(0, maxLen) + "…";
    }

    private String orEmpty(String s) {
        return s != null ? s : "";
    }

    private ConfidenceLevel mapConfidence(StructuredAnalysis.OrchestratorSignals os) {
        if (os == null || os.getAnalysisConfidence() == null) return ConfidenceLevel.MEDIUM;
        return switch (os.getAnalysisConfidence().toUpperCase()) {
            case "HIGH"  -> ConfidenceLevel.HIGH;
            case "LOW"   -> ConfidenceLevel.LOW;
            default      -> ConfidenceLevel.MEDIUM;
        };
    }

    // -------------------------------------------------------------------------
    // Result wrapper
    // -------------------------------------------------------------------------

    public record ParseResult(
            List<InsightSection> sections,
            Map<String, Object> sharedData,
            StructuredAnalysis structuredAnalysis  // null on fallback path
    ) {
        static ParseResult empty() {
            return new ParseResult(List.of(), Map.of(), null);
        }

        static ParseResult of(List<InsightSection> s, Map<String, Object> d, StructuredAnalysis a) {
            return new ParseResult(s, d, a);
        }
    }
}
