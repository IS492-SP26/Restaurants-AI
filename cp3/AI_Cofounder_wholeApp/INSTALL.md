# Install And Run

## Prerequisites

- Node.js 20+
- npm 10+
- OpenAI API key if you want to create or use fine-tuned agents

## 1. Install dependencies

```bash
npm install
```

## 2. Create local environment file

Copy `.env.example` to `.env.local` and fill in only the values you need.

```bash
cp .env.example .env.local
```

Important:

- `.env.example` contains placeholders only and must never contain secrets
- `.env.local` is gitignored and is the correct place for local secrets

## 3. Run the app

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Core scripts

- `npm run dev`: start local development server
- `npm run build`: production build
- `npm run start`: run production build locally
- `npm run lint`: run ESLint
- `npm test`: run minimal unit tests
- `npm run test:watch`: run tests in watch mode

## Fine-tuning scripts

- `npm run build:finetune-datasets`: build starter JSONL datasets for marketing, financial, regulatory, and operations agents
- `npm run create:finetune-jobs`: upload datasets and create the 4 fine-tune jobs
- `npm run sync:finetune-models`: pull completed fine-tuned model IDs into `.env.local`

## Required environment variables

### For training jobs

- `OPENAI_API_KEY`
- `OPENAI_FINETUNE_BASE_MODEL`

Optional per-agent overrides:

- `OPENAI_FINETUNE_BASE_MARKETING_MODEL`
- `OPENAI_FINETUNE_BASE_FINANCIAL_MODEL`
- `OPENAI_FINETUNE_BASE_REGULATORY_MODEL`
- `OPENAI_FINETUNE_BASE_OPERATIONS_MODEL`

### For inference with trained agents

- `OPENAI_FINETUNED_MARKETING_MODEL`
- `OPENAI_FINETUNED_FINANCIAL_MODEL`
- `OPENAI_FINETUNED_REGULATORY_MODEL`
- `OPENAI_FINETUNED_OPERATIONS_MODEL`

Optional:

- `OPENAI_BASE_URL`

## Typical fine-tuning flow

1. Add `OPENAI_API_KEY` to `.env.local`
2. Run `npm run build:finetune-datasets`
3. Run `set -a && source .env.local && set +a && npm run create:finetune-jobs`
4. Monitor `http://localhost:3000/agents`
5. After jobs succeed, run `set -a && source .env.local && set +a && npm run sync:finetune-models`
6. Generate a manual from the app and confirm the four fine-tuned agents are active

## Troubleshooting

- If the fine-tune scripts cannot see your env vars, run them with `set -a && source .env.local && set +a && ...`
- If jobs stay in `running` for a long time, check the `/agents` page and your OpenAI account limits
- If the app still shows fallback behavior, run `npm run sync:finetune-models` again and refresh `/agents`
