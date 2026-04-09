"use client";

import { ConceptCard } from "@/components/ConceptCard";
import type { SuggestionsResponse } from "@/types/founder";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function SuggestionsClient() {
  const router = useRouter();
  const [payload, setPayload] = useState<SuggestionsResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rs_suggestions_payload");
    if (!raw) {
      setError("No suggestions found yet. Start from the plan page.");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as SuggestionsResponse;
      if (!parsed?.concepts?.length) throw new Error("bad payload");
      setPayload(parsed);
    } catch {
      setError("Saved suggestions are unreadable. Please regenerate from the plan page.");
    }
  }, []);

  const selected = useMemo(() => {
    if (!payload || !selectedId) return null;
    return payload.concepts.find((c) => c.id === selectedId) ?? null;
  }, [payload, selectedId]);

  async function generateManual() {
    if (!payload || !selected) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/manual", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          founderInput: payload.normalizedInput,
          selectedConcept: selected,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Could not generate manual.");
        setIsGenerating(false);
        return;
      }
      sessionStorage.setItem("rs_manual_payload", JSON.stringify(data.manual));
      router.push("/manual");
    } catch {
      setError("Network error. Try again.");
      setIsGenerating(false);
    }
  }

  if (error && !payload) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </div>
        <Link href="/plan" className="inline-flex text-sm font-semibold text-illini-blue underline">
          Go to the plan form
        </Link>
      </div>
    );
  }

  if (!payload) {
    return <div className="text-sm text-illini-blue/75">Loading…</div>;
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
      ) : null}

      <div className="grid gap-6">
        {payload.concepts.map((c) => (
          <ConceptCard
            key={c.id}
            concept={c}
            selected={c.id === selectedId}
            onSelect={() => setSelectedId(c.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-illini-blue/20 bg-illini-ice/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-illini-blue/80">
          {selected ? (
            <span>
              Selected: <span className="font-semibold text-illini-blue">{selected.restaurantType}</span>
            </span>
          ) : (
            "Select a card to generate your startup manual."
          )}
        </div>
        <button
          type="button"
          disabled={!selected || isGenerating}
          onClick={generateManual}
          className="inline-flex items-center justify-center rounded-xl bg-illini-orange px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e55500] disabled:opacity-50"
        >
          {isGenerating ? "Running agents…" : "Generate startup manual"}
        </button>
      </div>

      <p className="text-xs text-illini-blue/60">
        The manual is assembled from multiple mock agents (market, concept, finance, legal, operations, marketing,
        composer). Later, swap each agent module for real model calls.
      </p>
    </div>
  );
}
