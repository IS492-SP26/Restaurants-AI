import type {
  AgentRunContext,
  ConceptStrategyAgentOutput,
  FinancialPlanningAgentOutput,
  LegalComplianceAgentOutput,
  ManualComposerOutput,
  MarketResearchAgentOutput,
  MarketingAgentOutput,
  OperationsAgentOutput,
} from "@/types/agents";

export interface ManualComposerInput {
  ctx: AgentRunContext;
  market: MarketResearchAgentOutput;
  concept: ConceptStrategyAgentOutput;
  financials: FinancialPlanningAgentOutput;
  legal: LegalComplianceAgentOutput;
  operations: OperationsAgentOutput;
  marketing: MarketingAgentOutput;
}

export async function runManualComposerAgent(
  input: ManualComposerInput,
): Promise<ManualComposerOutput> {
  const { ctx, market, concept, financials, legal, operations, marketing } = input;
  void legal;

  return {
    title: `Startup Playbook: ${ctx.selectedConcept.restaurantType}`,
    howToUseThisPlaybook:
      "Read once end-to-end, then execute week-by-week. Check off items only after you’ve done the underlying work—not when you ‘intend’ to do it.",
    stepByStepPhases: [
      {
        phaseTitle: "Phase 0 — Decide if the concept is worth pursuing",
        timelineHint: "1–2 weeks",
        actions: [
          "Walk the trade area at the hours you plan to operate",
          "Do a honest competitive speed/price/quality benchmark",
          "Write a one-page concept thesis: who you serve, what you promise, what you refuse to do",
        ],
      },
      {
        phaseTitle: "Phase 1 — Budget, entity basics, and timeline",
        timelineHint: "2–4 weeks (often longer with alcohol)",
        actions: [
          `Size startup needs against your band: ${financials.roughStartupRangeLabel}`,
          "Build a rent ‘stress test’: can you survive slower months?",
          "Start permit threads early; avoid signing aggressive deadlines before approvals",
        ],
      },
      {
        phaseTitle: "Phase 2 — Menu engineering + vendor setup",
        timelineHint: "2–6 weeks",
        actions: [
          "Lock a small menu with written specs and target food cost assumption",
          "Choose suppliers with realistic minimums for your predicted volume",
          "Create a training tasting cadence: managers taste daily early on",
        ],
      },
      {
        phaseTitle: "Phase 3 — Hiring, training, and rehearsal",
        timelineHint: "2–5 weeks",
        actions: operations.staffingPlan.slice(0, 4).map(
          (r) => `Staffing intent: ${r.role} — ${r.hiringNotes}`,
        ),
      },
      {
        phaseTitle: "Phase 4 — Launch marketing + opening week execution",
        timelineHint: "Launch week + first 30 days",
        actions: marketing.launchWeekPlaybook,
      },
    ],
    preOpeningChecklist: [
      "Health department walkthrough readiness mock (self-inspection checklist)",
      "Allergen communication plan posted and trained",
      "POS + payment processing tested under pretend rush",
      "Open/close checklists printed and assigned",
      "Vendor backup contacts saved in shared doc",
      ...marketing.preLaunchChecklist,
    ],
    openingTimeline: [
      {
        weekOffset: "12–8 weeks before open",
        milestone: "Permits + design decisions moving",
        ownerTasks: [
          "Finalize floor plan basics with equipment needs",
          "Align landlord delivery conditions and utilities",
        ],
      },
      {
        weekOffset: "8–4 weeks before open",
        milestone: "Build-out + equipment arriving",
        ownerTasks: [
          "Install schedules and inspection contingencies",
          "Begin hiring interviews and training plan",
        ],
      },
      {
        weekOffset: "4–2 weeks before open",
        milestone: "Training + soft services",
        ownerTasks: [
          "Rehearsal services with timed tickets",
          "Tune recipes based on real prep flow",
        ],
      },
      {
        weekOffset: "Opening week",
        milestone: "Public opening",
        ownerTasks: [
          "Daily team huddle: top failures + fixes",
          "Track ticket times, comps, and guest complaints by category",
        ],
      },
    ],
    riskWarnings: [
      ...market.cautions,
      "Signing a personal guarantee without modeling downside scenarios.",
      "Underfunding payroll tax, maintenance, and small repairs.",
    ],
    beginnerMistakes: concept.nonNegotiablesForBeginners,
  };
}
