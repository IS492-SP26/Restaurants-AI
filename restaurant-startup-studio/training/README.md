# Fine-Tuning Starter Pipeline

This repo can now build starter chat fine-tuning datasets for four agents:

- `marketing`
- `financial`
- `regulatory`
- `operations`

## Build datasets

```bash
npm run build:finetune-datasets
```

This writes:

- `training/marketing/train.jsonl`
- `training/marketing/valid.jsonl`
- `training/financial/train.jsonl`
- `training/financial/valid.jsonl`
- `training/regulatory/train.jsonl`
- `training/regulatory/valid.jsonl`
- `training/operations/train.jsonl`
- `training/operations/valid.jsonl`

The starter datasets are generated from:

- the current uploaded-data packs in `src/data/*`
- the current founder/concept context format used by the app
- the current local fallback outputs used by the four agent modules

## Create fine-tune jobs

Set:

- `OPENAI_API_KEY`
- `OPENAI_FINETUNE_BASE_MODEL`

or per-agent base models:

- `OPENAI_FINETUNE_BASE_MARKETING_MODEL`
- `OPENAI_FINETUNE_BASE_FINANCIAL_MODEL`
- `OPENAI_FINETUNE_BASE_REGULATORY_MODEL`
- `OPENAI_FINETUNE_BASE_OPERATIONS_MODEL`

Then run:

```bash
npm run create:finetune-jobs
```

The script uploads the generated JSONL files and creates four fine-tune jobs, then writes job metadata to `training/fine-tune-jobs.json`.

## Important note

These are **starter datasets**, not production-quality final corpora. The best next upgrade is to replace or extend them with:

- human-edited gold outputs
- more diverse founder scenarios
- negative/edge cases
- examples from real app usage
