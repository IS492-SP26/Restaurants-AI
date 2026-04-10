const steps = [
  { n: 1, label: "Basics", href: "/plan" },
  { n: 2, label: "Ideas", href: "/suggestions" },
  { n: 3, label: "Manual", href: "/manual" },
] as const;

export function ProgressSteps(props: { active: 1 | 2 | 3 }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((s) => {
          const isActive = s.n === props.active;
          const isDone = s.n < props.active;
          return (
            <li key={s.n} className="flex flex-1 flex-col items-center text-center">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                  isDone
                    ? "border-illini-blue bg-illini-blue text-white"
                    : isActive
                      ? "border-illini-orange bg-white text-illini-orange"
                      : "border-illini-blue/20 bg-white text-illini-blue/40",
                ].join(" ")}
              >
                {isDone ? "✓" : s.n}
              </div>
              <div
                className={[
                  "mt-2 text-xs font-medium",
                  isActive || isDone ? "text-illini-blue" : "text-illini-blue/45",
                ].join(" ")}
              >
                {s.label}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-illini-blue/25 to-transparent" />
    </div>
  );
}
