import type { FieldError, GearInputs } from "@/types/gear";

export interface RawGearInputs {
  driverTeeth: string;
  drivenTeeth: string;
  inputRPM: string;
  inputTorque: string;
  /** Percent, e.g. "95" for 95%. */
  efficiencyPercent: string;
}

function toFieldError(field: keyof GearInputs, message: string): FieldError {
  return { field, message };
}

/**
 * Validates and parses raw string form input into a numeric GearInputs object.
 * Returns either a fully-parsed, valid result or the list of field errors —
 * never a partially-valid object, so callers can't accidentally compute with NaN.
 */
export function validateGearInputs(
  raw: RawGearInputs
): { valid: true; inputs: GearInputs } | { valid: false; errors: FieldError[] } {
  const errors: FieldError[] = [];

  const driverTeeth = Number(raw.driverTeeth);
  if (raw.driverTeeth.trim() === "" || Number.isNaN(driverTeeth)) {
    errors.push(toFieldError("driverTeeth", "Enter a number of teeth."));
  } else if (!Number.isInteger(driverTeeth) || driverTeeth <= 0) {
    errors.push(toFieldError("driverTeeth", "Must be a whole number greater than 0."));
  }

  const drivenTeeth = Number(raw.drivenTeeth);
  if (raw.drivenTeeth.trim() === "" || Number.isNaN(drivenTeeth)) {
    errors.push(toFieldError("drivenTeeth", "Enter a number of teeth."));
  } else if (!Number.isInteger(drivenTeeth) || drivenTeeth <= 0) {
    errors.push(toFieldError("drivenTeeth", "Must be a whole number greater than 0."));
  }

  const inputRPM = Number(raw.inputRPM);
  if (raw.inputRPM.trim() === "" || Number.isNaN(inputRPM)) {
    errors.push(toFieldError("inputRPM", "Enter an input speed."));
  } else if (inputRPM <= 0) {
    errors.push(toFieldError("inputRPM", "Must be greater than 0 RPM."));
  }

  const inputTorque = Number(raw.inputTorque);
  if (raw.inputTorque.trim() === "" || Number.isNaN(inputTorque)) {
    errors.push(toFieldError("inputTorque", "Enter an input torque."));
  } else if (inputTorque < 0) {
    errors.push(toFieldError("inputTorque", "Cannot be negative."));
  }

  const efficiencyPercent = Number(raw.efficiencyPercent);
  if (raw.efficiencyPercent.trim() === "" || Number.isNaN(efficiencyPercent)) {
    errors.push(toFieldError("efficiency", "Enter an efficiency."));
  } else if (efficiencyPercent <= 0 || efficiencyPercent > 100) {
    errors.push(toFieldError("efficiency", "Must be greater than 0 and at most 100%."));
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    inputs: {
      driverTeeth,
      drivenTeeth,
      inputRPM,
      inputTorque,
      efficiency: efficiencyPercent / 100,
    },
  };
}
