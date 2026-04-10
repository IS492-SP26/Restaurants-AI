# Financial Raw Sources

This folder stores raw source files used to derive curated snapshots in `src/data/financial/`.

Current files:

- `cpi-u-202602.xlsx` (BLS CPI-U, selected areas)
- `cu-all-multi-year-2021-2024.xlsx` (BLS Consumer Expenditure Survey table)

Notes:

- Parsed values are normalized into typed modules in `src/data/financial/`.
- Keep raw files unchanged; add new vintages with date/version in filename.
