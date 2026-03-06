# Prompting Protocol

## Goal

This prompting study evaluates whether existing LLM-based assistants can support restaurant launch planning in a specific local environment.

Our project focuses on a concrete case:
a student-oriented Chinese restaurant on Green Street in Champaign, Illinois, near the University of Illinois Urbana-Champaign.

We tested three widely used AI tools:

- ChatGPT (GPT)
- Gemini
- Claude

The goal of this study is to identify where current tools perform well, where they fail, and what product requirements emerge for our proposed multi-agent AI assistant.

---

## Shared Test Scenario

We used the same restaurant planning scenario across all tools:

- **Restaurant type:** Chinese restaurant
- **Location:** Green Street, Champaign, Illinois
- **Target users:** University students
- **Baseline budget:** \$120,000
- **Use case:** Early-stage launch planning for a first-time founder

This scenario was chosen because it reflects a realistic local business decision problem and allows us to test market analysis, financial reasoning, operations planning, strategic adaptation, and regulatory guidance.

---

## Evaluation Criteria

We compared tool outputs using the following criteria:

- **Local relevance**  
  Can the tool reason about Green Street and the UIUC student market?

- **Accuracy / factual grounding**  
  Does it avoid hallucinating competitors, permits, or local details?

- **Financial realism**  
  Are startup cost estimates believable and complete?

- **Operational usefulness**  
  Are staffing, equipment, and workflow suggestions practical?

- **Strategic adaptability**  
  Can the tool adjust when the budget or constraints change?

- **Clarity / structure**  
  Is the output easy for a founder to use?

---

## Prompt Set

### Prompt 1 — Market Feasibility
**Purpose:** Evaluate market analysis ability and local awareness.

> I want to open a Chinese restaurant on Green Street in Champaign, Illinois, near the University of Illinois. My budget is around $120,000 and my target customers are students.
>
> Please analyze:
>
> 1. Local demand for Chinese food in this area  
> 2. Potential competitors nearby  
> 3. Whether this business idea seems feasible
>
> Please structure your answer in three sections: Market Demand, Competitors, and Feasibility Assessment.

**What we evaluate**
- ability to analyze local market demand
- competitor identification
- realistic feasibility reasoning

---

### Prompt 2 — Startup Cost Estimation
**Purpose:** Evaluate financial reasoning.

> Based on the location (Green Street in Champaign, Illinois), estimate the startup cost for opening a 40-seat Chinese restaurant targeting university students.
>
> Please provide a cost breakdown including:
>
> - rent
> - kitchen equipment
> - renovation
> - staff hiring
> - licenses and permits
>
> Present the result as a table if possible.

**What we evaluate**
- cost realism
- completeness of financial categories
- clarity of breakdown

---

### Prompt 3 — Operations Planning
**Purpose:** Evaluate operational understanding.

> For a small Chinese restaurant near a university campus, what staff roles, kitchen equipment, and operational workflows should be prepared before opening?
>
> Please organize your answer into:
>
> - Staff roles
> - Kitchen equipment
> - Daily operations workflow

**What we evaluate**
- operational planning quality
- practical usefulness

---

### Prompt 4 — Budget Constraint Scenario
**Purpose:** Evaluate strategic adaptability.

> Suppose the startup budget drops to only $60,000.
>
> What changes should be made to the Chinese restaurant concept, menu, or operations to make the business more realistic?
>
> Please suggest practical adjustments and explain the reasoning.

**What we evaluate**
- prioritization ability
- feasibility of recommendations

---

### Prompt 5 — Regulatory Guidance
**Purpose:** Evaluate whether AI tools can provide accurate and practical regulatory guidance for opening a restaurant.

> If I want to open a Chinese restaurant on Green Street in Champaign, Illinois, what licenses and permits are required before I can legally operate?
>
> Please include:
>
> - business registration requirements
> - food service licenses
> - health department permits
> - fire safety inspections
> - any local city permits required
>
> If possible, explain which government agencies are responsible for each requirement.

**What we evaluate**
- regulatory completeness
- local agency awareness
- practical usefulness for founders

---

## Method

Each prompt was run across the same three tools:

- GPT
- Gemini
- Claude

We kept the wording as consistent as possible across tools to allow fair comparison.

We then reviewed outputs for:

- strengths
- missing information
- generic advice
- possible hallucinations
- usability for first-time founders

