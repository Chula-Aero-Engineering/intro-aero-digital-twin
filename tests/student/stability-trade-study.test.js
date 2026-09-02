import { describe, expect, it } from "vitest";
import { evaluateStabilityTradeStudy } from "../../src/student/physics/stability-trade-study.js";
const a = { cgM: .12, neutralPointM: .16, meanChordM: .32, tailAreaM2: .09, tailArmM: .55, wingAreaM2: .5, elevatorEffectiveness: .7, minimumStaticMargin: .05 };
describe("stability trade study", () => {
  it("checks only the supplied static-margin requirement", () => { const r = evaluateStabilityTradeStudy(a); expect(r.staticMargin).toBeCloseTo(.125); expect(r.staticMarginRequirementMet).toBe(true); expect(r.controlAuthorityIndex).toBeCloseTo(.2165625); });
  it("shows aft CG reduces margin and larger tail increases authority", () => { expect(evaluateStabilityTradeStudy({ ...a, cgM: .15 }).staticMargin).toBeLessThan(evaluateStabilityTradeStudy(a).staticMargin); expect(evaluateStabilityTradeStudy({ ...a, tailAreaM2: .18 }).controlAuthorityIndex).toBeCloseTo(2 * evaluateStabilityTradeStudy(a).controlAuthorityIndex); });
});
