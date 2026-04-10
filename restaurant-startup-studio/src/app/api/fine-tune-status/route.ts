import { getFineTuneStatusSnapshot } from "@/lib/fineTuneStatus";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getFineTuneStatusSnapshot();
  return NextResponse.json(snapshot);
}
