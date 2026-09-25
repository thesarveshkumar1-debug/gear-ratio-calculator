import type { GearInputs, GearResults, TransmissionType } from "@/types/gear";

/**
 * Engineering calculation core for a two-gear (driver → driven) external spur mesh.
 *
 * CONVENTION — torque under efficiency losses:
 * For a rigid gear pair, the speed ratio N2 = N1 * (Z1/Z2) is fixed by tooth count
 * alone; efficiency losses (friction, windage, etc.) do not cause slip the way a
 * belt can, so N2 does not change with efficiency. Losses only remove power.
 * Combining that fixed kinematic ratio with P_out = P_in * η gives:
 *
 *   T2_actual = P_out / ω2 = (P_in * η) / ω2 = (T1_ideal_equivalent * η)
 *             = T2_ideal * η
 *
 * i.e. T2_actual = T1 * (Z2/Z1) * η is NOT an arbitrary shortcut — it is the
 * unique value consistent with (a) the kinematic speed ratio and (b) power
 * conservation under a single lumped efficiency. Both output speed and output
 * torque are therefore computed independently, and the resulting power figures
 * are cross-checked to confirm they agree (see gearCalculations.test.ts).
 */

const TWO_PI_OVER_60 = (2 * Math.PI) / 60;

export function calculateGearRatio(driverTeeth: number, drivenTeeth: number): number {
  return drivenTeeth / driverTeeth;
}

export function calculateOutputRPM(
  inputRPM: number,
  driverTeeth: number,
  drivenTeeth: number
): number {
  return (inputRPM * driverTeeth) / drivenTeeth;
}

/** Output torque assuming 100% (lossless) power transmission. */
export function calculateIdealOutputTorque(
  inputTorque: number,
  driverTeeth: number,
  drivenTeeth: number
): number {
  return (inputTorque * drivenTeeth) / driverTeeth;
}

/** Output torque adjusted for a single lumped mechanical efficiency (0-1). See module docblock. */
export function calculateActualOutputTorque(
  inputTorque: number,
  driverTeeth: number,
  drivenTeeth: number,
  efficiency: number
): number {
  return calculateIdealOutputTorque(inputTorque, driverTeeth, drivenTeeth) * efficiency;
}

/** Rotational power in watts: P = 2*pi*N*T / 60, N in RPM, T in N·m. */
export function calculatePower(rpm: number, torqueNm: number): number {
  return rpm * torqueNm * TWO_PI_OVER_60;
}

export function calculateEfficiencyAdjustedOutputPower(
  inputPowerWatts: number,
  efficiency: number
): number {
  return inputPowerWatts * efficiency;
}

export function determineTransmissionType(
  driverTeeth: number,
  drivenTeeth: number
): TransmissionType {
  if (drivenTeeth > driverTeeth) return "reduction";
  if (drivenTeeth < driverTeeth) return "increase";
  return "unity";
}

/**
 * Full engineering evaluation of a two-gear mesh. Assumes inputs have already been
 * validated at the UI boundary (positive teeth counts, non-negative RPM/torque,
 * efficiency in (0, 1]) — this function performs no defensive re-validation.
 */
export function calculateGearSystem(inputs: GearInputs): GearResults {
  const { driverTeeth, drivenTeeth, inputRPM, inputTorque, efficiency } = inputs;

  const gearRatio = calculateGearRatio(driverTeeth, drivenTeeth);
  const outputRPM = calculateOutputRPM(inputRPM, driverTeeth, drivenTeeth);
  const idealOutputTorque = calculateIdealOutputTorque(inputTorque, driverTeeth, drivenTeeth);
  const actualOutputTorque = calculateActualOutputTorque(
    inputTorque,
    driverTeeth,
    drivenTeeth,
    efficiency
  );

  const inputPower = calculatePower(inputRPM, inputTorque);
  const idealOutputPower = calculatePower(outputRPM, idealOutputTorque);
  const actualOutputPower = calculateEfficiencyAdjustedOutputPower(inputPower, efficiency);
  const powerLoss = inputPower - actualOutputPower;

  const transmissionType = determineTransmissionType(driverTeeth, drivenTeeth);

  const speedChangePercent = driverTeeth === 0 ? 0 : ((outputRPM - inputRPM) / inputRPM) * 100;
  const torqueChangePercent =
    inputTorque === 0 ? 0 : ((actualOutputTorque - inputTorque) / inputTorque) * 100;

  return {
    gearRatio,
    outputRPM,
    idealOutputTorque,
    actualOutputTorque,
    inputPower,
    idealOutputPower,
    actualOutputPower,
    powerLoss,
    transmissionType,
    speedChangePercent,
    torqueChangePercent,
    rotationDirection: "opposite",
  };
}
