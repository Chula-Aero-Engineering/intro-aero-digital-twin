import { describe, expect, it } from "vitest";
import { calculateLongitudinalModes } from "../../src/student/physics/longitudinal-modes.js";
const a = { speedMps: 10, densityKgM3: 1.225, wingAreaM2: .5, meanChordM: .32, pitchInertiaKgM2: .12, cmAlphaPerRad: -.8, cmQPerRad: -6 };
describe("longitudinal modes", () => {
  it("produces positive stiffness and damping for stable derivative signs", () => { const r = calculateLongitudinalModes(a); expect(r.pitchStiffnessNmPerRad).toBeGreaterThan(0); expect(r.pitchDampingNmsPerRad).toBeGreaterThan(0); expect(r.shortPeriodStable).toBe(true); });
  it("identifies positive Cm-alpha as not statically stable", () => { const r = calculateLongitudinalModes({ ...a, cmAlphaPerRad: .8 }); expect(r.shortPeriodStable).toBe(false); expect(r.shortPeriodNaturalFrequencyRadS).toBe(0); });
});
