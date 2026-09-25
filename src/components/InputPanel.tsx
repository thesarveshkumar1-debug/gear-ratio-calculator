import type { FieldError, GearInputs } from "@/types/gear";
import type { RawGearInputs } from "@/lib/validation";
import { NumberField } from "./NumberField";

interface InputPanelProps {
  raw: RawGearInputs;
  errors: FieldError[];
  onChange: (field: keyof RawGearInputs, value: string) => void;
}

function errorFor(errors: FieldError[], field: keyof GearInputs): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

export function InputPanel({ raw, errors, onChange }: InputPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section
        className="rounded-lg border border-surface-border bg-surface p-4"
        aria-labelledby="driver-heading"
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-driver" aria-hidden="true" />
          <h3 id="driver-heading" className="text-sm font-semibold tracking-wide text-foreground">
            Driver Gear
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-muted">Input shaft — drives the system</p>

        <div className="mt-4 flex flex-col gap-4">
          <NumberField
            id="driverTeeth"
            label="Number of Teeth"
            value={raw.driverTeeth}
            onChange={(v) => onChange("driverTeeth", v)}
            unit="Z₁"
            min={1}
            error={errorFor(errors, "driverTeeth")}
          />
          <NumberField
            id="inputRPM"
            label="Input Speed"
            value={raw.inputRPM}
            onChange={(v) => onChange("inputRPM", v)}
            unit="RPM"
            min={0}
            step="1"
            error={errorFor(errors, "inputRPM")}
          />
          <NumberField
            id="inputTorque"
            label="Input Torque"
            value={raw.inputTorque}
            onChange={(v) => onChange("inputTorque", v)}
            unit="N·m"
            min={0}
            step="0.1"
            error={errorFor(errors, "inputTorque")}
          />
        </div>
      </section>

      <section
        className="rounded-lg border border-surface-border bg-surface p-4"
        aria-labelledby="driven-heading"
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-driven" aria-hidden="true" />
          <h3 id="driven-heading" className="text-sm font-semibold tracking-wide text-foreground">
            Driven Gear
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-muted">Output shaft — driven by the system</p>

        <div className="mt-4 flex flex-col gap-4">
          <NumberField
            id="drivenTeeth"
            label="Number of Teeth"
            value={raw.drivenTeeth}
            onChange={(v) => onChange("drivenTeeth", v)}
            unit="Z₂"
            min={1}
            error={errorFor(errors, "drivenTeeth")}
          />
          <NumberField
            id="efficiencyPercent"
            label="Mechanical Efficiency"
            value={raw.efficiencyPercent}
            onChange={(v) => onChange("efficiencyPercent", v)}
            unit="%"
            min={0}
            step="1"
            helpText="Lumped efficiency for friction, windage and other losses."
            error={errorFor(errors, "efficiency")}
          />
        </div>
      </section>
    </div>
  );
}
