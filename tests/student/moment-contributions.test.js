import { describe, expect, it } from "vitest";
import {
  calculateThrustPitchMomentNm,
  calculateVerticalForcePitchMomentNm,
  classifyPitchMoment,
  evaluateMomentContributions,
  sumPitchMomentsNm,
} from "../../src/student/physics/moment-contributions.js";
import { feature } from "../../src/student/features/moment-contributions.feature.js";

const reference = {
  wingLiftN: 14,
  wingForceXM: 0.1,
  tailForceN: 1.2,
  tailPositionM: -0.48,
  thrustN: 4,
  thrustLineZM: -0.02,
  cgM: 0.12,
  externalPitchMomentNm: 0.66,
  staticRestoringBodyMomentNm: -0.273667627,
};

describe("longitudinal moment-contribution physics", () => {
  it("matches the reference component assembly", () => {
    const result = evaluateMomentContributions(reference);
    expect(result.wingPitchMomentNm).toBeCloseTo(-0.28, 12);
    expect(result.tailPitchMomentNm).toBeCloseTo(-0.72, 12);
    expect(result.thrustPitchMomentNm).toBeCloseTo(-0.08, 12);
    expect(result.addedPitchMomentNm).toBeCloseTo(-1.08, 12);
    expect(result.netPitchMomentNm).toBeCloseTo(-0.693667627, 9);
    expect(result.pitchTendency).toBe("nose-down");
  });

  it("returns zero vertical-force moment when force acts at the CG", () => {
    expect(calculateVerticalForcePitchMomentNm(14, 0.12, 0.12)).toBe(0);
  });

  it("reverses vertical-force moment across the CG", () => {
    const ahead = calculateVerticalForcePitchMomentNm(2, 0.45, 0.12);
    const behind = calculateVerticalForcePitchMomentNm(2, -0.21, 0.12);
    expect(ahead).toBeCloseTo(-behind, 12);
  });

  it("uses the thrust-line vertical offset for thrust moment", () => {
    expect(calculateThrustPitchMomentNm(4, -0.02)).toBeCloseTo(-0.08, 12);
    expect(calculateThrustPitchMomentNm(4, 0)).toBe(0);
  });

  it("sums signed contributions and classifies their net tendency", () => {
    expect(sumPitchMomentsNm(0.66, -0.273667627, -0.28, -0.72, -0.08)).toBeCloseTo(-0.693667627, 9);
    expect(classifyPitchMoment(1)).toBe("nose-up");
    expect(classifyPitchMoment(-1)).toBe("nose-down");
    expect(classifyPitchMoment(0)).toBe("balanced");
  });

  it("rejects negative thrust and non-finite inputs", () => {
    expect(() => calculateThrustPitchMomentNm(-1, 0)).toThrow();
    expect(() => calculateVerticalForcePitchMomentNm(NaN, 0, 0)).toThrow();
    expect(() => sumPitchMomentsNm(0, Infinity)).toThrow();
    expect(() => evaluateMomentContributions({ ...reference, externalPitchMomentNm: NaN })).toThrow();
  });

  it("uses the selected Stage 2 disturbance for static analysis", () => {
    const analysis = feature.analyze(reference, {
      "loads.pitch.external-moment": { values: { pitchMomentNm: 0.66 } },
      "aero.pitch.static-restoring": {
        momentsBodyNm: { y: 0 },
        values: {
          bodyPitchMomentNm: 0,
          selectedBodyPitchMomentNm: -0.273667627,
        },
      },
    });
    expect(analysis.results.find(({ label }) => label.startsWith("Static-restoring")).value)
      .toBeCloseTo(-0.273667627, 9);
    expect(analysis.results.find(({ label }) => label === "Net pitch moment").value)
      .toBeCloseTo(-0.693667627, 9);
  });
});
