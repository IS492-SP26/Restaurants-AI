# Use Cases

## Core product use cases

### 1. Founder generates restaurant concepts

Input:

- location
- budget band
- optional cuisine hint
- optional target customer hint
- business goals

Expected result:

- `/api/suggestions` validates input
- app returns three concept cards
- payload is stored locally for the next step

Critical files:

- `src/components/FounderForm.tsx`
- `src/app/api/suggestions/route.ts`
- `src/lib/normalizeFounderInput.ts`
- `src/data/conceptTemplates.ts`

### 2. Founder selects a concept and generates a manual

Input:

- normalized founder input
- selected concept card

Expected result:

- `/api/manual` validates request
- pipeline runs all agent sections
- manual and trace return to the client
- manual renders in `/manual`

Critical files:

- `src/components/SuggestionsClient.tsx`
- `src/app/api/manual/route.ts`
- `src/lib/normalizeManualRequest.ts`
- `src/lib/runAgentPipeline.ts`
- `src/components/ManualDocument.tsx`

### 3. Fine-tune operator builds and monitors the four training jobs

Input:

- local uploaded-data packs
- starter scenarios
- OpenAI API key

Expected result:

- datasets generated under `training/`
- four jobs created
- `/agents` page shows status and model IDs

Critical files:

- `scripts/build-finetune-datasets.ts`
- `scripts/create-finetune-jobs.ts`
- `scripts/sync-finetune-models.ts`
- `src/app/agents/page.tsx`

## Minimal tests included

The current minimal automated tests focus on the highest-value failure points:

1. founder input normalization rejects invalid input and trims valid input
2. manual request normalization validates the required shape
3. manual pipeline returns a complete manual with trace entries and agent run metadata

These are unit tests rather than e2e tests because they give fast coverage over the most brittle server-side behavior with low setup cost.

## Suggested next tests

- POST `/api/suggestions` integration test
- POST `/api/manual` integration test
- one end-to-end browser test covering `/plan -> /suggestions -> /manual`
- negative test for missing `sessionStorage` payloads
