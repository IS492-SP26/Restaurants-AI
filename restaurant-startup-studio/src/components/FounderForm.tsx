"use client";

import type { BudgetRangeId, FounderInput } from "@/types/founder";
import { BUDGET_RANGE_LABELS } from "@/data/budgetLabels";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BUDGET_OPTIONS: BudgetRangeId[] = [
  "under_75k",
  "75k_200k",
  "200k_500k",
  "500k_plus",
];

export function FounderForm() {
  const router = useRouter();
  const [locationDescription, setLocationDescription] = useState("");
  const [budgetRangeId, setBudgetRangeId] = useState<BudgetRangeId>("75k_200k");
  const [cuisineOrConceptHint, setCuisineOrConceptHint] = useState("");
  const [targetCustomerHint, setTargetCustomerHint] = useState("");
  const [businessGoalsText, setBusinessGoalsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const founderInput: FounderInput = {
      locationDescription: locationDescription.trim(),
      budgetRangeId,
      cuisineOrConceptHint: cuisineOrConceptHint.trim() || undefined,
      targetCustomerHint: targetCustomerHint.trim() || undefined,
      businessGoalsText: businessGoalsText.trim(),
    };

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(founderInput),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Could not generate suggestions.");
        setIsSubmitting(false);
        return;
      }

      sessionStorage.setItem("rs_suggestions_payload", JSON.stringify(data));
      router.push("/suggestions");
    } catch {
      setError("Network error. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-illini-blue" htmlFor="location">
          City / neighborhood / target area
        </label>
        <textarea
          id="location"
          required
          rows={3}
          value={locationDescription}
          onChange={(e) => setLocationDescription(e.target.value)}
          placeholder="Example: “Midtown near X university, walking distance to two office towers.”"
          className="w-full rounded-xl border border-illini-blue/20 bg-white px-4 py-3 text-sm text-illini-blue shadow-sm outline-none focus:border-illini-orange"
        />
        <p className="text-xs text-illini-blue/60">Be as specific as you can—this helps the mock engine pick sensible themes.</p>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-illini-blue">Startup budget range</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {BUDGET_OPTIONS.map((id) => (
            <label
              key={id}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 shadow-sm",
                budgetRangeId === id ? "border-illini-orange ring-1 ring-illini-orange/30" : "border-illini-blue/20 hover:border-illini-blue/35",
              ].join(" ")}
            >
              <input
                type="radio"
                name="budget"
                className="mt-1"
                checked={budgetRangeId === id}
                onChange={() => setBudgetRangeId(id)}
              />
              <span className="text-sm text-illini-blue">{BUDGET_RANGE_LABELS[id]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-illini-blue" htmlFor="cuisine">
          Cuisine or concept hint (optional)
        </label>
        <input
          id="cuisine"
          value={cuisineOrConceptHint}
          onChange={(e) => setCuisineOrConceptHint(e.target.value)}
          placeholder="Korean street snacks, breakfast tacos, wine bar…"
          className="w-full rounded-xl border border-illini-blue/20 bg-white px-4 py-3 text-sm text-illini-blue shadow-sm outline-none focus:border-illini-orange"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-illini-blue" htmlFor="customers">
          Target customers (optional)
        </label>
        <input
          id="customers"
          value={targetCustomerHint}
          onChange={(e) => setTargetCustomerHint(e.target.value)}
          placeholder="Students, young families, office lunch crowd…"
          className="w-full rounded-xl border border-illini-blue/20 bg-white px-4 py-3 text-sm text-illini-blue shadow-sm outline-none focus:border-illini-orange"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-illini-blue" htmlFor="goals">
          Business goals
        </label>
        <textarea
          id="goals"
          rows={4}
          value={businessGoalsText}
          onChange={(e) => setBusinessGoalsText(e.target.value)}
          placeholder="Examples: low-risk first business, fast profit in 12 months, premium dining, avoid late-night ops…"
          className="w-full rounded-xl border border-illini-blue/20 bg-white px-4 py-3 text-sm text-illini-blue shadow-sm outline-none focus:border-illini-orange"
        />
        <p className="text-xs text-illini-blue/60">Write in your own words. The MVP mock engine scans for simple keywords like “student” or “premium.”</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-illini-orange px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e55500] disabled:opacity-60"
        >
          {isSubmitting ? "Generating ideas…" : "Generate 3 restaurant directions"}
        </button>
        <p className="text-xs text-illini-blue/60">Next: you’ll compare cards and pick one to build a manual.</p>
      </div>
    </form>
  );
}
