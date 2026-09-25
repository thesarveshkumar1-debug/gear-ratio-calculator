import type { GearInputs, GearResults, PowerUnit, TorqueUnit } from "@/types/gear";
import { convertPowerFromWatts, convertTorqueFromNm, formatNumber } from "@/lib/units";

interface EngineeringSummaryProps {
  inputs: GearInputs;
  results: GearResults;
  torqueUnit: TorqueUnit;
  powerUnit: PowerUnit;
}

const TRANSMISSION_LABEL: Record<GearResults["transmissionType"], string> = {
  reduction: "Speed Reduction",
  increase: "Speed Increase",
  unity: "1:1 Transmission",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-surface-border py-2 last:border-b-0">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <span className="font-technical text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function EngineeringSummary({
  inputs,
  results,
  torqueUnit,
  powerUnit,
}: EngineeringSummaryProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Engineering Summary
      </h2>
      <div className="mt-2">
        <Row label="Transmission Type" value={TRANSMISSION_LABEL[results.transmissionType]} />
        <Row label="Gear Ratio" value={`${formatNumber(results.gearRatio, 2)} : 1`} />
        <Row label="Input Speed" value={`${formatNumber(inputs.inputRPM, 1)} RPM`} />
        <Row label="Output Speed" value={`${formatNumber(results.outputRPM, 1)} RPM`} />
        <Row
          label="Input Torque"
          value={`${formatNumber(convertTorqueFromNm(inputs.inputTorque, torqueUnit), 2)} ${torqueUnit}`}
        />
        <Row
          label="Output Torque (ideal)"
          value={`${formatNumber(convertTorqueFromNm(results.idealOutputTorque, torqueUnit), 2)} ${torqueUnit}`}
        />
        <Row
          label="Output Torque (actual)"
          value={`${formatNumber(convertTorqueFromNm(results.actualOutputTorque, torqueUnit), 2)} ${torqueUnit}`}
        />
        <Row
          label="Input Power"
          value={`${formatNumber(convertPowerFromWatts(results.inputPower, powerUnit), 2)} ${powerUnit}`}
        />
        <Row
          label="Output Power"
          value={`${formatNumber(convertPowerFromWatts(results.actualOutputPower, powerUnit), 2)} ${powerUnit}`}
        />
        <Row
          label="Power Loss"
          value={`${formatNumber(convertPowerFromWatts(results.powerLoss, powerUnit), 2)} ${powerUnit}`}
        />
        <Row label="Efficiency" value={`${formatNumber(inputs.efficiency * 100, 0)}%`} />
        <Row
          label="Rotation"
          value={results.rotationDirection === "opposite" ? "Opposite Direction" : "Same Direction"}
        />
      </div>
    </div>
  );
}
