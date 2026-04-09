# Telemetry And Observability Plan

## Goal

Make it possible to answer:

- what input produced a bad manual
- which agent produced the weak section
- which prompt/model/version was used
- what data pack version grounded the result
- whether the failure came from validation, model output, or application glue

## What the current repo already captures

- per-agent run metadata in `manual.agentRuns`
- pipeline trace in `trace`
- fine-tune job status in `training/fine-tune-jobs.json`
- live status view at `/agents`

## Recommended production database logs

### `generation_requests`

- `id`
- `created_at`
- `session_id`
- `route` (`/api/suggestions` or `/api/manual`)
- `normalized_founder_input`
- `selected_concept_id`
- `app_version`

### `agent_runs`

- `id`
- `generation_request_id`
- `agent_name`
- `provider`
- `model`
- `mode` (`mock` or `fine_tuned`)
- `latency_ms`
- `source_count`
- `sources_json`
- `status`
- `status_note`

### `manual_outputs`

- `generation_request_id`
- `manual_json`
- `trace_json`
- `rendered_success`

### `fine_tune_jobs`

- `agent_name`
- `job_id`
- `base_model`
- `status`
- `fine_tuned_model`
- `training_file_id`
- `validation_file_id`

## What not to log by default

- raw secrets
- full API keys
- payment details
- unnecessary free-text PII

If full founder text must be logged for debugging, use a restricted environment only.

## Debugging test cases

For each failing case, keep a reproducible debug bundle:

1. normalized founder input
2. selected concept payload
3. agent names and statuses
4. prompt version or prompt file hash
5. model ID
6. returned JSON from each agent
7. final rendered manual

This allows side-by-side comparison of:

- fallback vs fine-tuned output
- old model vs new model
- old prompt vs new prompt

## Operational dashboards to add later

- generation failure rate by route
- average latency by agent
- % of runs using fine-tuned model vs fallback
- top validation failures
- top OpenAI API errors

## Incident workflow

When a manual looks wrong:

1. inspect `/agents` for fine-tune status
2. verify the synced model IDs in `.env.local`
3. inspect `trace` and `manual.agentRuns`
4. replay the same normalized input against the same model version
5. compare outputs to the stored expected use case
