import { generateSuggestions } from "@/lib/generateSuggestions";
import { normalizeFounderInput } from "@/lib/normalizeFounderInput";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const founderInput = normalizeFounderInput(body);
  if (!founderInput) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: locationDescription (non-empty string) and budgetRangeId (one of under_75k | 75k_200k | 200k_500k | 500k_plus).",
      },
      { status: 400 },
    );
  }

  const payload = generateSuggestions(founderInput);
  return NextResponse.json(payload);
}
