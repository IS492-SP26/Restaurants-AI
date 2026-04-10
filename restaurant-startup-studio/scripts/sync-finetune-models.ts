import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required to sync fine-tuned model ids.");
}

const client = new OpenAI({
  apiKey,
  baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
});

const ENV_KEY_BY_AGENT: Record<string, string> = {
  marketing: "OPENAI_FINETUNED_MARKETING_MODEL",
  financial: "OPENAI_FINETUNED_FINANCIAL_MODEL",
  regulatory: "OPENAI_FINETUNED_REGULATORY_MODEL",
  operations: "OPENAI_FINETUNED_OPERATIONS_MODEL",
};

async function main() {
  const root = process.cwd();
  const jobsPath = path.join(root, "training", "fine-tune-jobs.json");
  const envPath = path.join(root, ".env.local");

  const jobsFile = JSON.parse(await readFile(jobsPath, "utf8")) as {
    jobs: Array<{ agent: string; fineTuneJobId: string }>;
  };

  const existingEnv = await readFile(envPath, "utf8");
  const lines = existingEnv.split(/\r?\n/);
  const replacements = new Map<string, string>();

  for (const job of jobsFile.jobs) {
    const remoteJob = await client.fineTuning.jobs.retrieve(job.fineTuneJobId);
    const envKey = ENV_KEY_BY_AGENT[job.agent];
    if (!envKey || !remoteJob.fine_tuned_model) continue;
    replacements.set(envKey, remoteJob.fine_tuned_model);
  }

  if (replacements.size === 0) {
    console.log("No completed fine-tuned models found yet.");
    return;
  }

  const nextLines = lines.map((line) => {
    const [key] = line.split("=");
    if (replacements.has(key)) return `${key}=${replacements.get(key)}`;
    return line;
  });

  for (const [key, value] of replacements) {
    if (!nextLines.some((line) => line.startsWith(`${key}=`))) {
      nextLines.push(`${key}=${value}`);
    }
  }

  await writeFile(envPath, `${nextLines.filter(Boolean).join("\n")}\n`, "utf8");
  console.log(`Updated .env.local with ${replacements.size} fine-tuned model id(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
