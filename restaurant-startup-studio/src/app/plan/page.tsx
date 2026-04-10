import { FounderForm } from "@/components/FounderForm";
import { ProgressSteps } from "@/components/ProgressSteps";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your basics",
  description: "Tell us your location, budget, and goals to generate restaurant directions.",
};

export default function PlanPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-illini-blue">Start with the basics</h1>
        <p className="mt-3 text-sm leading-6 text-illini-blue/75">
          No perfect answers needed. The MVP uses your inputs to choose three realistic concept cards you can compare.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <ProgressSteps active={1} />
      </div>

      <div className="mt-10">
        <FounderForm />
      </div>
    </div>
  );
}
