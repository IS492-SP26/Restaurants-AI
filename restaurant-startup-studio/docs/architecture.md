# Architecture

Visual diagrams:

- `docs/architecture.svg`
- `docs/architecture.png`

## Overview

Restaurant Startup Studio is a Next.js App Router application that guides a founder through:

1. entering startup constraints
2. comparing generated concepts
3. selecting one concept
4. generating a structured startup manual

The app currently combines:

- App Router pages for UX
- route handlers for server-side generation
- local/static data packs as grounding context
- four fine-tuned agent slots with local fallback behavior
- one orchestrator that assembles the final manual

## Diagram

```mermaid
flowchart TD
  U[Founder] --> P[/plan]
  P --> SF[FounderForm]
  SF --> AS[/api/suggestions]
  AS --> GS[generateSuggestions]
  GS --> CT[concept templates]
  AS --> SS[(sessionStorage)]
  SS --> SG[/suggestions]
  SG --> SC[SuggestionsClient]
  SC --> AM[/api/manual]
  AM --> RP[runRestaurantManualPipeline]
  RP --> MK[Market agent]
  RP --> CS[Concept agent]
  RP --> FN[Financial agent]
  RP --> RG[Regulatory agent]
  RP --> OP[Operations agent]
  RP --> MT[Marketing agent]
  RP --> CP[Composer agent]
  FN --> KD[src/data/financial]
  RG --> RD[src/data/regulatory]
  OP --> OD[src/data/operations]
  MT --> MD[src/data/marketing]
  FN --> OA[OpenAI fine-tuned slot or fallback]
  RG --> OA
  OP --> OA
  MT --> OA
  AM --> SM[(sessionStorage)]
  SM --> MN[/manual]
  MN --> MDOC[ManualDocument]
```

## Key runtime paths

- Landing page: `src/app/page.tsx`
- Planning flow: `src/app/plan/page.tsx`
- Suggestions flow: `src/app/suggestions/page.tsx`
- Manual display: `src/app/manual/page.tsx`
- Suggestions API: `src/app/api/suggestions/route.ts`
- Manual API: `src/app/api/manual/route.ts`
- Manual orchestration: `src/lib/runAgentPipeline.ts`

## Prompt and model layer

- Runtime prompt builders: `src/lib/ai/agentPromptBuilders.ts`
- Prompt review package: `prompts/`
- Fine-tuned model env mapping: `src/lib/ai/models.ts`
- Fine-tune status monitor: `src/lib/fineTuneStatus.ts`

## Data connectors

The current project uses local connectors over uploaded-data snapshots rather than external databases:

- `src/lib/connectors/agentDataConnectors.ts`
- `src/lib/ai/knowledgePacks.ts`

These connectors can be replaced later with:

- vector retrieval
- SQL-backed business data
- external market APIs
- document processing pipelines

without changing the agent interfaces.

## State model

- Form and generated payloads are persisted in `sessionStorage`
- Fine-tune job metadata is written to `training/fine-tune-jobs.json`
- Fine-tuned model IDs are synced into `.env.local`

## Current limitations

- no persistent database for user work
- no auth or per-user tenancy
- no server-side rate limiting yet
- observability is mostly file/env based rather than database backed
