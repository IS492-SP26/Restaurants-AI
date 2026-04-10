/** Latest complete month in uploaded FRB_H15.csv (Federal Reserve H.15). */
export const FRB_H15_LATEST_PERIOD = "2026-02";

/** Values from FRB_H15.csv row 2026-02 (percent per year unless noted). */
export const FRB_H15_SNAPSHOT = {
  federalFundsEffective: 3.64,
  bankPrimeRate: 6.75,
  treasuryConstantMaturity10Y: 4.13,
  treasuryConstantMaturity3M: 3.69,
} as const;
