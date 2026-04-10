import type { ConceptOption } from "@/types/founder";

export function ConceptCard(props: {
  concept: ConceptOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const { concept, selected, onSelect } = props;
  return (
    <article
      className={[
        "rounded-2xl border bg-white p-6 shadow-sm",
        selected ? "border-illini-orange ring-2 ring-illini-orange/20" : "border-illini-blue/20 hover:border-illini-blue/35",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-illini-blue">{concept.restaurantType}</h3>
        <button
          type="button"
          onClick={onSelect}
          className={[
            "shrink-0 rounded-xl px-3 py-2 text-sm font-semibold",
            selected
              ? "bg-illini-orange text-white"
              : "border border-illini-blue/25 bg-white text-illini-blue hover:bg-illini-ice",
          ].join(" ")}
        >
          {selected ? "Selected" : "Select"}
        </button>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-illini-blue/60">Budget fit</dt>
          <dd className="mt-1 text-sm text-illini-blue/85">{concept.estimatedBudgetFit}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-illini-blue/60">Opening hours</dt>
          <dd className="mt-1 text-sm text-illini-blue/85">{concept.suggestedOpeningHours}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-illini-blue/60">Target customers</dt>
          <dd className="mt-1 text-sm text-illini-blue/85">{concept.targetCustomers}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-illini-blue/60">Location style</dt>
          <dd className="mt-1 text-sm text-illini-blue/85">{concept.recommendedLocationStyle}</dd>
        </div>
      </dl>

      <p className="mt-5 text-sm leading-6 text-illini-blue/75">{concept.marketFitExplanation}</p>
    </article>
  );
}
