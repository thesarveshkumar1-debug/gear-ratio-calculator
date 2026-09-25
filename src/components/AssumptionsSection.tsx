const ASSUMPTIONS = [
  "Two external spur gears are assumed, meshing on parallel shafts.",
  "Gears are assumed to mesh correctly with no backlash or interference.",
  "Tooth count alone determines the ideal (kinematic) speed ratio.",
  "Shaft and bearing losses are not modeled individually.",
  "Efficiency is represented as a single overall transmission efficiency, not a breakdown by loss source.",
  "Gear deformation, backlash, lubrication losses, bearing losses and thermal effects are not modeled.",
  "This tool is intended for educational and preliminary engineering analysis, not final machine design certification.",
];

export function AssumptionsSection() {
  return (
    <section className="rounded-lg border border-surface-border bg-surface p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Engineering Assumptions
      </h2>
      <ul className="mt-2 space-y-1.5 text-sm text-foreground">
        {ASSUMPTIONS.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        This calculator does not replace engineering design or CAD/CAE software and should not be
        used for final design certification.
      </p>
    </section>
  );
}
