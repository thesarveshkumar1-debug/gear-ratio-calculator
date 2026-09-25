import type { GearResults, PowerUnit, TorqueUnit } from "@/types/gear";
import { convertPowerFromWatts, convertTorqueFromNm, formatNumber } from "@/lib/units";

interface ResultsHeadlineProps {
  results: GearResults;
  torqueUnit: TorqueUnit;
  powerUnit: PowerUnit;
  onTorqueUnitChange: (unit: TorqueUnit) => void;
  onPowerUnitChange: (unit: PowerUnit) => void;
}

function StatTile({
  label,
  value,
  unit,
  emphasis,
  accentClassName,
}: {
  label: string;
  value: string;
  unit: string;
  emphasis?: boolean;
  accentClassName?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-surface-border bg-surface p-4 ${
        emphasis ? "col-span-2 border-accent/40 bg-accent/5" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p
        className={`font-technical mt-1 font-semibold ${
          emphasis ? "text-4xl text-accent" : "text-2xl"
        } ${accentClassName ?? "text-foreground"}`}
      >
        {value}
        <span className="ml-1.5 text-base font-normal text-muted">{unit}</span>
      </p>
    </div>
  );
}

export function ResultsHeadline({
  results,
  torqueUnit,
  powerUnit,
  onTorqueUnitChange,
  onPowerUnitChange,
}: ResultsHeadlineProps) {
  const outputTorqueDisplay = convertTorqueFromNm(results.actualOutputTorque, torqueUnit);
  const outputPowerDisplay = convertPowerFromWatts(results.actualOutputPower, powerUnit);

  return (
    <div className="rounded-lg border border-surface-border bg-surface-muted p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Results</h2>
        <div className="flex gap-2 text-xs">
          <select
            aria-label="Torque unit"
            value={torqueUnit}
            onChange={(e) => onTorqueUnitChange(e.target.value as TorqueUnit)}
            className="rounded border border-surface-border bg-surface px-2 py-1 text-foreground"
          >
            <option value="N·m">N·m</option>
            <option value="lb-ft">lb-ft</option>
          </select>
          <select
            aria-label="Power unit"
            value={powerUnit}
            onChange={(e) => onPowerUnitChange(e.target.value as PowerUnit)}
            className="rounded border border-surface-border bg-surface px-2 py-1 text-foreground"
          >
            <option value="W">W</option>
            <option value="kW">kW</option>
            <option value="hp">hp</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile
          label="Gear Ratio"
          value={`${formatNumber(results.gearRatio, 2)} : 1`}
          unit=""
          emphasis
        />
        <StatTile label="Output Speed" value={formatNumber(results.outputRPM, 1)} unit="RPM" />
        <StatTile
          label="Output Torque"
          value={formatNumber(outputTorqueDisplay, 2)}
          unit={torqueUnit}
        />
        <StatTile
          label="Output Power"
          value={formatNumber(outputPowerDisplay, 2)}
          unit={powerUnit}
        />
      </div>
    </div>
  );
}
