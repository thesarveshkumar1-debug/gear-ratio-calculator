import { RotateCcw, RotateCw } from "lucide-react";
import {
  buildGearPath,
  computeSpinDurationMs,
  scaleTeethForDrawing,
  scaleTeethToRadius,
} from "@/lib/gearVisual";
import { formatNumber } from "@/lib/units";

interface GearVisualizationProps {
  driverTeeth: number;
  drivenTeeth: number;
  inputRPM: number;
  outputRPM: number;
}

const VIEW_HEIGHT = 300;
const MARGIN = 78;
const CY = 158;

export function GearVisualization({
  driverTeeth,
  drivenTeeth,
  inputRPM,
  outputRPM,
}: GearVisualizationProps) {
  const rDriver = scaleTeethToRadius(driverTeeth);
  const rDriven = scaleTeethToRadius(drivenTeeth);
  const drawnDriverTeeth = scaleTeethForDrawing(driverTeeth);
  const drawnDrivenTeeth = scaleTeethForDrawing(drivenTeeth);

  const cx1 = MARGIN + rDriver;
  const cx2 = cx1 + rDriver + rDriven;
  const viewWidth = cx2 + rDriven + MARGIN;

  const driverPath = buildGearPath(cx1, CY, drawnDriverTeeth, rDriver);
  const drivenPath = buildGearPath(cx2, CY, drawnDrivenTeeth, rDriven);

  const driverSpinMs = computeSpinDurationMs(inputRPM);
  const drivenSpinMs = computeSpinDurationMs(Math.abs(outputRPM));

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Gear Visualization
        </h2>
        <p className="text-xs text-muted">Opposite rotation — external mesh</p>
      </div>

      <svg
        viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`Driver gear with ${driverTeeth} teeth at ${formatNumber(
          inputRPM,
          0
        )} RPM meshing with driven gear with ${drivenTeeth} teeth at ${formatNumber(outputRPM, 0)} RPM, rotating in opposite directions.`}
        className="mx-auto mt-2 w-full max-w-2xl"
      >
        <line
          x1={cx1}
          y1={CY}
          x2={cx2}
          y2={CY}
          stroke="var(--surface-border)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <circle cx={(cx1 + cx2) / 2} cy={CY} r={3} fill="var(--muted)" />

        <g
          className="gear-spin-cw"
          style={{ animationDuration: `${driverSpinMs}ms`, transformOrigin: `${cx1}px ${CY}px` }}
        >
          <path d={driverPath} fill="var(--driver-color)" fillOpacity={0.18} stroke="var(--driver-color)" strokeWidth={2} strokeLinejoin="round" />
        </g>
        <circle cx={cx1} cy={CY} r={4} fill="var(--driver-color)" />

        <g
          className="gear-spin-ccw"
          style={{ animationDuration: `${drivenSpinMs}ms`, transformOrigin: `${cx2}px ${CY}px` }}
        >
          <path d={drivenPath} fill="var(--driven-color)" fillOpacity={0.18} stroke="var(--driven-color)" strokeWidth={2} strokeLinejoin="round" />
        </g>
        <circle cx={cx2} cy={CY} r={4} fill="var(--driven-color)" />

        <text
          x={cx1}
          y={CY - rDriver - 46}
          textAnchor="middle"
          className="font-technical fill-driver text-[13px] font-semibold"
        >
          DRIVER
        </text>
        <text
          x={cx1}
          y={CY - rDriver - 30}
          textAnchor="middle"
          className="font-technical fill-foreground text-[12px]"
        >
          Z₁ = {driverTeeth}
        </text>
        <text
          x={cx1}
          y={CY + rDriver + 32}
          textAnchor="middle"
          className="font-technical fill-foreground text-[12px]"
        >
          {formatNumber(inputRPM, 0)} RPM
        </text>

        <text
          x={cx2}
          y={CY - rDriven - 46}
          textAnchor="middle"
          className="font-technical fill-driven text-[13px] font-semibold"
        >
          DRIVEN
        </text>
        <text
          x={cx2}
          y={CY - rDriven - 30}
          textAnchor="middle"
          className="font-technical fill-foreground text-[12px]"
        >
          Z₂ = {drivenTeeth}
        </text>
        <text
          x={cx2}
          y={CY + rDriven + 32}
          textAnchor="middle"
          className="font-technical fill-foreground text-[12px]"
        >
          {formatNumber(outputRPM, 0)} RPM
        </text>
      </svg>

      <div className="mt-1 flex items-center justify-center gap-6 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <RotateCw size={14} className="text-driver" aria-hidden="true" /> Driver spins clockwise
        </span>
        <span className="flex items-center gap-1.5">
          <RotateCcw size={14} className="text-driven" aria-hidden="true" /> Driven spins
          counter-clockwise
        </span>
      </div>
    </div>
  );
}
