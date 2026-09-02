import { describe, expect, it } from "vitest";

import {
  calculateMomentArmM,
  calculatePitchMomentNm,
  calculatePitchAngularAccelerationRadS2,
  classifyPitchTendency,
  evaluateForceMoment,
} from "../../src/student/physics/force-moment.js";
import { feature } from "../../src/student/features/force-moment.feature.js";

describe("external force and pitch moment physics", () => {
  it("matches the numerical reference case", () => {
    const result = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    expect(result.momentArmM).toBeCloseTo(0.33, 12);
    expect(result.pitchMomentNm).toBeCloseTo(0.66, 12);
    expect(result.pitchAngularAccelerationRadS2).toBeCloseTo(
      5.5,
      12
    );
    expect(result.pitchTendency).toBe("nose-up");
  });

  it("doubles pitch moment and angular acceleration when force doubles", () => {
    const result = evaluateForceMoment({
      externalForceN: 4,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    expect(result.pitchMomentNm).toBeCloseTo(1.32, 12);
    expect(result.pitchAngularAccelerationRadS2).toBeCloseTo(
      11,
      12
    );
  });

  it("produces equal-magnitude opposite-sign moments ahead of and behind the CG", () => {
    const ahead = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    const behind = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: -0.21,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    expect(ahead.momentArmM).toBeCloseTo(0.33, 12);
    expect(behind.momentArmM).toBeCloseTo(-0.33, 12);

    expect(ahead.pitchMomentNm).toBeCloseTo(0.66, 12);
    expect(behind.pitchMomentNm).toBeCloseTo(-0.66, 12);

    expect(ahead.pitchMomentNm).toBeCloseTo(
      -behind.pitchMomentNm,
      12
    );
  });

  it("produces exactly zero moment and angular acceleration when force is applied at the CG", () => {
    const result = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.12,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    expect(result.momentArmM).toBe(0);
    expect(result.pitchMomentNm).toBe(0);
    expect(result.pitchAngularAccelerationRadS2).toBe(0);
    expect(result.pitchTendency).toBe("zero pitch tendency");
  });

  it("describes the zero case without duplicating the word tendency", () => {
    const analysis = feature.analyze({
      externalForceN: 2,
      externalForceXM: 0.12,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });
    expect(analysis.decision.interpretation).toContain("corresponding to zero pitch tendency.");
    expect(analysis.decision.interpretation).not.toContain("tendency tendency");
  });

  it("rejects zero pitch inertia", () => {
    expect(() =>
      evaluateForceMoment({
        externalForceN: 2,
        externalForceXM: 0.45,
        cgM: 0.12,
        pitchInertiaKgM2: 0,
      })
    ).toThrow();
  });

  it("rejects negative pitch inertia", () => {
    expect(() =>
      evaluateForceMoment({
        externalForceN: 2,
        externalForceXM: 0.45,
        cgM: 0.12,
        pitchInertiaKgM2: -0.12,
      })
    ).toThrow();
  });

  it.each([
    ["externalForceN", NaN],
    ["externalForceN", Infinity],
    ["externalForceN", -Infinity],
    ["externalForceXM", NaN],
    ["externalForceXM", Infinity],
    ["externalForceXM", -Infinity],
    ["cgM", NaN],
    ["cgM", Infinity],
    ["cgM", -Infinity],
    ["pitchInertiaKgM2", NaN],
    ["pitchInertiaKgM2", Infinity],
    ["pitchInertiaKgM2", -Infinity],
  ])("rejects non-finite %s input", (key, value) => {
    const inputs = {
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
      [key]: value,
    };

    expect(() => evaluateForceMoment(inputs)).toThrow();
  });

  it("reversing the force reverses moment and angular acceleration", () => {
    const upward = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    const downward = evaluateForceMoment({
      externalForceN: -2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    expect(downward.pitchMomentNm).toBeCloseTo(
      -upward.pitchMomentNm,
      12
    );

    expect(downward.pitchAngularAccelerationRadS2).toBeCloseTo(
      -upward.pitchAngularAccelerationRadS2,
      12
    );
  });

  it("increasing pitch inertia reduces angular acceleration without changing moment", () => {
    const lowerInertia = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.12,
    });

    const higherInertia = evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0.24,
    });

    expect(higherInertia.pitchMomentNm).toBeCloseTo(
      lowerInertia.pitchMomentNm,
      12
    );

    expect(
      Math.abs(higherInertia.pitchAngularAccelerationRadS2)
    ).toBeLessThan(
      Math.abs(lowerInertia.pitchAngularAccelerationRadS2)
    );
  });

  it("preserves the specified pitch-moment sign convention", () => {
    const aheadArmM = calculateMomentArmM(0.45, 0.12);
    const behindArmM = calculateMomentArmM(-0.21, 0.12);

    const aheadMomentNm = calculatePitchMomentNm(
      aheadArmM,
      2
    );

    const behindMomentNm = calculatePitchMomentNm(
      behindArmM,
      2
    );

    expect(aheadMomentNm).toBeGreaterThan(0);
    expect(classifyPitchTendency(aheadMomentNm)).toBe(
      "nose-up"
    );

    expect(behindMomentNm).toBeLessThan(0);
    expect(classifyPitchTendency(behindMomentNm)).toBe(
      "nose-down"
    );
  });

  it("calculates angular acceleration from pitch moment and pitch inertia", () => {
    expect(
      calculatePitchAngularAccelerationRadS2(0.66, 0.12)
    ).toBeCloseTo(5.5, 12);
  });
});
