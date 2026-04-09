import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required to create fine-tune jobs.");
}

const client = new OpenAI({
  apiKey,
  baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
});

type AgentSlug = "marketing" | "financial" | "regulatory" | "operations";

const AGENTS: AgentSlug[] = [
  "marketing",
  "financial",
  "regulatory",
  "operations",
];

function baseModelFor(agent: AgentSlug): string {
  const specific = process.env[`OPENAI_FINETUNE_BASE_${agent.toUpperCase()}_MODEL`];
  const shared = process.env.OPENAI_FINETUNE_BASE_MODEL;
  const value = specific?.trim() || shared?.trim();
  if (!value) {
    throw new Error(
      `Missing base model for ${agent}. Set OPENAI_FINETUNE_BASE_MODEL or OPENAI_FINETUNE_BASE_${agent.toUpperCase()}_MODEL.`,
    );
  }
  return value;
}

async function uploadDataset(filePath: string) {
  return client.files.create({
    file: await OpenAI.toFile(
      Buffer.from(await readFile(filePath)),
      path.basename(filePath),
    ),
    purpose: "fine-tune",
  });
}

async function main() {
  const trainingRoot = path.join(process.cwd(), "training");
  const jobs: Array<Record<string, string>> = [];

  for (const agent of AGENTS) {
    const trainPath = path.join(trainingRoot, agent, "train.jsonl");
    const validPath = path.join(trainingRoot, agent, "valid.jsonl");

    const trainingFile = await uploadDataset(trainPath);
    const validationFile = await uploadDataset(validPath);

    const suffix = `restaurant-${agent}-${new Date().toISOString().slice(0, 10)}`;
    const job = await client.fineTuning.jobs.create({
      model: baseModelFor(agent),
      training_file: trainingFile.id,
      validation_file: validationFile.id,
      suffix,
    });

    jobs.push({
      agent,
      baseModel: baseModelFor(agent),
      trainingFileId: trainingFile.id,
      validationFileId: validationFile.id,
      fineTuneJobId: job.id,
      status: job.status,
    });
  }

  const outputPath = path.join(trainingRoot, "fine-tune-jobs.json");
  await writeFile(
    outputPath,
    JSON.stringify(
      {
        createdAtIso: new Date().toISOString(),
        jobs,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Created ${jobs.length} fine-tune jobs. Details written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
