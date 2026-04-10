import { normalizeManualRequest } from "@/lib/normalizeManualRequest";
import { runRestaurantManualPipeline } from "@/lib/runAgentPipeline";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = normalizeManualRequest(body);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Expected { founderInput, selectedConcept } with complete fields matching the API types.",
      },
      { status: 400 },
    );
  }

  const { manual, trace } = await runRestaurantManualPipeline(
    parsed.founderInput,
    parsed.selectedConcept,
  );

  return NextResponse.json({ manual, trace });
}
