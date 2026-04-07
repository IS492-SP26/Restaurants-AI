# Marketing Agent — Setup Guide

## Quick Start in IntelliJ IDEA

### 1. Open the project
File → Open → select the `agent-marketing/` folder
IntelliJ will detect the `pom.xml` and import it as a Maven project.

### 2. Set environment variables
Run → Edit Configurations → MarketingAgentApplication → Environment Variables:

```
MARKETING_GROQ_API_KEY=gsk_your_key_here
MARKETING_SEARCH_API_KEY=your_serper_key_here
```

**Get your keys:**
- Groq: https://console.groq.com (free tier available)
- Serper (web search): https://serper.dev (2,500 free searches/month)

The agent runs without a search key — it falls back to mock data
so you can develop and test the LLM reasoning without burning search quota.

### 3. Run
Right-click `MarketingAgentApplication.java` → Run

The agent starts on **http://localhost:8081**

---

## API Endpoints

### Analyze (synchronous)
```http
POST http://localhost:8081/api/v1/marketing/analyze
Content-Type: application/json

{
  "sessionId": "test-123",
  "location": "Champaign, IL",
  "userQuery": "Should I open a Korean BBQ restaurant near campus?",
  "context": {}
}
```

### Analyze (streaming SSE — better for frontend)
```
GET http://localhost:8081/api/v1/marketing/analyze/stream
    ?query=Should I open a Korean BBQ near campus
    &location=Champaign, IL
```

### Health check
```
GET http://localhost:8081/api/v1/marketing/health
```

---

## Project Structure

```
agent-marketing/
├── pom.xml
└── src/main/java/com/restaurant/marketing/
    ├── MarketingAgentApplication.java     ← Spring Boot entry point
    │
    ├── orchestration/                     ← ORCHESTRATOR CONTRACT
    │   ├── AgentContract.java             ← Interface all agents implement
    │   ├── AgentRequest.java              ← Standard input DTO
    │   └── AgentResponse.java             ← Standard output DTO
    │
    ├── agent/
    │   ├── MarketingAgent.java            ← Core agent + agentic loop
    │   └── MarketingController.java       ← REST endpoints
    │
    ├── config/
    │   └── MarketingConfig.java           ← All config via properties
    │
    ├── context/
    │   └── ChampaignContextProvider.java  ← Local market intelligence
    │
    ├── prompt/
    │   └── MarketingToolDefinitions.java  ← Tool schemas for the LLM
    │
    └── tools/
        ├── GroqClient.java                ← Groq API HTTP client
        ├── WebSearchTool.java             ← Serper/Brave search
        └── ToolDispatcher.java            ← Routes LLM tool calls
```

---

## How the Orchestrator will integrate this

When you build the Orchestrator (separate module), it does this:

```java
// In the Orchestrator module:
@Autowired
private MarketingAgent marketingAgent;  // or via HTTP call to port 8081

// Route a task:
AgentRequest request = AgentRequest.builder()
    .sessionId(session)
    .location("Champaign, IL")
    .userQuery(userQuery)
    .context(Map.of("financial.budget", 250000))  // from Financial Agent
    .build();

AgentResponse response = marketingAgent.execute(request);

// Pass marketing findings to other agents:
Map<String, Object> sharedData = response.getSharedData();
// e.g. sharedData.get("marketing.highCompetitionDetected") → Boolean
```

**Two deployment options:**
1. **Monorepo (same JVM):** Import agent-marketing as a Maven dependency.
   Orchestrator calls `marketingAgent.execute(request)` directly.
2. **Microservices (separate JVMs):** Orchestrator calls
   `POST http://localhost:8081/api/v1/marketing/analyze` via HTTP.

The `AgentContract` interface and `AgentRequest`/`AgentResponse` DTOs
work identically for both — that's the point of the contract design.

---

## Adding a new tool

1. Add the tool JSON schema to `MarketingToolDefinitions.ALL_TOOLS_JSON`
2. Add a name constant to `MarketingToolDefinitions`
3. Add a `case` in `ToolDispatcher.dispatch()`
4. Implement the handler method in `ToolDispatcher`

No changes needed to `MarketingAgent` or any other class.

---

## Extending to other cities

1. Create a `LocationContextProvider` interface
2. Rename `ChampaignContextProvider` to implement it
3. Create new city-specific implementations
4. `MarketingAgent` injects `LocationContextProvider` instead of the concrete class
