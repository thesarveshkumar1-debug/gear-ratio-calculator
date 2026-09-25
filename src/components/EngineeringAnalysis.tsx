import type { GearInputs, GearResults } from "@/types/gear";
import { formatNumber } from "@/lib/units";

interface EngineeringAnalysisProps {
  inputs: GearInputs;
  results: GearResults;
}

function buildAnalysisText(inputs: GearInputs, results: GearResults): string {
  const { driverTeeth, drivenTeeth, inputRPM, efficiency } = inputs;
  const reductionRatioText = `${formatNumber(results.gearRatio, 2)}:1`;
  const increaseRatioText = `1:${formatNumber(1 / results.gearRatio, 2)}`;

  const typeSentence =
    results.transmissionType === "reduction"
      ? `This produces a ${reductionRatioText} speed reduction: the output shaft turns slower than the input shaft, and torque increases in proportion.`
      : results.transmissionType === "increase"
        ? `This produces a ${increaseRatioText} speed increase: the output shaft turns faster than the input shaft, and torque decreases in proportion.`
        : `This is a 1:1 transmission: the output shaft turns at the same speed as the input shaft, with torque approximately unchanged before efficiency losses.`;

  const efficiencySentence =
    efficiency >= 1
      ? "At 100% efficiency, no power is lost in the transmission and the output torque matches the ideal value exactly."
      : `With a mechanical efficiency of ${formatNumber(efficiency * 100, 0)}%, roughly ${formatNumber(
          (1 - efficiency) * 100,
          0
        )}% of the input power is lost to friction, windage and other losses, so the actual output torque is below the ideal value.`;

  return `Your ${driverTeeth}-tooth driver gear is driving a ${drivenTeeth}-tooth driven gear at ${formatNumber(
    inputRPM,
    0
  )} RPM. ${typeSentence} The output shaft rotates at approximately ${formatNumber(
    results.outputRPM,
    0
  )} RPM, in the opposite direction to the driver gear. ${efficiencySentence}`;
}

export function EngineeringAnalysis({ inputs, results }: EngineeringAnalysisProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Engineering Analysis
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {buildAnalysisText(inputs, results)}
      </p>
    </div>
  );
}
