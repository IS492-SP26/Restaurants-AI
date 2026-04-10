export const RESTAURANT_WORKFLOW_PLAYBOOK = {
  coreMetrics: [
    "ticket time by station and daypart",
    "table turn time / order cycle time",
    "orders per labor hour",
    "waste by reason code",
  ],
  fastWeekRoadmap: [
    "Day 1: map bottlenecks and observe station handoffs",
    "Day 2: simplify menu and remove low-velocity complexity",
    "Day 3: standardize station SOP checklists",
    "Day 4: run focused cross-training and pre-shift huddles",
    "Day 5: tune POS/KDS/printer routing and 86 alerts",
    "Day 6: run service simulation and collect error logs",
    "Day 7: review KPIs and lock next-week corrective actions",
  ],
  kitchenFlowPrinciples: [
    "separate prep/cook/plating/cleaning zones",
    "use FIFO and date labels consistently",
    "keep meat and produce workflows segregated",
    "reduce handoff ambiguity between FOH and BOH",
  ],
} as const;
