import { ArrowDown, ArrowUp, Equal, RotateCcw } from "lucide-react";
import type { GearResults } from "@/types/gear";
import { formatNumber } from "@/lib/units";

const TRANSMISSION_LABEL: Record<GearResults["transmissionType"], string> = {
  reduction: "Speed Reduction",
  increase: "Speed Increase",
  unity: "1:1 Transmission",
};

function Chip({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-surface-border bg-surface px-3 py-2.5">
      <span className="text-accent">{icon}</span>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
        <p className="font-technical text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function TransmissionBadges({ results }: { results: GearResults }) {
  const TransmissionIcon =
    results.transmissionType === "reduction"
      ? ArrowDown
      : results.transmissionType === "increase"
        ? ArrowUp
        : Equal;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Chip
        label="Transmission Type"
        value={TRANSMISSION_LABEL[results.transmissionType]}
        icon={<TransmissionIcon size={18} aria-hidden="true" />}
      />
      <Chip
        label="Speed Change"
        value={`${results.speedChangePercent >= 0 ? "+" : ""}${formatNumber(
          results.speedChangePercent,
          1
        )}%`}
        icon={
          results.speedChangePercent < 0 ? (
            <ArrowDown size={18} aria-hidden="true" />
          ) : (
            <ArrowUp size={18} aria-hidden="true" />
          )
        }
      />
      <Chip
        label="Torque Change"
        value={`${results.torqueChangePercent >= 0 ? "+" : ""}${formatNumber(
          results.torqueChangePercent,
          1
        )}%`}
        icon={
          results.torqueChangePercent < 0 ? (
            <ArrowDown size={18} aria-hidden="true" />
          ) : (
            <ArrowUp size={18} aria-hidden="true" />
          )
        }
      />
      <Chip
        label="Rotation"
        value={results.rotationDirection === "opposite" ? "Opposite Direction" : "Same Direction"}
        icon={<RotateCcw size={18} aria-hidden="true" />}
      />
    </div>
  );
}
