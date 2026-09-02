import { describe, expect, it } from "vitest";
import { calculateLateralStaticStability } from "../../src/student/physics/lateral-static-stability.js";
const a = { sideslipDeg: 3, clBetaPerRad: -.08, cnBetaPerRad: .12, wingSpanM: 1.6, wingAreaM2: .5, speedMps: 10, densityKgM3: 1.225 };
describe("lateral static stability", () => {
  it("uses conventional restoring derivative signs", () => { const r = calculateLateralStaticStability(a); expect(r.rollRestoring).toBe(true); expect(r.yawRestoring).toBe(true); expect(r.rollMomentNm).toBeLessThan(0); expect(r.yawMomentNm).toBeGreaterThan(0); });
  it("is zero at zero sideslip and quadratic in speed", () => { expect(calculateLateralStaticStability({ ...a, sideslipDeg: 0 }).rollMomentNm).toBe(0); expect(calculateLateralStaticStability({ ...a, speedMps: 20 }).yawMomentNm).toBeCloseTo(4 * calculateLateralStaticStability(a).yawMomentNm); });
});
