import { describe, expect, it } from "vitest";
import { calculateLoadedCg } from "../../src/student/physics/cg-loading.js";
const a = { massKg: 1.35, airframeCgM: .11, payloadKg: .25, payloadPositionM: .2, neutralPointM: .16, meanChordM: .32 };
describe("CG loading", () => {
  it("uses the mass-weighted mean and moves aft with payload", () => { const r = calculateLoadedCg(a); expect(r.loadedCgM).toBeCloseTo(.1240625); expect(calculateLoadedCg({ ...a, payloadPositionM: .3 }).loadedCgM).toBeGreaterThan(r.loadedCgM); });
  it("returns airframe CG with zero payload and rejects zero airframe mass", () => { expect(calculateLoadedCg({ ...a, payloadKg: 0 }).loadedCgM).toBe(a.airframeCgM); expect(() => calculateLoadedCg({ ...a, massKg: 0 })).toThrow(); });
});
