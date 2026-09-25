/**
 * Core domain types for a two-gear (driver → driven) external spur gear mesh.
 * All internal calculation values are stored in SI units:
 *   - teeth: count (dimensionless)
 *   - speed: RPM
 *   - torque: N·m
 *   - power: W
 *   - efficiency: fraction (0-1), not percent
 * UI-facing unit conversion happens only at display time (see lib/units.ts).
 */

export interface GearInputs {
  driverTeeth: number;
  drivenTeeth: number;
  inputRPM: number;
  inputTorque: number;
  /** Fraction 0-1 (e.g. 0.95 for 95%). */
  efficiency: number;
}

export type TransmissionType = "reduction" | "increase" | "unity";

export type RotationDirection = "opposite" | "same";

export interface GearResults {
  gearRatio: number;
  outputRPM: number;
  idealOutputTorque: number;
  actualOutputTorque: number;
  inputPower: number;
  idealOutputPower: number;
  actualOutputPower: number;
  powerLoss: number;
  transmissionType: TransmissionType;
  speedChangePercent: number;
  torqueChangePercent: number;
  rotationDirection: RotationDirection;
}

export type TorqueUnit = "N·m" | "lb-ft";
export type PowerUnit = "W" | "kW" | "hp";

export interface FieldError {
  field: keyof GearInputs;
  message: string;
}
