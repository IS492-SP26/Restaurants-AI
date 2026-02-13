# Multi-Agent AI Assistant for Local Restaurant Launch Planning
## Why It Matters
Opening a restaurant is a complex, high-risk process that requires coordinating knowledge across multiple domains, including market analysis, financial planning, operations design, and regulatory awareness. Most first-time founders do not have access to expert teams across these domains and must rely on fragmented information from online searches, templates, or consultants, which can be expensive or inconsistent.

Current AI tools mainly support isolated tasks such as writing business plans, generating marketing text, or automating restaurant operations. However, they do not provide coordinated, end-to-end decision support tailored to a specific local environment.

This problem matters because:

- Small businesses represent a major portion of local economies.
- Many restaurant startups fail due to poor planning, not lack of demand.

In this project, we focus on restaurant launch planning on Green Street (Champaign, IL) as a concrete real-world case study to explore how multi-agent AI can support local business decision making.

## Primary Target Users

- First-time restaurant founders
- Student entrepreneurs
- Small business owners exploring new locations
- Non-business-background founders entering food service

## Core User Tasks (What users do inside out tool)
### Task 1 — Provide Startup Inputs
Users enter or select:
- restaurant concept (cuisine / service style)
- budget range
- target customers (e.g., students, faculty, local residents)
- constraints (timeline, hours, dietary focus, staffing limits)

Success: user finishes intake in <3 minutes and feels the tool understands their situation.

### Task 2 — Review and Edit the Draft Plan (Human-in-the-loop)
Users receive a structured draft plan (market + finance + opportunities + risks) and can:
- edit assumptions (rent range, expected price point, hours)
- choose priorities (low cost vs differentiation vs speed to launch)
- ask follow-up questions (“what if budget is only $80k?”)

Success: user can quickly correct wrong assumptions and steer the plan.

### Task 3 — Generate Final Output + Export
Users generate a final “Launch Pack” including:
- feasibility summary + key assumptions
- action checklist / timeline
- rough cost breakdown
- risk list + mitigation ideas

Optional export:
Markdown / word / PDF (later) / copy-to-notes

Success: user leaves with a plan they can actually use to make decisions or talk to teammates and investors.

## Competitive Landscape (Existing Tools + Shortcomings)
To better understand the current ecosystem, we reviewed several AI tools that assist with startup planning or business documentation.
### AI Cofounder (Startup Planning Guidance Tool)
link: https://aicofounder.com/dashboard

AI Cofounder focuses on structured startup guidance. It provides:
- Planning checklists
- Market research steps
- Concept validation workflows
- Structured task breakdowns

What It Does Well
- Offers structured planning frameworks
- Guides users through early-stage startup thinking
- Encourages systematic research

Limitations
- Primarily advisory — it tells users what to research but does not perform deep analysis for them
- Requires users to manually gather and interpret local data
- Does not simulate collaboration between specialized roles (e.g., finance, operations, market)

As a result, it provides guidance, but not full decision support.

### Canva AI Business Plan Generator
link: https://www.canva.com/ai-business-plan-generator

Canva’s AI business plan generator focuses on documentation and formatting support.

What It Does Well
- Generates structured business plan templates
- Helps organize financial categories
- Produces polished documentation

Limitations
- Primarily template-based generation
- Outputs are generic and not locally grounded
- Does not evaluate feasibility or validate assumptions
- No critique or multi-role reasoning process

### PrometAI (Investor-Facing Tool)
link: https://prometai.app

PrometAI emphasizes investor-oriented outputs, such as:
- Financial narratives
- Market sizing (TAM/SAM/SOM)
- Funding presentation materials

What It Does Well
- Helps structure investor pitch materials
- Supports financial storytelling

Limitations
- Focuses on isolated tasks rather than end-to-end decision pipelines
- Does not connect idea validation, market conditions, and operational feasibility
- No integrated critique or multi-agent collaboration mechanism

### Key Gap We Address
Across these tools, we observe a consistent pattern:
- Some tools provide guidance.
- Some tools generate documentation.
- Some tools support investor materials.

However, none provide:
- Locally grounded feasibility analysis
- Coordinated multi-domain reasoning (market + finance + operations)
- Iterative critique and refinement
- End-to-end decision support from idea to structured launch plan

## Initial Concept and Value Proposition
### Core Idea
We propose a multi-agent AI assistant that simulates collaboration between domain experts to generate realistic restaurant launch planning guidance.

### Initial System Design
The system will use specialized agents such as:
- Market Agent → Local demand + competition summary
- Finance Agent → Startup + operating cost estimation
- Operations Agent → Staffing + equipment + workflow planning
- Critic Agent → Identifies risks, unrealistic assumptions, and blind spots
The outputs from these agents are combined into a final structured restaurant launch plan.

### Value Proposition
Compared to existing tools, our system aims to provide:
- More realistic planning through multi-domain reasoning
- More trustworthy outputs via critique-based refinement
- More useful results via local context grounding
- Faster early-stage decision making for founders

## Milestones + Roles (Initial)
### Milestone 1 — CP1: Research + Proposal + Repo Setup

Deliverables:
- Literature review
- Problem framing
- Initial system design

### Milestone 2 — CP2: Prompting Validation + Prototype

Deliverables:
- Multi-agent prompt system
- Baseline comparison (single-agent vs multi-agent)
- Initial demo outputs

### Milestone 3 — Final: Working Prototype + Evaluation

Deliverables:
- Simple UI demo
- Structured planning output
- Evaluation of output quality

### Team Roles 
From now on, we would work and go further together on every part.
