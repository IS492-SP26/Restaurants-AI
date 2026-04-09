import { buildConceptSuggestions } from "@/data/conceptTemplates";
import { makeDeterministicSeed } from "@/lib/deterministicSeed";
import type { AgentRunContext } from "@/types/agents";
import type { FounderInput } from "@/types/founder";

interface StarterScenario {
  id: string;
  founderInput: FounderInput;
  conceptIndex: number;
}

const STARTER_SCENARIOS: StarterScenario[] = [
  {
    id: "campustown-low-risk-bowls",
    conceptIndex: 0,
    founderInput: {
      locationDescription: "Champaign Campustown near Green Street and student apartments",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "healthy bowls and soup",
      targetCustomerHint: "students and campus staff",
      businessGoalsText: "low risk first business with repeat lunch demand and easy operations",
    },
  },
  {
    id: "urbana-premium-small-plates",
    conceptIndex: 1,
    founderInput: {
      locationDescription: "Downtown Urbana near evening foot traffic and arts events",
      budgetRangeId: "200k_500k",
      cuisineOrConceptHint: "wine bar and shareable small plates",
      targetCustomerHint: "young professionals and date-night guests",
      businessGoalsText: "premium but approachable neighborhood destination with strong evening checks",
    },
  },
  {
    id: "suburban-family-fastcasual",
    conceptIndex: 2,
    founderInput: {
      locationDescription: "Suburban strip center near schools, soccer fields, and weekend shopping",
      budgetRangeId: "200k_500k",
      cuisineOrConceptHint: "signature chicken and rice plates",
      targetCustomerHint: "families and busy parents",
      businessGoalsText: "steady traffic, easy parking, family-friendly service, not late night",
    },
  },
  {
    id: "downtown-breakfast-cafe",
    conceptIndex: 0,
    founderInput: {
      locationDescription: "Downtown office district near commuter rail station",
      budgetRangeId: "under_75k",
      cuisineOrConceptHint: "coffee breakfast sandwiches bakery-lite",
      targetCustomerHint: "commuters and remote workers",
      businessGoalsText: "morning ritual business with dependable weekday volume and low complexity",
    },
  },
  {
    id: "nightlife-snack-window",
    conceptIndex: 1,
    founderInput: {
      locationDescription: "Entertainment district with bars, music venues, and late-night pedestrian traffic",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "loaded fries, fried chicken sandos, milk tea",
      targetCustomerHint: "late-night crowds and service workers",
      businessGoalsText: "capture late demand fast, keep menu focused, maximize throughput",
    },
  },
  {
    id: "airport-corridor-cafe",
    conceptIndex: 0,
    founderInput: {
      locationDescription: "Airport-adjacent hotel corridor with offices and early commuter traffic",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "coffee and simple hot breakfast",
      targetCustomerHint: "travelers, hotel guests, airport workers",
      businessGoalsText: "early daypart focus, predictable staffing, portable menu",
    },
  },
  {
    id: "college-town-fast-casual",
    conceptIndex: 2,
    founderInput: {
      locationDescription: "College town main street with dorms, apartments, and frequent delivery demand",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "Korean street food",
      targetCustomerHint: "students and young locals",
      businessGoalsText: "student-friendly price points, fast service, strong takeout",
    },
  },
  {
    id: "upper-income-neighborhood-bistro",
    conceptIndex: 1,
    founderInput: {
      locationDescription: "Walkable residential corridor with boutique retail and evening diners",
      budgetRangeId: "500k_plus",
      cuisineOrConceptHint: "Mediterranean small plates and wine",
      targetCustomerHint: "locals with premium dining expectations",
      businessGoalsText: "upscale but not formal, great hospitality, strong bar attachment",
    },
  },
  {
    id: "medical-district-lunch",
    conceptIndex: 0,
    founderInput: {
      locationDescription: "Medical district near clinics, offices, and structured parking",
      budgetRangeId: "75k_200k",
      cuisineOrConceptHint: "salads wraps soups",
      targetCustomerHint: "healthcare workers and office lunch crowd",
      businessGoalsText: "weekday lunch speed, predictable prep, healthy brand perception",
    },
  },
  {
    id: "tourist-corridor-family",
    conceptIndex: 2,
    founderInput: {
      locationDescription: "Tourist-heavy shopping corridor with ample parking and weekend peaks",
      budgetRangeId: "200k_500k",
      cuisineOrConceptHint: "wood-fired flatbreads and pasta bowls",
      targetCustomerHint: "families and visitors",
      businessGoalsText: "broad appeal, strong weekend business, controlled menu complexity",
    },
  },
  {
    id: "champaign-downtown-evening",
    conceptIndex: 1,
    founderInput: {
      locationDescription: "Downtown Champaign near bars, events, and evening pedestrian traffic",
      budgetRangeId: "200k_500k",
      cuisineOrConceptHint: "cocktails and elevated comfort food",
      targetCustomerHint: "event-goers and young professionals",
      businessGoalsText: "evening energy, alcohol program, premium vibe, not a giant menu",
    },
  },
  {
    id: "small-town-main-street",
    conceptIndex: 0,
    founderInput: {
      locationDescription: "Small-town main street with courthouse offices and limited competition",
      budgetRangeId: "under_75k",
      cuisineOrConceptHint: "soups sandwiches coffee",
      targetCustomerHint: "locals and office workers",
      businessGoalsText: "safe and steady first business with low waste and repeat orders",
    },
  },
];

export function buildStarterContexts(): Array<{ id: string; ctx: AgentRunContext }> {
  return STARTER_SCENARIOS.map((scenario) => {
    const suggestions = buildConceptSuggestions(scenario.founderInput);
    const selectedConcept =
      suggestions[scenario.conceptIndex % suggestions.length];

    const ctx: AgentRunContext = {
      founderInput: scenario.founderInput,
      selectedConcept,
      deterministicSeed: makeDeterministicSeed(
        scenario.founderInput,
        selectedConcept,
      ),
      agentExecution: {},
    };

    return { id: scenario.id, ctx };
  });
}
