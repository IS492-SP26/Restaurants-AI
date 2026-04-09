import { ProgressSteps } from "@/components/ProgressSteps";
import { SuggestionsClient } from "@/components/SuggestionsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concept suggestions",
  description: "Compare three AI-suggested restaurant directions and pick one.",
};

export default function SuggestionsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-illini-blue">Three directions to compare</h1>
        <p className="mt-3 text-sm leading-6 text-illini-blue/75">
          Each card is a structured suggestion with budget fit, hours, and a plain-English rationale.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <ProgressSteps active={2} />
      </div>

      <div className="mt-10">
        <SuggestionsClient />
      </div>
    </div>
  );
}
