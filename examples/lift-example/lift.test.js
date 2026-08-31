import { describe, expect, it } from "vitest";
import { calculateLift, calculateRequiredCl, calculateWeight } from "./lift.js";

const reference = { densityKgM3: 1.225, speedMps: 10, wingAreaM2: 0.5, cl: 0.8 };

describe("lift example", () => {
  it("matches the 24.5 N reference calculation", () => {
    expect(calculateLift(reference)).toBeCloseTo(24.5);
  });

  it("returns zero lift when CL is zero", () => {
    expect(calculateLift({ ...reference, cl: 0 })).toBe(0);
  });

  it("doubles lift when wing area doubles", () => {
    expect(calculateLift({ ...reference, wingAreaM2: 1 })).toBeCloseTo(2 * calculateLift(reference));
  });

  it("quadruples lift when speed doubles", () => {
    expect(calculateLift({ ...reference, speedMps: 20 })).toBeCloseTo(4 * calculateLift(reference));
  });

  it("calculates weight and the CL required to balance it", () => {
    const totalMassKg = 1.6;
    const weightN = calculateWeight(totalMassKg);
    const requiredCl = calculateRequiredCl({ ...reference, totalMassKg });
    expect(calculateLift({ ...reference, cl: requiredCl })).toBeCloseTo(weightN);
  });

  it("rejects a negative physical input", () => {
    expect(() => calculateLift({ ...reference, speedMps: -1 })).toThrow(RangeError);
  });
});
