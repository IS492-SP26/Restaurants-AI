# Prompt Package

This directory contains the explicit system-prompt package for the four fine-tuned agents required by the project:

- marketing
- financial
- regulatory
- operations

Source of truth in runtime code:

- `src/lib/ai/agentPromptBuilders.ts`

Connector layer used to assemble grounded context:

- `src/lib/connectors/agentDataConnectors.ts`

Model settings:

- `src/lib/ai/models.ts`
- `.env.example`
- `scripts/create-finetune-jobs.ts`

The markdown files in this directory mirror the runtime system prompts so reviewers can inspect prompts without reading source code.
