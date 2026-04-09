import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getFinancialAgentSystemPrompt,
  getFinancialAgentUserPrompt,
  getMarketingAgentSystemPrompt,
  getMarketingAgentUserPrompt,
  getOperationsAgentSystemPrompt,
  getOperationsAgentUserPrompt,
  getRegulatoryAgentSystemPrompt,
  getRegulatoryAgentUserPrompt,
} from "@/lib/ai/agentPromptBuilders";
import { buildStarterContexts } from "@/lib/finetune/starterScenarios";
import { runFinancialPlanningAgent } from "@/agents/financialPlanningAgent";
import { runLegalComplianceAgent } from "@/agents/legalComplianceAgent";
import { runMarketingAgent } from "@/agents/marketingAgent";
import { runOperationsAgent } from "@/agents/operationsAgent";

type ChatExample = {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
};

const MODEL_ENV_KEYS = [
  "OPENAI_FINETUNED_MARKETING_MODEL",
  "OPENAI_FINETUNED_FINANCIAL_MODEL",
  "OPENAI_FINETUNED_REGULATORY_MODEL",
  "OPENAI_FINETUNED_OPERATIONS_MODEL",
  "OPENAI_API_KEY",
];

for (const key of MODEL_ENV_KEYS) {
  process.env[key] = "";
}

const starterContexts = buildStarterContexts();

function asJsonl(examples: ChatExample[]): string {
  return examples.map((example) => JSON.stringify(example)).join("\n") + "\n";
}

function splitExamples<T>(items: T[]): { train: T[]; valid: T[] } {
  const train: T[] = [];
  const valid: T[] = [];

  items.forEach((item, index) => {
    if ((index + 1) % 5 === 0) valid.push(item);
    else train.push(item);
  });

  return { train, valid };
}

async function buildMarketingExamples(): Promise<ChatExample[]> {
  const examples: ChatExample[] = [];
  for (const { ctx } of starterContexts) {
    const assistant = await runMarketingAgent(ctx);
    examples.push({
      messages: [
        { role: "system", content: getMarketingAgentSystemPrompt() },
        { role: "user", content: getMarketingAgentUserPrompt(ctx) },
        { role: "assistant", content: JSON.stringify(assistant) },
      ],
    });
  }
  return examples;
}

async function buildFinancialExamples(): Promise<ChatExample[]> {
  const examples: ChatExample[] = [];
  for (const { ctx } of starterContexts) {
    const assistant = await runFinancialPlanningAgent(ctx);
    examples.push({
      messages: [
        { role: "system", content: getFinancialAgentSystemPrompt() },
        { role: "user", content: getFinancialAgentUserPrompt(ctx) },
        { role: "assistant", content: JSON.stringify(assistant) },
      ],
    });
  }
  return examples;
}

async function buildRegulatoryExamples(): Promise<ChatExample[]> {
  const examples: ChatExample[] = [];
  for (const { ctx } of starterContexts) {
    const assistant = await runLegalComplianceAgent(ctx);
    examples.push({
      messages: [
        { role: "system", content: getRegulatoryAgentSystemPrompt() },
        { role: "user", content: getRegulatoryAgentUserPrompt(ctx) },
        { role: "assistant", content: JSON.stringify(assistant) },
      ],
    });
  }
  return examples;
}

async function buildOperationsExamples(): Promise<ChatExample[]> {
  const examples: ChatExample[] = [];
  for (const { ctx } of starterContexts) {
    const assistant = await runOperationsAgent(ctx);
    examples.push({
      messages: [
        { role: "system", content: getOperationsAgentSystemPrompt() },
        { role: "user", content: getOperationsAgentUserPrompt(ctx) },
        { role: "assistant", content: JSON.stringify(assistant) },
      ],
    });
  }
  return examples;
}

async function main() {
  const outputRoot = path.join(process.cwd(), "training");
  await mkdir(outputRoot, { recursive: true });

  const datasets = [
    { slug: "marketing", build: buildMarketingExamples },
    { slug: "financial", build: buildFinancialExamples },
    { slug: "regulatory", build: buildRegulatoryExamples },
    { slug: "operations", build: buildOperationsExamples },
  ] as const;

  const manifest: Record<string, { trainExamples: number; validationExamples: number }> = {};

  for (const dataset of datasets) {
    const examples = await dataset.build();
    const split = splitExamples(examples);
    const dir = path.join(outputRoot, dataset.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "train.jsonl"), asJsonl(split.train), "utf8");
    await writeFile(path.join(dir, "valid.jsonl"), asJsonl(split.valid), "utf8");
    manifest[dataset.slug] = {
      trainExamples: split.train.length,
      validationExamples: split.valid.length,
    };
  }

  await writeFile(
    path.join(outputRoot, "manifest.json"),
    JSON.stringify(
      {
        generatedAtIso: new Date().toISOString(),
        scenarioCount: starterContexts.length,
        datasets: manifest,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    `Built fine-tune starter datasets for ${datasets.length} agents in ${outputRoot}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
