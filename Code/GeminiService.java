package com.regulatory.agent;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Service
public class GeminiService {

    private static final String API_KEY = "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";
    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    private String documentContext = "";
    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void loadDocuments() {
        StringBuilder sb = new StringBuilder();
        Path documentsPath = Paths.get("src/main/resources/documents");

        try (Stream<Path> paths = Files.walk(documentsPath)) {
            paths.filter(p -> p.toString().endsWith(".pdf"))
                    .forEach(p -> {
                        try {
                            PDDocument doc = Loader.loadPDF(p.toFile());
                            PDFTextStripper stripper = new PDFTextStripper();
                            String text = stripper.getText(doc);
                            sb.append("\n\n=== Document: ")
                                    .append(p.getFileName())
                                    .append(" ===\n")
                                    .append(text);
                            doc.close();
                            System.out.println("Loaded: " + p.getFileName());
                        } catch (IOException e) {
                            System.err.println("Error loading PDF: " + p);
                        }
                    });
        } catch (IOException e) {
            System.err.println("Error reading documents folder: " + e.getMessage());
        }

        documentContext = sb.toString();
        System.out.println("Total document context length: " + documentContext.length());
    }

    private String findRelevantContext(String question) {
        String lowerQuestion = question.toLowerCase();

        // Remove common stop words
        String[] stopWords = {"what", "when", "where", "which", "who", "how",
                "does", "do", "is", "are", "the", "a", "an", "in", "on", "at",
                "to", "for", "of", "and", "or", "need", "want", "can", "will",
                "have", "has", "been", "that", "this", "with", "from", "tell",
                "me", "about", "please", "explain", "describe", "give"};

        java.util.Set<String> stopSet = new java.util.HashSet<>(
                java.util.Arrays.asList(stopWords));

        // Extract meaningful keywords
        String[] allWords = lowerQuestion.split("\\s+");
        java.util.List<String> keywords = new java.util.ArrayList<>();
        for (String word : allWords) {
            String cleaned = word.replaceAll("[^a-z0-9]", "");
            if (cleaned.length() > 2 && !stopSet.contains(cleaned)) {
                keywords.add(cleaned);
            }
        }

        System.out.println("Search keywords: " + keywords);

        // Split into chunks of 1000 chars with 200 overlap
        int chunkSize = 1000;
        int overlap = 200;
        java.util.List<String> chunks = new java.util.ArrayList<>();

        for (int i = 0; i < documentContext.length(); i += (chunkSize - overlap)) {
            int end = Math.min(i + chunkSize, documentContext.length());
            chunks.add(documentContext.substring(i, end));
            if (end == documentContext.length()) break;
        }

        System.out.println("Total chunks: " + chunks.size());

        // Score each chunk
        java.util.List<int[]> scores = new java.util.ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            String lowerChunk = chunks.get(i).toLowerCase();
            int score = 0;
            for (String keyword : keywords) {
                int idx = 0;
                while ((idx = lowerChunk.indexOf(keyword, idx)) != -1) {
                    score++;
                    idx += keyword.length();
                }
            }
            scores.add(new int[]{score, i});
        }

        // Sort by score
        scores.sort((a, b) -> b[0] - a[0]);

        // Take top 10 chunks only
        java.util.List<Integer> topIndices = new java.util.ArrayList<>();
        for (int i = 0; i < Math.min(10, scores.size()); i++) {
            if (scores.get(i)[0] > 0) {
                topIndices.add(scores.get(i)[1]);
            }
        }

        // Sort by position
        java.util.Collections.sort(topIndices);

        // Build context
        StringBuilder context = new StringBuilder();
        for (int idx : topIndices) {
            context.append(chunks.get(idx)).append("\n\n");
        }

        // Fallback if nothing found
        if (context.length() == 0) {
            System.out.println("No relevant chunks found, using document start");
            return documentContext.substring(0,
                    Math.min(documentContext.length(), 10000));
        }

        // Hard cap at 15000 characters to stay within Groq limits
        String result = context.toString();
        if (result.length() > 15000) {
            result = result.substring(0, 15000);
        }

        System.out.println("Final context length: " + result.length());
        return result;
    }

    public String askQuestion(String question) {
        try {
            String relevantContext = findRelevantContext(question);

            String systemPrompt = "You are a regulatory advisor helping someone open a " +
                    "restaurant in Champaign, IL. Answer questions based ONLY on the following " +
                    "relevant sections from regulatory documents. " +
                    "Always cite specific section numbers when possible. " +
                    "Give practical and actionable answers. " +
                    "If the answer is not in the provided sections, say so clearly and suggest " +
                    "contacting the Champaign Liquor Commissioner or CUPHD.\n\n" +
                    "DOCUMENTS:\n" + relevantContext;

            String requestBody = "{\n" +
                    "  \"model\": \"llama-3.3-70b-versatile\",\n" +
                    "  \"messages\": [\n" +
                    "    {\"role\": \"system\", \"content\": " +
                    objectMapper.writeValueAsString(systemPrompt) + "},\n" +
                    "    {\"role\": \"user\", \"content\": " +
                    objectMapper.writeValueAsString(question) + "}\n" +
                    "  ],\n" +
                    "  \"max_tokens\": 800\n" +
                    "}";

            System.out.println("Sending request to Groq...");

            Request request = new Request.Builder()
                    .url(API_URL)
                    .addHeader("Authorization", "Bearer " + API_KEY)
                    .addHeader("Content-Type", "application/json")
                    .post(RequestBody.create(requestBody,
                            MediaType.parse("application/json")))
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body().string();
                System.out.println("Groq response code: " + response.code());

                if (response.code() != 200) {
                    System.err.println("Groq error: " + responseBody);
                    return "API Error " + response.code() + ": Please try again.";
                }

                JsonNode root = objectMapper.readTree(responseBody);
                String answer = root.path("choices")
                        .path(0)
                        .path("message")
                        .path("content")
                        .asText("");

                if (answer.isEmpty()) {
                    System.err.println("Empty answer. Response: " + responseBody);
                    return "Sorry, I could not generate a response. Please try again.";
                }

                return answer;
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}