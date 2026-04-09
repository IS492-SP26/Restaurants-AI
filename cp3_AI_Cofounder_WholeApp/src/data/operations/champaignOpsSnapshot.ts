export const CHAMPAIGN_FOOD_INSPECTION_BASELINE = {
  permitFeesUsd: {
    category1: 400,
    category2: 300,
    category3: 150,
    temporaryOneDay: 50,
    temporary2To14Days: 75,
    seasonalUpTo6Months: 125,
    reinstatement: 50,
    lateFee: 25,
    reinspectionPerHour: 25,
  },
  inspectionCadence: {
    category1: "at least 3 times/year (one can be approved educational contact)",
    category2: "at least 1 time/year",
    category3: "at least once every 2 years",
  },
  criticalOperationalRule:
    "Critical violations listed by the authority should be corrected during inspection whenever possible.",
} as const;

export const CHAMPAIGN_PERSONNEL_POLICY_SIGNALS = {
  fullTimeHoursPerWeekMin: 30,
  partTimeHoursPerWeekMax: 30,
  includesEEOAndAntiHarassmentPolicy: true,
  includesDisciplineAndGrievanceFramework: true,
} as const;
