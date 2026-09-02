import { describe, expect, it } from "vitest";
import { calculateStaticMargin } from "../../src/student/physics/static-margin.js";
describe("static margin", () => {
  it("matches the reference and decreases as CG moves aft", () => { expect(calculateStaticMargin({ cgM: .12, neutralPointM: .16, meanChordM: .32 }).staticMargin).toBeCloseTo(.125); expect(calculateStaticMargin({ cgM: .14, neutralPointM: .16, meanChordM: .32 }).staticMargin).toBeLessThan(.125); });
  it("is zero at the neutral point and rejects zero chord", () => { expect(calculateStaticMargin({ cgM: .16, neutralPointM: .16, meanChordM: .32 }).staticMargin).toBe(0); expect(() => calculateStaticMargin({ cgM: 0, neutralPointM: 0, meanChordM: 0 })).toThrow(); });
});
