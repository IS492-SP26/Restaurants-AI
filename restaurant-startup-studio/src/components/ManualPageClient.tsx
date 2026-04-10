"use client";

import { ManualDocument } from "@/components/ManualDocument";
import type { RestaurantStartupManual } from "@/types/agents";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ManualPageClient() {
  const [manual, setManual] = useState<RestaurantStartupManual | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("rs_manual_payload");
    if (!raw) {
      setError("No manual found yet. Generate one from suggestions.");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as RestaurantStartupManual;
      if (!parsed?.sections?.playbook) throw new Error("bad manual");
      setManual(parsed);
    } catch {
      setError("Saved manual is unreadable. Regenerate from suggestions.");
    }
  }, []);

  if (error && !manual) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/plan" className="font-semibold text-illini-blue underline">
            Start over
          </Link>
          <Link href="/suggestions" className="font-semibold text-illini-blue underline">
            Back to suggestions
          </Link>
        </div>
      </div>
    );
  }

  if (!manual) return <div className="text-sm text-illini-blue/75">Loading…</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-illini-blue">Your startup manual</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-illini-blue/75">
            Written in plain language for first-time owners. Marketing, financial, regulatory, and operations sections
            can run through fine-tuned agent slots when your model ids and API key are configured.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/suggestions"
            className="inline-flex items-center justify-center rounded-xl border border-illini-blue/25 bg-white px-4 py-2 text-sm font-semibold text-illini-blue hover:bg-illini-ice"
          >
            Pick a different concept
          </Link>
          <Link
            href="/plan"
            className="inline-flex items-center justify-center rounded-xl bg-illini-orange px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55500]"
          >
            New inputs
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-illini-blue/20 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-illini-blue px-3 py-1 text-xs font-semibold text-white">Regulatory Agent</span>
          <span className="rounded-full border border-illini-blue/25 bg-illini-ice px-3 py-1 text-xs font-medium text-illini-blue">
            Jurisdiction: Champaign / Urbana / Illinois baseline
          </span>
          <span className="rounded-full border border-illini-orange/40 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-900">
            Backed by uploaded docs with fine-tuned model slot + local fallback
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-illini-blue/80">
          The legal checklist is generated from your uploaded regulatory documents and FDA/Illinois standards. Treat this
          as planning support and verify with local authorities before launch.
        </p>
        <p className="mt-2 text-xs text-illini-blue/65">
          Sources: CUPHD Food Service Sanitation Rules, City of Champaign zoning/code excerpts, Illinois Part 750 Food
          Code context, FDA Food Code (Food, Water/Plumbing, Compliance & Enforcement chapters).
        </p>
      </section>

      <ManualDocument manual={manual} />
    </div>
  );
}
