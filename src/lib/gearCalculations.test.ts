import { describe, expect, it } from "vitest";
import {
  calculateGearRatio,
  calculateOutputRPM,
  calculateIdealOutputTorque,
  calculateActualOutputTorque,
  calculatePower,
  calculateEfficiencyAdjustedOutputPower,
  calculateGearSystem,
  determineTransmissionType,
} from "./gearCalculations";
import { validateGearInputs } from "./validation";

describe("calculateGearRatio", () => {
  it("computes driven/driver ratio", () => {
    expect(calculateGearRatio(20, 60)).toBeCloseTo(3, 10);
    expect(calculateGearRatio(60, 20)).toBeCloseTo(1 / 3, 10);
    expect(calculateGearRatio(20, 20)).toBeCloseTo(1, 10);
  });
});

describe("calculateOutputRPM", () => {
  it("reduces speed when driven gear is larger (Test 1: 20→60, 1500 RPM)", () => {
    expect(calculateOutputRPM(1500, 20, 60)).toBeCloseTo(500, 6);
  });

  it("increases speed when driven gear is smaller (Test 2: 60→20)", () => {
    expect(calculateOutputRPM(1500, 60, 20)).toBeCloseTo(4500, 6);
  });

  it("holds speed constant at a 1:1 ratio (Test 3: 20→20)", () => {
    expect(calculateOutputRPM(1500, 20, 20)).toBeCloseTo(1500, 6);
  });

  it("handles very large ratios without producing Infinity (Test 10)", () => {
    const result = calculateOutputRPM(3000, 10, 1000);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeCloseTo(30, 6);
  });

  it("handles high input RPM (Test 9)", () => {
    const result = calculateOutputRPM(20000, 20, 60);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeCloseTo(6666.6667, 3);
  });
});

describe("calculateIdealOutputTorque", () => {
  it("matches expected 30 N·m for Test 1 (20→60, 10 N·m)", () => {
    expect(calculateIdealOutputTorque(10, 20, 60)).toBeCloseTo(30, 6);
  });

  it("reduces torque on a speed-increasing pair (Test 2: 60→20)", () => {
    expect(calculateIdealOutputTorque(10, 60, 20)).toBeCloseTo(10 / 3, 6);
  });

  it("returns zero torque for zero input torque (Test 6)", () => {
    expect(calculateIdealOutputTorque(0, 20, 60)).toBe(0);
  });
});

describe("calculateActualOutputTorque (efficiency-adjusted)", () => {
  it("applies 95% efficiency on top of the ideal torque (Test 4)", () => {
    expect(calculateActualOutputTorque(10, 20, 60, 0.95)).toBeCloseTo(28.5, 6);
  });

  it("equals the ideal torque at 100% efficiency (Test 5)", () => {
    expect(calculateActualOutputTorque(10, 20, 60, 1)).toBeCloseTo(30, 6);
  });
});

describe("power / efficiency consistency", () => {
  it("conserves power exactly for the ideal (lossless) case", () => {
    const inputPower = calculatePower(1500, 10);
    const outputRPM = calculateOutputRPM(1500, 20, 60);
    const idealTorque = calculateIdealOutputTorque(10, 20, 60);
    const idealOutputPower = calculatePower(outputRPM, idealTorque);
    expect(idealOutputPower).toBeCloseTo(inputPower, 6);
  });

  it("keeps actual output power consistent with actual output torque at the actual output speed", () => {
    const inputRPM = 1500;
    const inputTorque = 10;
    const efficiency = 0.95;
    const outputRPM = calculateOutputRPM(inputRPM, 20, 60);
    const actualTorque = calculateActualOutputTorque(inputTorque, 20, 60, efficiency);

    const inputPower = calculatePower(inputRPM, inputTorque);
    const expectedOutputPower = calculateEfficiencyAdjustedOutputPower(inputPower, efficiency);
    const powerFromTorqueAndSpeed = calculatePower(outputRPM, actualTorque);

    // T2_actual * omega2 must equal P_in * eta — this is the cross-check for the
    // efficiency convention documented in gearCalculations.ts.
    expect(powerFromTorqueAndSpeed).toBeCloseTo(expectedOutputPower, 6);
  });

  it("computes input power for the full worked example (Test 1)", () => {
    // P = 2*pi*N*T/60 = 2*pi*1500*10/60 ≈ 1570.80 W
    expect(calculatePower(1500, 10)).toBeCloseTo(1570.7963, 3);
  });
});

describe("determineTransmissionType", () => {
  it("classifies reduction, increase, and unity", () => {
    expect(determineTransmissionType(20, 60)).toBe("reduction");
    expect(determineTransmissionType(60, 20)).toBe("increase");
    expect(determineTransmissionType(20, 20)).toBe("unity");
  });
});

