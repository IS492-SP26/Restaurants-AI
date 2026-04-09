export interface RegulatoryRule {
  id: string;
  jurisdiction: "city" | "district" | "state" | "federal";
  topic: "permit" | "zoning" | "food-safety" | "water-plumbing" | "haccp" | "enforcement";
  requirement: string;
  sourceTitle: string;
  sourceCitation: string;
}

export const CHAMPAIGN_RULES: RegulatoryRule[] = [
  {
    id: "cuphd-permit-required",
    jurisdiction: "district",
    topic: "permit",
    requirement:
      "A valid CUPHD permit is required to operate a food service establishment, and the permit must be posted in public view.",
    sourceTitle: "CUPHD Food Service Sanitation Rules and Regulations",
    sourceCitation: "Rule 750.4000",
  },
  {
    id: "cuphd-permit-renewal",
    jurisdiction: "district",
    topic: "permit",
    requirement: "Food service permits expire on April 30 unless otherwise noted.",
    sourceTitle: "CUPHD Food Service Sanitation Rules and Regulations",
    sourceCitation: "Rule 750.4000",
  },
  {
    id: "cuphd-manager-cert-posted",
    jurisdiction: "district",
    topic: "permit",
    requirement:
      "A copy of the Illinois Manager Certification Certificate must be prominently posted.",
    sourceTitle: "CUPHD Food Service Sanitation Rules and Regulations",
    sourceCitation: "Rule 750.4000",
  },
  {
    id: "champaign-zoning-compliance",
    jurisdiction: "city",
    topic: "zoning",
    requirement:
      "Use and development must conform to approved plans and zoning requirements before operation.",
    sourceTitle: "City of Champaign Zoning Ordinance",
    sourceCitation: "Sec. 37-5",
  },
  {
    id: "champaign-building-permit-zoning",
    jurisdiction: "city",
    topic: "zoning",
    requirement:
      "Building permit issuance is prohibited unless land development complies with subdivision/zoning requirements.",
    sourceTitle: "City of Champaign Zoning Ordinance",
    sourceCitation: "Sec. 37-6",
  },
  {
    id: "il-food-code-adoption",
    jurisdiction: "state",
    topic: "food-safety",
    requirement:
      "Illinois Part 750 incorporates the FDA 2022 Food Code and applies to food establishments statewide.",
    sourceTitle: "Illinois Administrative Code",
    sourceCitation: "77 Ill. Adm. Code 750.110 and 750.115",
  },
  {
    id: "fda-tcs-hot-cold",
    jurisdiction: "federal",
    topic: "food-safety",
    requirement:
      "TCS food must be held at 135F (57C) or above for hot holding or 41F (5C) or below for cold holding.",
    sourceTitle: "FDA Food Code 2022",
    sourceCitation: "Sec. 3-501.16",
  },
  {
    id: "fda-cooking-thresholds",
    jurisdiction: "federal",
    topic: "food-safety",
    requirement:
      "Core cooking standards include 145F for many intact meats/fish, 155F for comminuted meats, and 165F for poultry.",
    sourceTitle: "FDA Food Code 2022",
    sourceCitation: "Sec. 3-401.11",
  },
  {
    id: "fda-approved-water",
    jurisdiction: "federal",
    topic: "water-plumbing",
    requirement:
      "Drinking water must be from an approved public or compliant nonpublic system and plumbing must prevent backflow.",
    sourceTitle: "FDA Food Code 2022",
    sourceCitation: "Sec. 5-101.11 and 5-203.14",
  },
  {
    id: "fda-handwash-sink-location",
    jurisdiction: "federal",
    topic: "water-plumbing",
    requirement:
      "Handwashing sinks must be available in prep/warewashing areas and in or adjacent to toilet rooms.",
    sourceTitle: "FDA Food Code 2022",
    sourceCitation: "Sec. 5-204.11",
  },
  {
    id: "fda-haccp-plan-contents",
    jurisdiction: "federal",
    topic: "haccp",
    requirement:
      "When HACCP is required, plans must include process flow, CCPs, limits, monitoring, corrective actions, verification, and records.",
    sourceTitle: "FDA Food Code 2022",
    sourceCitation: "Sec. 8-201.14",
  },
  {
    id: "fda-variance-obligation",
    jurisdiction: "federal",
    topic: "enforcement",
    requirement:
      "If a variance is granted, operators must maintain approved procedures and provide records to the regulatory authority.",
    sourceTitle: "FDA Food Code 2022",
    sourceCitation: "Sec. 8-103.12",
  },
];
