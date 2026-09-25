import type { PowerUnit, TorqueUnit } from "@/types/gear";

const LB_FT_PER_NM = 0.737562;
const HP_PER_W = 1 / 745.699872;

/** Converts a torque value stored internally in N·m to the requested display unit. */
export function convertTorqueFromNm(valueNm: number, unit: TorqueUnit): number {
  if (unit === "lb-ft") return valueNm * LB_FT_PER_NM;
  return valueNm;
}

/** Converts a torque value entered in the requested unit back to N·m for internal use. */
export function convertTorqueToNm(value: number, unit: TorqueUnit): number {
  if (unit === "lb-ft") return value / LB_FT_PER_NM;
  return value;
}

/** Converts a power value stored internally in watts to the requested display unit. */
export function convertPowerFromWatts(valueWatts: number, unit: PowerUnit): number {
  if (unit === "kW") return valueWatts / 1000;
  if (unit === "hp") return valueWatts * HP_PER_W;
  return valueWatts;
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
