import Link from "next/link";

const links = [
  { href: "/plan", label: "Start plan" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/manual", label: "Manual" },
  { href: "/agents", label: "Agents" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-illini-blue/20 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-illini-blue text-sm font-semibold text-white shadow-sm transition-transform group-hover:scale-105">
            RS
          </span>
          <div className="leading-tight">
            <div style={{ fontWeight: 600 }} className="text-sm tracking-tight text-illini-blue">
              Restaurant Startup Studio
            </div>
            <div className="text-xs text-illini-blue/70">AI-guided planning (MVP)</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-illini-blue/80 transition hover:bg-illini-ice hover:text-illini-blue"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/plan"
          className="rounded-xl bg-illini-orange px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#e55500]"
        >
          Begin
        </Link>
      </div>
    </header>
  );
}
