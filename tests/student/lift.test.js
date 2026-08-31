import { describe, expect, it } from "vitest";

import {
  calculateLift,
  calculateRequiredCl,
  calculateWeight,
} from "../../src/student/physics/lift.js";

describe("lift physics", () => {
  it("produces 24.5 N for the reference case", () => {
    expect(calculateLift(1.225, 10, 0.5, 0.8)).toBeCloseTo(24.5, 10);
  });

  it("doubling wing area doubles lift to 49.0 N", () => {
    const baselineLiftN = calculateLift(1.225, 10, 0.5, 0.8);
    const doubledAreaLiftN = calculateLift(1.225, 10, 1.0, 0.8);

    expect(doubledAreaLiftN).toBeCloseTo(49.0, 10);
    expect(doubledAreaLiftN).toBeCloseTo(2 * baselineLiftN, 10);
  });

  it("doubling speed quadruples lift to 98.0 N", () => {
    const baselineLiftN = calculateLift(1.225, 10, 0.5, 0.8);
    const doubledSpeedLiftN = calculateLift(1.225, 20, 0.5, 0.8);

    expect(doubledSpeedLiftN).toBeCloseTo(98.0, 10);
    expect(doubledSpeedLiftN).toBeCloseTo(4 * baselineLiftN, 10);
  });

  it("CL = 0 produces 0 N lift", () => {
    expect(calculateLift(1.225, 10, 0.5, 0)).toBe(0);
  });

  it("rejects negative physical inputs", () => {
    expect(() => calculateLift(-1.225, 10, 0.5, 0.8)).toThrow();
    expect(() => calculateLift(1.225, -10, 0.5, 0.8)).toThrow();
    expect(() => calculateLift(1.225, 10, -0.5, 0.8)).toThrow();
    expect(() => calculateWeight(-1)).toThrow();
    expect(() =>
      calculateRequiredCl(-1, 1.225, 10, 0.5)
    ).toThrow();
  });
});
