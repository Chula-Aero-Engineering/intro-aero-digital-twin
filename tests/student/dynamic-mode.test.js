import { describe, expect, it } from "vitest";
import { calculateDynamicMode, sampleDynamicMode } from "../../src/student/physics/dynamic-mode.js";
describe("dynamic lateral mode", () => {
  it("calculates modal properties from the supplied eigenvalue", () => { const r = calculateDynamicMode({ dutchRollRealPartPerS: -.6, dutchRollImagPartRadS: 2.4 }); expect(r.naturalFrequencyRadS).toBeCloseTo(Math.hypot(.6, 2.4)); expect(r.dampingRatio).toBeGreaterThan(0); expect(r.behavior).toBe("decaying"); });
  it("samples exact endpoints and handles a nonoscillatory boundary", () => { const p = sampleDynamicMode({ sigmaPerS: 0, omegaDRadS: 0, initialAmplitude: 2, durationS: 4, samples: 3 }); expect(p).toEqual([{ timeS: 0, value: 2 }, { timeS: 2, value: 2 }, { timeS: 4, value: 2 }]); expect(calculateDynamicMode({ dutchRollRealPartPerS: -1, dutchRollImagPartRadS: 0 }).periodS).toBeNull(); });
});
