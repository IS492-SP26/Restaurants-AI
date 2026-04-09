import { getFineTuneStatusSnapshot } from "@/lib/fineTuneStatus";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agent status",
  description: "Monitor the four fine-tuned restaurant planning agent jobs and configured model ids.",
};

function badgeClasses(status: string | null): string {
  if (status === "succeeded") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (status === "running") return "border-sky-200 bg-sky-50 text-sky-900";
  if (status === "validating_files") return "border-amber-200 bg-amber-50 text-amber-900";
  if (status === "failed" || status === "cancelled") return "border-red-200 bg-red-50 text-red-900";
  return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

export default async function AgentsPage() {
  const snapshot = await getFineTuneStatusSnapshot();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-illini-blue">AI agent status</h1>
        <p className="mt-3 text-sm leading-6 text-illini-blue/75">
          This page shows the 4 fine-tune jobs for marketing, financial, regulatory, and operations. It reads your local
          job file and checks OpenAI for live status when your API key is available.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-illini-blue/20 bg-white px-3 py-1 text-illini-blue">
            Job file created: {snapshot.createdAtIso ? new Date(snapshot.createdAtIso).toLocaleString() : "Not found"}
          </span>
          <span
            className={[
              "rounded-full border px-3 py-1",
              snapshot.hasApiKey
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900",
            ].join(" ")}
          >
            API key detected: {snapshot.hasApiKey ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {snapshot.jobs.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          No fine-tune jobs file found yet. Run `npm run create:finetune-jobs` first.
        </div>
      ) : (
        <div className="mt-10 grid gap-5">
          {snapshot.jobs.map((job) => {
            const status = job.liveStatus ?? job.storedStatus;
            return (
              <section key={job.fineTuneJobId} className="rounded-2xl border border-illini-blue/20 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-illini-blue">{job.agent} agent</h2>
                    <p className="mt-1 text-sm text-illini-blue/70">Base model: {job.baseModel}</p>
                  </div>
                  <span className={["rounded-full border px-3 py-1 text-xs font-medium", badgeClasses(status)].join(" ")}>
                    Status: {status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-illini-blue/80 sm:grid-cols-2">
                  <div className="rounded-xl bg-illini-ice/60 p-4">
                    <div className="font-medium text-illini-blue">Fine-tune job id</div>
                    <div className="mt-1 break-all font-mono text-xs">{job.fineTuneJobId}</div>
                  </div>
                  <div className="rounded-xl bg-illini-ice/60 p-4">
                    <div className="font-medium text-illini-blue">Configured model id</div>
                    <div className="mt-1 break-all font-mono text-xs">
                      {job.configuredModel ?? "Not written to .env.local yet"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-illini-ice/60 p-4">
                    <div className="font-medium text-illini-blue">Remote fine-tuned model</div>
                    <div className="mt-1 break-all font-mono text-xs">{job.fineTunedModel ?? "Not ready yet"}</div>
                  </div>
                  <div className="rounded-xl bg-illini-ice/60 p-4">
                    <div className="font-medium text-illini-blue">Training / validation files</div>
                    <div className="mt-1 font-mono text-xs">train: {job.trainingFileId}</div>
                    <div className="mt-1 font-mono text-xs">valid: {job.validationFileId}</div>
                  </div>
                </div>

                {job.error ? (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                    {job.error}
                  </p>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
