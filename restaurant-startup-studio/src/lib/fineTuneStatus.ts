import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

interface StoredFineTuneJob {
  agent: string;
  baseModel: string;
  trainingFileId: string;
  validationFileId: string;
  fineTuneJobId: string;
  status: string;
}

interface StoredFineTuneJobsFile {
  createdAtIso: string;
  jobs: StoredFineTuneJob[];
}

export interface FineTuneAgentStatus {
  agent: string;
  baseModel: string;
  trainingFileId: string;
  validationFileId: string;
  fineTuneJobId: string;
  storedStatus: string;
  liveStatus: string | null;
  fineTunedModel: string | null;
  configuredModel: string | null;
  error?: string;
}

export interface FineTuneStatusSnapshot {
  createdAtIso: string | null;
  hasApiKey: boolean;
  jobs: FineTuneAgentStatus[];
}

const ENV_KEY_BY_AGENT: Record<string, string> = {
  marketing: "OPENAI_FINETUNED_MARKETING_MODEL",
  financial: "OPENAI_FINETUNED_FINANCIAL_MODEL",
  regulatory: "OPENAI_FINETUNED_REGULATORY_MODEL",
  operations: "OPENAI_FINETUNED_OPERATIONS_MODEL",
};

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readLocalEnvFile(): Promise<Record<string, string>> {
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const raw = await readFile(envPath, "utf8");
    const values: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex < 0) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim();
      values[key] = value;
    }
    return values;
  } catch {
    return {};
  }
}

export async function getFineTuneStatusSnapshot(): Promise<FineTuneStatusSnapshot> {
  const jobsPath = path.join(process.cwd(), "training", "fine-tune-jobs.json");
  const stored = await readJsonFile<StoredFineTuneJobsFile>(jobsPath);
  const localEnv = await readLocalEnvFile();
  const apiKey = process.env.OPENAI_API_KEY?.trim() || localEnv.OPENAI_API_KEY?.trim() || "";
  const baseURL = process.env.OPENAI_BASE_URL?.trim() || localEnv.OPENAI_BASE_URL?.trim() || undefined;

  if (!stored) {
    return {
      createdAtIso: null,
      hasApiKey: Boolean(apiKey),
      jobs: [],
    };
  }

  const initialJobs: FineTuneAgentStatus[] = stored.jobs.map((job) => ({
    agent: job.agent,
    baseModel: job.baseModel,
    trainingFileId: job.trainingFileId,
    validationFileId: job.validationFileId,
    fineTuneJobId: job.fineTuneJobId,
    storedStatus: job.status,
    liveStatus: null,
    fineTunedModel: null,
    configuredModel: localEnv[ENV_KEY_BY_AGENT[job.agent]] || null,
  }));

  if (!apiKey) {
    return {
      createdAtIso: stored.createdAtIso,
      hasApiKey: false,
      jobs: initialJobs,
    };
  }

  const client = new OpenAI({ apiKey, baseURL });
  const jobs = await Promise.all(
    initialJobs.map(async (job) => {
      try {
        const remote = await client.fineTuning.jobs.retrieve(job.fineTuneJobId);
        return {
          ...job,
          liveStatus: remote.status,
          fineTunedModel: remote.fine_tuned_model ?? null,
        };
      } catch (error) {
        return {
          ...job,
          error: error instanceof Error ? error.message : "Could not retrieve fine-tune job.",
        };
      }
    }),
  );

  return {
    createdAtIso: stored.createdAtIso,
    hasApiKey: true,
    jobs,
  };
}
