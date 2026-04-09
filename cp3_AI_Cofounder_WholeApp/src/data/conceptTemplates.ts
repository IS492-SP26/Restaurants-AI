import type { BudgetRangeId, ConceptOption, FounderInput } from "@/types/founder";
import { budgetLabel } from "./budgetLabels";

type TemplateGroup = "lean_counter" | "fast_casual_block" | "evening_bistro";

interface ConceptTemplate {
  idSuffix: string;
  group: TemplateGroup;
  restaurantType: string;
  budgetFitFor: BudgetRangeId[];
  locationStyle: string;
  targetCustomers: string;
  openingHours: string;
  explanationLead: string;
}

const TEMPLATES: ConceptTemplate[] = [
  {
    idSuffix: "counter_bowl",
    group: "lean_counter",
    restaurantType: "Fast assembly counter / grain-bowl & soup spot",
    budgetFitFor: ["under_75k", "75k_200k"],
    locationStyle:
      "Food hall stall, transit-adjacent retail strip, or high-foot-traffic corner with weekday lunch demand",
    targetCustomers:
      "Office workers, students, and busy locals who want a repeatable lunch under ~15 minutes",
    openingHours: "Mon–Fri 10:30am–8pm; shorter Sat–Sun if weekend foot traffic is weak",
    explanationLead:
      "Simple menu, batchable prep, and strong takeout potential keep startup costs and complexity lower while still building a brand.",
  },
  {
    idSuffix: "evening_small_plates",
    group: "evening_bistro",
    restaurantType: "Neighborhood small-plates & wine bar",
    budgetFitFor: ["75k_200k", "200k_500k", "500k_plus"],
    locationStyle:
      "Residential corridor with evening activity; look for complementary businesses (no direct cuisine clone next door)",
    targetCustomers:
      "Pairs and small groups celebrating casually; locals who treat the neighborhood as their ‘third place’",
    openingHours: "Tue–Sun 4pm–11pm (kitchen closes ~10:30pm); closed Monday for prep",
    explanationLead:
      "Premium-but-accessible check averages can work if you win on vibe and consistency—not on an oversized menu.",
  },
  {
    idSuffix: "fast_casual_family",
    group: "fast_casual_block",
    restaurantType: "Family-friendly fast-casual with a clear signature dish",
    budgetFitFor: ["75k_200k", "200k_500k"],
    locationStyle:
      "Strip mall or main street near schools, parks, or weekend shopping—parking matters more than ‘trendy’",
    targetCustomers:
      "Families and weekend visitors who want predictable quality, easy kid options, and modest wait times",
    openingHours: "Daily 11am–9pm; earlier weekend lunch if your trade area is activity-heavy",
    explanationLead:
      "A tight menu with one ‘hero’ item simplifies training, inventory, and marketing while supporting steady volume.",
  },
  {
    idSuffix: "breakfast_coffee_kitchen",
    group: "lean_counter",
    restaurantType: "Morning-focused cafe with simple hot food",
    budgetFitFor: ["under_75k", "75k_200k", "200k_500k"],
    locationStyle:
      "Near offices or a commuter path; avoid relying on late-night traffic unless you plan intentional hours",
    targetCustomers:
      "Commuters, remote workers needing a base, and nearby residents who want breakfast and lunch reliably",
    openingHours: "Mon–Sun 7am–3pm (optionally close one weekday for deep clean/prep)",
    explanationLead:
      "Morning dayparts are easier to staff predictably and can build habit loops if your quality is consistent.",
  },
  {
    idSuffix: "late_snack_street",
    group: "fast_casual_block",
    restaurantType: "Late-night snack window (fries, sandos, milk tea-adjacent add-ons)",
    budgetFitFor: ["under_75k", "75k_200k"],
    locationStyle:
      "Near nightlife, theaters, or campuses with late demand; validate noise and trash logistics early",
    targetCustomers:
      "Night-shift workers, students, and night-out crowds looking for familiar comfort food fast",
    openingHours: "Thu–Sat 6pm–2am + selective weekday windows based on demand tests",
    explanationLead:
      "Focused SKUs and a single cooking line can punch above its weight when late demand is real—not assumed.",
  },
];

function seedNumber(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1)
    h = Math.imul(31, h) + seed.charCodeAt(i);
  return Math.abs(h);
}

function pickThreeDistinctIndices(seed: string, length: number): [number, number, number] {
  const base = seedNumber(seed) % length;
  const step = 1 + (seedNumber(`${seed}:step`) % Math.max(1, length - 1));
  const i0 = base % length;
  const i1 = (i0 + step) % length;
  let i2 = (i1 + step) % length;
  if (i2 === i0) i2 = (i2 + 1) % length;
  if (i2 === i1) i2 = (i2 + 1) % length;
  return [i0, i1, i2];
}

function goalsBlob(input: FounderInput): string {
  return `${input.businessGoalsText} ${input.cuisineOrConceptHint ?? ""} ${input.targetCustomerHint ?? ""}`.toLowerCase();
}

function prefersLowRisk(goals: string): boolean {
  return (
    goals.includes("low risk") ||
    goals.includes("low-risk") ||
    goals.includes("safe") ||
    goals.includes("steady")
  );
}

function prefersPremium(goals: string): boolean {
  return goals.includes("premium") || goals.includes("fine") || goals.includes("upscale");
}

function prefersStudents(goals: string): boolean {
  return goals.includes("student");
}

function filterByBudget(t: ConceptTemplate, budget: BudgetRangeId): boolean {
  return t.budgetFitFor.includes(budget);
}

/**
 * Deterministic mock “AI suggestions”. Replace with LLM + real market APIs later.
 */
export function buildConceptSuggestions(input: FounderInput): ConceptOption[] {
  const goals = goalsBlob(input);
  const seed = `${input.locationDescription}|${input.budgetRangeId}|${input.cuisineOrConceptHint ?? ""}|${input.targetCustomerHint ?? ""}|${input.businessGoalsText}`;

  let pool = TEMPLATES.filter((t) => filterByBudget(t, input.budgetRangeId));

  if (prefersPremium(goals)) {
    pool = pool.filter((t) => t.group !== "lean_counter" || t.idSuffix === "breakfast_coffee_kitchen");
  }
  if (prefersLowRisk(goals)) {
    pool = pool.filter((t) => t.idSuffix !== "late_snack_street");
  }
  if (prefersStudents(goals)) {
    pool = [
      ...pool.filter((t) => t.idSuffix === "counter_bowl" || t.idSuffix === "late_snack_street"),
      ...pool,
    ];
  }

  const uniquePool = Array.from(new Map(pool.map((t) => [t.idSuffix, t])).values());
  const working = uniquePool.length >= 3 ? uniquePool : TEMPLATES.filter((t) => filterByBudget(t, input.budgetRangeId));
  const finalPool = working.length >= 3 ? working : TEMPLATES;

  const [a, b, c] = pickThreeDistinctIndices(seed, finalPool.length);
  const picks = [finalPool[a], finalPool[b], finalPool[c]];

  return picks.map((t, idx) => ({
    id: `concept_${t.idSuffix}_${idx}`,
    restaurantType: t.restaurantType,
    estimatedBudgetFit: `${budgetLabel(input.budgetRangeId)} (illustrative — validate with local quotes)`,
    recommendedLocationStyle: t.locationStyle,
    targetCustomers: t.targetCustomers,
    suggestedOpeningHours: t.openingHours,
    marketFitExplanation: `${t.explanationLead} For your described area (“${truncate(input.locationDescription, 120)}”), this concept is framed as a practical match to your stated budget band and goals.`,
  }));
}

function truncate(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
