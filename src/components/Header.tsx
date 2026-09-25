import { Cog } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-surface-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-5 sm:px-6">
        <span className="w-fit rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
          Mechanical Engineering Tool
        </span>
        <div className="mt-1 flex items-center gap-2.5">
          <Cog className="text-accent" size={26} aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Gear Ratio &amp; Speed Calculator
          </h1>
        </div>
        <p className="text-sm text-muted">Mechanical power transmission analysis tool</p>
      </div>
    </header>
  );
}
