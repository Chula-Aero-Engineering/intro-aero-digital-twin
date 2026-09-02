import { describe, expect, it } from "vitest";
import { calculatePitchDynamicResponse } from "../../src/student/physics/pitch-dynamic-response.js";
const a = { pitchInertiaKgM2: .12, cmQPerRad: -6, pitchRateRadS: .2, speedMps: 10, densityKgM3: 1.225, wingAreaM2: .5, meanChordM: .32, appliedPitchMomentNm: 0 };
describe("pitch dynamic response", () => {
  it("makes negative Cmq oppose positive pitch rate", () => { const r = calculatePitchDynamicResponse(a); expect(r.dampingPitchMomentNm).toBeLessThan(0); expect(r.pitchAngularAccelerationRadS2).toBeLessThan(0); });
  it("has zero damping at zero rate and rejects zero speed", () => { expect(calculatePitchDynamicResponse({ ...a, pitchRateRadS: 0 }).dampingPitchMomentNm).toBe(0); expect(() => calculatePitchDynamicResponse({ ...a, speedMps: 0 })).toThrow(); });
});
