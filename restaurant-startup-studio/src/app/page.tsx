import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(255,95,5,0.20),transparent),radial-gradient(900px_circle_at_90%_30%,rgba(19,41,75,0.18),transparent)]" />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-illini-orange">For first-time restaurant founders</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-illini-blue sm:text-5xl">
            Plan a restaurant startup with calm, structured guidance
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-illini-blue/80">
            Restaurant Startup Studio helps you move from vague dreams to a realistic concept choice and a step-by-step
            playbook—built to be beginner-friendly, not hypey.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            {
              title: "Grounded direction",
              body: "Turn location + budget + goals into three compare-at-a-glance concept cards.",
            },
            {
              title: "Multi-agent manual",
              body: "A structured playbook stitched together from market, finance, ops, marketing, and more.",
            },
            {
              title: "MVP-first engineering",
              body: "Mock agents today; swap in OpenAI and real data sources without rewriting the UI.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-illini-blue/15 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <div className="text-sm font-semibold text-illini-blue">{c.title}</div>
              <p className="mt-2 text-sm leading-6 text-illini-blue/75">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/plan"
            className="inline-flex w-full items-center justify-center rounded-xl bg-illini-orange px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e55500] sm:w-auto"
          >
            Start your plan
          </Link>
          <Link
            href="/manual"
            className="inline-flex w-full items-center justify-center rounded-xl border border-illini-blue/25 bg-white px-6 py-3 text-sm font-semibold text-illini-blue transition hover:bg-illini-ice sm:w-auto"
          >
            View manual page
          </Link>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-illini-blue/60">
          MVP notice: suggestions and manuals are deterministic templates for demonstration. Always validate financial,
          legal, and operational decisions locally.
        </p>
      </div>
    </div>
  );
}
