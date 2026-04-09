import OpenAI from "openai";
import { getOpenAIApiKey, recordAgentExecution } from "./models";
import type {
  AgentCitation,
  AgentRunContext,
  AgentRuntimeName,
} from "@/types/agents";

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI | null {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) return null;
  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
    });
  }
  return cachedClient;
}

interface StructuredAgentRequest<T> {
  agentName: AgentRuntimeName;
  ctx: AgentRunContext;
  model: string | null;
  schemaName: string;
  schema: Record<string, unknown>;
  systemPrompt: string;
  userPrompt: string;
  sources: AgentCitation[];
  validate: (value: unknown) => value is T;
  fallback: () => T;
}

function noteFromError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Unknown model call error.";
}

export async function runStructuredAgentWithFallback<T>(
  request: StructuredAgentRequest<T>,
): Promise<T> {
  const client = getClient();

  if (!client || !request.model) {
    recordAgentExecution(request.ctx, {
      agentName: request.agentName,
      mode: "mock",
      provider: "local",
      model: request.model ?? undefined,
      sourceCount: request.sources.length,
      sources: request.sources,
      statusNote: !client
        ? "OPENAI_API_KEY not configured."
        : "Fine-tuned model id not configured.",
    });
    return request.fallback();
  }

  try {
    const response = await client.chat.completions.create({
      model: request.model,
      temperature: 0.2,
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: request.schemaName,
          strict: true,
          schema: request.schema,
        },
      } as never,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Model returned empty content.");

    const parsed = JSON.parse(content);
    if (!request.validate(parsed)) {
      throw new Error("Model returned schema-incompatible JSON.");
    }

    recordAgentExecution(request.ctx, {
      agentName: request.agentName,
      mode: "fine_tuned",
      provider: "openai",
      model: request.model,
      sourceCount: request.sources.length,
      sources: request.sources,
    });

    return parsed;
  } catch (error) {
    recordAgentExecution(request.ctx, {
      agentName: request.agentName,
      mode: "mock",
      provider: "local",
      model: request.model,
      sourceCount: request.sources.length,
      sources: request.sources,
      statusNote: `Fell back to local template: ${noteFromError(error)}`,
    });
    return request.fallback();
  }
}
