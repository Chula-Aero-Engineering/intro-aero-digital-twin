import { describe, expect, it } from "vitest";
import { calculateStickFreeEffect } from "../../src/student/physics/stick-free-effect.js";
describe("stick-free effect", () => {
  it("retains the selected fraction of authority", () => { const r = calculateStickFreeEffect({ fixedControlDerivativePerRad: -.2, elevatorEffectiveness: .7, stickFreeFactor: .75 }); expect(r.stickFreeControlDerivativePerRad).toBeCloseTo(-.15); expect(r.authorityRetainedPercent).toBe(75); });
  it("preserves boundary behavior and rejects factors above one", () => { expect(calculateStickFreeEffect({ fixedControlDerivativePerRad: -.2, elevatorEffectiveness: .7, stickFreeFactor: 0 }).stickFreeControlDerivativePerRad).toBe(0); expect(() => calculateStickFreeEffect({ fixedControlDerivativePerRad: -.2, elevatorEffectiveness: .7, stickFreeFactor: 1.1 })).toThrow(); });
});
