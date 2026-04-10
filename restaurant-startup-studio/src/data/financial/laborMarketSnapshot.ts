/** Illinois county wages from uploaded Q3 2025 CSV (average weekly wage, all industries in file). */
export const ILLINOIS_COUNTY_AVG_WEEKLY_WAGE_Q3_2025 = {
  champaign: { county: "Champaign", fips: "17019", avgWeeklyUsd: 1_309, employment: 95_442 },
  cook: { county: "Cook", fips: "17031", avgWeeklyUsd: 1_618, employment: 2_596_443 },
} as const;

/** BLS usual weekly earnings, full-time wage and salary workers — from uploaded wkyeng.pdf. */
export const US_MEDIAN_WEEKLY_EARNINGS_2025 = {
  allFullTime: 1_204,
  serviceOccupations: { men: 891, women: 732 },
  note: "2025 annual averages; CPS methodology notes in source release apply.",
} as const;
