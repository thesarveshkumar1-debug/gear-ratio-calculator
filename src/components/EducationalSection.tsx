export function EducationalSection() {
  return (
    <section className="rounded-lg border border-surface-border bg-surface p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        How Gear Ratio Works
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-surface-border bg-surface-muted p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-driver">
            Larger driven gear
          </p>
          <p className="mt-1 text-sm text-foreground">
            → Lower output speed, higher output torque. More teeth on the driven gear means it
            takes longer to complete one revolution for each revolution of the driver.
          </p>
        </div>
        <div className="rounded-md border border-surface-border bg-surface-muted p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-driven">
            Smaller driven gear
          </p>
          <p className="mt-1 text-sm text-foreground">
            → Higher output speed, lower output torque. Fewer teeth on the driven gear means it
            spins faster for each revolution of the driver.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
        <p>
          <span className="font-semibold">Why torque changes:</span> gear teeth transmit force at
          the pitch radius of each gear. For a given transmitted force, a larger gear has a longer
          moment arm, so it experiences more torque. Because power (force × speed) is conserved in
          an ideal mesh, a speed reduction is always paired with a torque increase, and vice versa.
        </p>
        <p>
          <span className="font-semibold">Why speed changes:</span> two meshing gears must have the
          same linear (tangential) speed at their pitch circles. A gear with more teeth has a larger
          pitch circle, so it must rotate more slowly to match that same linear speed — this is the
          origin of N₂ = N₁ × Z₁ / Z₂.
        </p>
        <p>
          <span className="font-semibold">Why two external gears rotate in opposite directions:</span>{" "}
          when two gears mesh externally, their teeth interlock like two overlapping circles rolling
          against each other. If the driver rotates clockwise, the teeth push the driven gear&apos;s
          teeth to rotate counter-clockwise, and vice versa.
        </p>
        <p>
          <span className="font-semibold">Why efficiency matters:</span> real gear systems lose some
          power to friction between teeth, lubricant drag, and bearing losses. Efficiency expresses
          how much of the input power actually reaches the output shaft — the rest is dissipated as
          heat, which is why actual output torque is always slightly below the ideal value.
        </p>
      </div>
    </section>
  );
}
