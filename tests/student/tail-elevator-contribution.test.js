import { describe, expect, it } from "vitest";
import { calculateTailElevatorContribution } from "../../src/student/physics/tail-elevator-contribution.js";
const a = { tailAreaM2: .09, tailArmM: .55, wingAreaM2: .5, meanChordM: .32, elevatorDeflectionDeg: 10, elevatorEffectiveness: .7 };
describe("tail/elevator contribution", () => {
  it("calculates tail volume and signed control contribution", () => { const r = calculateTailElevatorContribution(a); expect(r.tailVolumeCoefficient).toBeCloseTo(.309375); expect(r.elevatorMomentCoefficientChange).toBeLessThan(0); });
  it("is zero at zero deflection and scales with effectiveness", () => { expect(calculateTailElevatorContribution({ ...a, elevatorDeflectionDeg: 0 }).elevatorMomentCoefficientChange).toBe(0); expect(calculateTailElevatorContribution({ ...a, elevatorEffectiveness: 1 }).elevatorMomentCoefficientChange).toBeCloseTo(calculateTailElevatorContribution({ ...a, elevatorEffectiveness: .5 }).elevatorMomentCoefficientChange * 2); });
});
