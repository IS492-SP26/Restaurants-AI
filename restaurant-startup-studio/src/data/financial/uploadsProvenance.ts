/** Curated snapshots derived from user-uploaded files in `financialAgent/`. */
export const FINANCIAL_DATA_VERSION = "2026-04-07";

export const FINANCIAL_UPLOAD_SOURCES = [
  "cpi-u-202602.xlsx — BLS CPI-U U.S. city average, Feb 2026",
  "cu-all-multi-year-2021-2024.xlsx — BLS Consumer Expenditure Survey, all consumer units",
  "FRB_H15.csv — Federal Reserve Board H.15 selected interest rates",
  "Map 1. Average weekly wages by county in Illinois, third quarter 2025.csv — BLS QCEW-style county export",
  "Startup Costs Worksheet.pdf — SBA-style startup cost categories (illustrative worksheet)",
  "wkyeng.pdf — BLS Usual Weekly Earnings news release (2025 annual)",
] as const;
