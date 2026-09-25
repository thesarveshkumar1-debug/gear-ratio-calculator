"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Shuffle } from "lucide-react";
import { calculateGearSystem } from "@/lib/gearCalculations";
import { validateGearInputs, type RawGearInputs } from "@/lib/validation";
import type { PowerUnit, TorqueUnit } from "@/types/gear";
import { Header } from "./Header";
import { InputPanel } from "./InputPanel";
import { ResultsHeadline } from "./ResultsHeadline";
import { TransmissionBadges } from "./TransmissionBadges";
import { GearVisualization } from "./GearVisualization";
import { EngineeringAnalysis } from "./EngineeringAnalysis";
import { EngineeringSummary } from "./EngineeringSummary";
import { AssumptionsSection } from "./AssumptionsSection";
import { EducationalSection } from "./EducationalSection";

const DEFAULT_INPUTS: RawGearInputs = {
  driverTeeth: "20",
  drivenTeeth: "60",
  inputRPM: "1500",
  inputTorque: "10",
  efficiencyPercent: "95",
};

const EXAMPLES: RawGearInputs[] = [
  DEFAULT_INPUTS,
  { driverTeeth: "60", drivenTeeth: "20", inputRPM: "500", inputTorque: "40", efficiencyPercent: "95" },
  { driverTeeth: "30", drivenTeeth: "30", inputRPM: "1000", inputTorque: "15", efficiencyPercent: "98" },
];

export function GearCalculatorApp() {
  const [raw, setRaw] = useState<RawGearInputs>(DEFAULT_INPUTS);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [torqueUnit, setTorqueUnit] = useState<TorqueUnit>("N·m");
  const [powerUnit, setPowerUnit] = useState<PowerUnit>("kW");

  const validation = useMemo(() => validateGearInputs(raw), [raw]);
  const computed = useMemo(() => {
    if (!validation.valid) return null;
    return { inputs: validation.inputs, results: calculateGearSystem(validation.inputs) };
  }, [validation]);

  function handleChange(field: keyof RawGearInputs, value: string) {
    setRaw((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset() {
    setRaw(DEFAULT_INPUTS);
    setExampleIndex(0);
  }

  function handleLoadExample() {
    const nextIndex = (exampleIndex + 1) % EXAMPLES.length;
    setRaw(EXAMPLES[nextIndex]);
    setExampleIndex(nextIndex);
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Inputs</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLoadExample}
              className="flex items-center gap-1.5 rounded-md border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Shuffle size={14} aria-hidden="true" />
              Load Example
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-md border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3">
          <InputPanel
            raw={raw}
            errors={validation.valid ? [] : validation.errors}
            onChange={handleChange}
          />
        </div>

        {computed ? (
          <div className="mt-6 flex flex-col gap-6">
            <ResultsHeadline
              results={computed.results}
              torqueUnit={torqueUnit}
              powerUnit={powerUnit}
              onTorqueUnitChange={setTorqueUnit}
              onPowerUnitChange={setPowerUnit}
            />
            <TransmissionBadges results={computed.results} />
            <GearVisualization
              driverTeeth={computed.inputs.driverTeeth}
              drivenTeeth={computed.inputs.drivenTeeth}
              inputRPM={computed.inputs.inputRPM}
              outputRPM={computed.results.outputRPM}
            />
            <EngineeringAnalysis inputs={computed.inputs} results={computed.results} />
            <EngineeringSummary
              inputs={computed.inputs}
              results={computed.results}
              torqueUnit={torqueUnit}
              powerUnit={powerUnit}
            />
            <AssumptionsSection />
            <EducationalSection />
          </div>
        ) : (
          <div
            role="status"
            className="mt-6 rounded-lg border border-dashed border-surface-border bg-surface-muted p-6 text-center text-sm text-muted"
          >
            Fix the highlighted inputs above to see results.
          </div>
        )}
      </main>
      <footer className="border-t border-surface-border bg-surface py-4">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-muted sm:px-6">
          Educational / preliminary engineering analysis tool. Not a substitute for CAD/CAE design
          software.
        </p>
      </footer>
    </div>
  );
}
