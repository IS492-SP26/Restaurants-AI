package com.regulatory.agent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String answer = geminiService.askQuestion(request.getQuestion());
        return new ChatResponse(answer);
    }

    static class ChatRequest {
        private String question;
        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
    }

    static class ChatResponse {
        private String answer;
        public ChatResponse(String answer) { this.answer = answer; }
        public String getAnswer() { return answer; }
    }
}