describe("calculateGearSystem — full worked examples", () => {
  it("Test 1: 20→60 teeth, 1500 RPM, 10 N·m, 95% efficiency", () => {
    const result = calculateGearSystem({
      driverTeeth: 20,
      drivenTeeth: 60,
      inputRPM: 1500,
      inputTorque: 10,
      efficiency: 0.95,
    });

    expect(result.gearRatio).toBeCloseTo(3, 6);
    expect(result.outputRPM).toBeCloseTo(500, 6);
    expect(result.idealOutputTorque).toBeCloseTo(30, 6);
    expect(result.actualOutputTorque).toBeCloseTo(28.5, 6);
    expect(result.inputPower).toBeCloseTo(1570.7963, 3);
    expect(result.idealOutputPower).toBeCloseTo(result.inputPower, 6);
    expect(result.actualOutputPower).toBeCloseTo(result.inputPower * 0.95, 6);
    expect(result.powerLoss).toBeCloseTo(result.inputPower * 0.05, 6);
    expect(result.transmissionType).toBe("reduction");
    expect(result.rotationDirection).toBe("opposite");
  });

  it("Test 7 equivalent: zero input torque never produces NaN", () => {
    const result = calculateGearSystem({
      driverTeeth: 20,
      drivenTeeth: 60,
      inputRPM: 1500,
      inputTorque: 0,
      efficiency: 0.95,
    });
    expect(result.idealOutputTorque).toBe(0);
    expect(result.actualOutputTorque).toBe(0);
    expect(result.inputPower).toBe(0);
    expect(Number.isFinite(result.powerLoss)).toBe(true);
  });

  it("holds at unity for equal tooth counts", () => {
    const result = calculateGearSystem({
      driverTeeth: 40,
      drivenTeeth: 40,
      inputRPM: 1000,
      inputTorque: 5,
      efficiency: 1,
    });
    expect(result.gearRatio).toBeCloseTo(1, 6);
    expect(result.outputRPM).toBeCloseTo(1000, 6);
    expect(result.actualOutputTorque).toBeCloseTo(5, 6);
    expect(result.transmissionType).toBe("unity");
  });

  it("never produces NaN or Infinity for a very large ratio (Test 10)", () => {
    const result = calculateGearSystem({
      driverTeeth: 8,
      drivenTeeth: 2000,
      inputRPM: 3000,
      inputTorque: 2,
      efficiency: 0.9,
    });
    for (const value of Object.values(result)) {
      if (typeof value === "number") {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });
});

describe("validateGearInputs", () => {
  it("accepts a valid set of inputs and converts efficiency to a fraction", () => {
    const result = validateGearInputs({
      driverTeeth: "20",
      drivenTeeth: "60",
      inputRPM: "1500",
      inputTorque: "10",
      efficiencyPercent: "95",
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.inputs.efficiency).toBeCloseTo(0.95, 6);
    }
  });

  it("rejects invalid tooth counts (Test 8)", () => {
    const result = validateGearInputs({
      driverTeeth: "0",
      drivenTeeth: "-5",
      inputRPM: "1500",
      inputTorque: "10",
      efficiencyPercent: "95",
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "driverTeeth")).toBe(true);
      expect(result.errors.some((e) => e.field === "drivenTeeth")).toBe(true);
    }
  });

  it("rejects efficiency above 100% or at/below 0% (Test 7)", () => {
    const tooHigh = validateGearInputs({
      driverTeeth: "20",
      drivenTeeth: "60",
      inputRPM: "1500",
      inputTorque: "10",
      efficiencyPercent: "150",
    });
    expect(tooHigh.valid).toBe(false);

    const zero = validateGearInputs({
      driverTeeth: "20",
      drivenTeeth: "60",
      inputRPM: "1500",
      inputTorque: "10",
      efficiencyPercent: "0",
    });
    expect(zero.valid).toBe(false);
  });

  it("rejects non-positive RPM and negative torque", () => {
    const result = validateGearInputs({
      driverTeeth: "20",
      drivenTeeth: "60",
      inputRPM: "0",
      inputTorque: "-1",
      efficiencyPercent: "95",
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "inputRPM")).toBe(true);
      expect(result.errors.some((e) => e.field === "inputTorque")).toBe(true);
    }
  });

  it("rejects empty/NaN fields", () => {
    const result = validateGearInputs({
      driverTeeth: "",
      drivenTeeth: "abc",
      inputRPM: "1500",
      inputTorque: "10",
      efficiencyPercent: "95",
    });
    expect(result.valid).toBe(false);
  });
});
