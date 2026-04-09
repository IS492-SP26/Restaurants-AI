import type { RestaurantStartupManual } from "@/types/agents";

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-28 rounded-2xl border border-illini-blue/20 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-illini-blue">{props.title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-illini-blue/80">{props.children}</div>
    </section>
  );
}

export function ManualDocument({ manual }: { manual: RestaurantStartupManual }) {
  const s = manual.sections;
  const fineTunedAgents = manual.agentRuns.filter((run) => run.mode === "fine_tuned");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-illini-blue/20 bg-illini-ice/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-illini-blue">{s.playbook.title}</h1>
        <p className="mt-2 text-sm leading-6 text-illini-blue/80">{s.playbook.howToUseThisPlaybook}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-illini-blue/70">
          <span className="rounded-full border border-illini-blue/20 bg-white px-3 py-1">
            Generated: {new Date(manual.generatedAtIso).toLocaleString()}
          </span>
          <span className="rounded-full border border-illini-blue/20 bg-white px-3 py-1">
            Concept: {manual.selectedConcept.restaurantType}
          </span>
          <span className="rounded-full border border-illini-blue/20 bg-white px-3 py-1">
            Fine-tuned agents active: {fineTunedAgents.length}
          </span>
          {fineTunedAgents.map((run) => (
            <span
              key={run.agentName}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-900"
            >
              {run.agentName}
            </span>
          ))}
        </div>
      </div>

      <Section title="1) Concept summary">
        <p>{s.concept.conceptSummary}</p>
        <div>
          <div className="font-medium text-zinc-900">Menu anchors</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {s.concept.menuAnchorIdeas.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="2) Target customer profile">
        <p>{s.customers.profile}</p>
        <ul className="list-disc space-y-1 pl-5">
          {s.customers.notes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="3) Location recommendation logic">
        <p>{s.locationLogic.recommendationNarrative}</p>
        <div className="font-medium text-zinc-900">Selection criteria</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.locationLogic.selectionCriteria.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="4) Competitor overview">
        <p>{s.marketAndCompetitors.locationSummary}</p>
        <div className="font-medium text-zinc-900">What to look for in demand signals</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.marketAndCompetitors.demandSignals.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Neighborhood diligence</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.marketAndCompetitors.neighborhoodNotes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Mock competitor sketches</div>
        <ul className="mt-2 space-y-2">
          {s.marketAndCompetitors.competitorSnapshot.map((c) => (
            <li key={c.name} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-medium text-zinc-900">{c.name}</div>
              <div className="text-zinc-700">{c.positioning}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                Price tier: {c.approximatePriceTier}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5) Startup budget breakdown">
        <div className="mb-4 rounded-xl border border-illini-blue/20 bg-illini-ice/50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-illini-orange px-3 py-1 text-xs font-semibold text-white">
              Financial Agent
            </span>
            <span className="rounded-full border border-illini-blue/25 bg-white px-3 py-1 text-xs font-medium text-illini-blue">
              Inputs: CPI-U, CE Survey, FRB H.15, IL county wages, BLS weekly earnings, startup worksheet
            </span>
            <span className="rounded-full border border-illini-blue/20 px-3 py-1 text-xs text-illini-blue/80">
              Confidence: Medium (structured data + rules)
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-illini-blue/70">
            Figures are snapshots from uploaded files—not personalized forecasts. Replace with your actual bids, payroll, and
            sales model.
          </p>
        </div>
        <p className="font-medium text-zinc-900">{s.financials.roughStartupRangeLabel}</p>
        <ul className="space-y-3">
          {s.financials.budgetBreakdown.map((row) => (
            <li key={row.category} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-medium text-zinc-900">{row.category}</div>
              <div className="text-zinc-700">{row.notes}</div>
              <div className="mt-1 text-xs text-zinc-500">{row.percentOrRange}</div>
            </li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Cash-flow habits</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.financials.cashFlowTips.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="text-sm text-zinc-800">{s.financials.firstYearRealityCheck}</p>
      </Section>

      <Section title="6) Legal / permits / licensing checklist">
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {s.legal.disclaimer}
        </p>
        <div className="font-medium text-zinc-900">Entity topics to review with professionals</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.legal.entityTypesToDiscussWithPro.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Permit checklist (starter)</div>
        <ul className="mt-2 space-y-2">
          {s.legal.permitChecklist.map((p) => (
            <li key={p.item} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-medium text-zinc-900">{p.item}</div>
              <div className="text-zinc-700">{p.whyItMatters}</div>
            </li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Insurance basics</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.legal.insuranceBasics.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="7) Staffing plan">
        <div className="mb-4 rounded-xl border border-illini-blue/20 bg-illini-ice/50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-illini-blue px-3 py-1 text-xs font-semibold text-white">
              Operations Agent
            </span>
            <span className="rounded-full border border-illini-blue/25 bg-white px-3 py-1 text-xs font-medium text-illini-blue">
              Inputs: Champaign sanitation baseline, personnel policy signals, BLS OOH, workflow playbooks, NSF standards
            </span>
            <span className="rounded-full border border-illini-blue/20 px-3 py-1 text-xs text-illini-blue/80">
              Confidence: Medium (structured docs + operational heuristics)
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-illini-blue/70">
            Use this as an execution blueprint, then adapt by your real labor pool, shift volumes, and inspection history.
          </p>
        </div>
        <ul className="space-y-3">
          {s.operations.staffingPlan.map((r) => (
            <li key={r.role} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-medium text-zinc-900">
                {r.role} <span className="font-normal text-zinc-600">({r.headcountAtOpen})</span>
              </div>
              <div className="text-zinc-700">{r.hiringNotes}</div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="8) Suppliers & equipment planning">
        <div className="font-medium text-zinc-900">Supplier categories</div>
        <ul className="mt-2 space-y-2">
          {s.operations.supplierCategories.map((c) => (
            <li key={c.category} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-medium text-zinc-900">{c.category}</div>
              <div className="text-zinc-700">{c.sourcingTips}</div>
            </li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Equipment highlights</div>
        <ul className="mt-2 space-y-2">
          {s.operations.equipmentHighlights.map((e) => (
            <li key={e.area} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-medium text-zinc-900">{e.area}</div>
              <div className="text-zinc-700">{e.starterItems}</div>
            </li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Daily operations rhythm</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.operations.dailyOpsRhythm.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="9) Operations plan">
        <p>
          Your operations module ties together staffing, suppliers, equipment, and daily rhythms. In the full product,
          this section would expand into checklists by daypart and an escalation playbook for common failures.
        </p>
      </Section>

      <Section title="10) Branding & marketing plan">
        <div className="mb-4 rounded-xl border border-illini-blue/20 bg-illini-ice/50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-illini-blue px-3 py-1 text-xs font-semibold text-white">
              Marketing Agent
            </span>
            <span className="rounded-full border border-illini-blue/25 bg-white px-3 py-1 text-xs font-medium text-illini-blue">
              Inputs: market research/STP guides, brand positioning model, Champaign market lists, restaurant marketing playbooks
            </span>
            <span className="rounded-full border border-illini-blue/20 px-3 py-1 text-xs text-illini-blue/80">
              Confidence: Medium (framework + local market docs)
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-illini-blue/70">
            Treat this as a strategy scaffold and validate with live channel metrics (CAC, repeat rate, and review velocity).
          </p>
        </div>
        <p className="font-medium text-zinc-900">{s.marketing.brandPositioningStatement}</p>
        <p>{s.marketing.namingGuidance}</p>
        <div className="font-medium text-zinc-900">Pre-launch</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.marketing.preLaunchChecklist.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Launch week</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.marketing.launchWeekPlaybook.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="font-medium text-zinc-900">Ongoing ideas</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {s.marketing.ongoingMarketingIdeas.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="11) Step-by-step playbook (beginner-friendly)">
        <div className="space-y-4">
          {s.playbook.stepByStepPhases.map((p) => (
            <div key={p.phaseTitle} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-semibold text-zinc-900">{p.phaseTitle}</div>
              <div className="mt-1 text-xs font-medium text-zinc-500">{p.timelineHint}</div>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {p.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="12) Pre-opening checklist">
        <ul className="list-disc space-y-1 pl-5">
          {s.playbook.preOpeningChecklist.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="13) Opening timeline">
        <ul className="space-y-3">
          {s.playbook.openingTimeline.map((t) => (
            <li key={t.weekOffset} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-semibold text-zinc-900">{t.weekOffset}</div>
              <div className="mt-1 text-sm font-medium text-zinc-700">{t.milestone}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {t.ownerTasks.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="14) Risk warnings">
        <ul className="list-disc space-y-1 pl-5">
          {s.playbook.riskWarnings.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section title="15) Beginner mistakes to avoid">
        <ul className="list-disc space-y-1 pl-5">
          {s.playbook.beginnerMistakes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
