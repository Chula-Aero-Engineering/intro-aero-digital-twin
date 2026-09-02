import { describe, expect, it } from "vitest";
import {
  calculateBodyPitchMomentNm,
  calculateDeltaCm,
  calculateDynamicPressurePa,
  classifyStaticTendency,
  degreesToRadians,
  evaluateStaticRestoringMoment,
  evaluateStaticRestoringMomentFromAlphaRad,
} from "../../src/student/physics/static-restoring-moment.js";
import { model } from "../../src/student/features/static-restoring-moment.feature.js";

const reference = {
  densityKgM3: 1.225,
  speedMps: 10,
  wingAreaM2: 0.5,
  meanChordM: 0.32,
  cmAlphaPerRad: -0.8,
  disturbanceAlphaDeg: 2,
};

describe("static restoring moment physics", () => {
  it("matches the reference calculation and converts the sign for body +y", () => {
    const result = evaluateStaticRestoringMoment(reference);
    expect(result.dynamicPressurePa).toBeCloseTo(61.25, 12);
    expect(result.disturbanceAlphaRad).toBeCloseTo(2 * Math.PI / 180, 12);
    expect(result.deltaCm).toBeCloseTo(-0.8 * 2 * Math.PI / 180, 12);
    expect(result.bodyPitchMomentNm).toBeCloseTo(-0.273667627, 9);
    expect(result.staticTendency).toBe("restoring");
  });

  it("doubles moment when disturbance doubles", () => {
    const baseline = evaluateStaticRestoringMoment(reference);
    const doubled = evaluateStaticRestoringMoment({ ...reference, disturbanceAlphaDeg: 4 });
    expect(doubled.bodyPitchMomentNm).toBeCloseTo(2 * baseline.bodyPitchMomentNm, 12);
  });

  it("classifies restoring, destabilizing, and neutral tendencies", () => {
    expect(classifyStaticTendency(0.1, -0.08)).toBe("restoring");
    expect(classifyStaticTendency(0.1, 0.08)).toBe("destabilizing");
    expect(classifyStaticTendency(0, 0)).toBe("neutral");
  });

  it("produces canonical zero at zero disturbance", () => {
    const result = evaluateStaticRestoringMoment({ ...reference, disturbanceAlphaDeg: 0 });
    expect(result.deltaCm).toBe(0);
    expect(result.bodyPitchMomentNm).toBe(0);
  });

  it("keeps coefficient and body-axis moment sign conventions explicit", () => {
    const deltaCm = calculateDeltaCm(-0.8, degreesToRadians(2));
    const bodyMoment = calculateBodyPitchMomentNm(calculateDynamicPressurePa(1.225, 10), 0.5, 0.32, deltaCm);
    expect(deltaCm).toBeLessThan(0);
    expect(bodyMoment).toBeLessThan(0);
  });

  it("produces a body moment that opposes current pitch displacement for negative Cm-alpha", () => {
    const noseUp = evaluateStaticRestoringMomentFromAlphaRad({
      ...reference,
      disturbanceAlphaRad: degreesToRadians(2),
    });
    const noseDown = evaluateStaticRestoringMomentFromAlphaRad({
      ...reference,
      disturbanceAlphaRad: degreesToRadians(-2),
    });
    expect(noseUp.bodyPitchMomentNm).toBeLessThan(0);
    expect(noseDown.bodyPitchMomentNm).toBeGreaterThan(0);
  });

  it("exposes the selected-disturbance moment without applying it at a zero runtime state", () => {
    const output = model.evaluate({ aircraft: reference, state: { pitchRad: 0 } });
    expect(output.momentsBodyNm.y).toBe(0);
    expect(output.values.bodyPitchMomentNm).toBe(0);
    expect(output.values.selectedBodyPitchMomentNm).toBeCloseTo(-0.273667627, 9);
    expect(output.values.selectedDisturbanceAlphaRad).toBeCloseTo(2 * Math.PI / 180, 12);
    expect(output.values.selectedStaticTendency).toBe("restoring");
  });

  it("rejects invalid physical and non-finite inputs", () => {
    expect(() => evaluateStaticRestoringMoment({ ...reference, densityKgM3: 0 })).toThrow();
    expect(() => evaluateStaticRestoringMoment({ ...reference, speedMps: -1 })).toThrow();
    expect(() => evaluateStaticRestoringMoment({ ...reference, wingAreaM2: 0 })).toThrow();
    expect(() => evaluateStaticRestoringMoment({ ...reference, meanChordM: 0 })).toThrow();
    expect(() => evaluateStaticRestoringMoment({ ...reference, cmAlphaPerRad: NaN })).toThrow();
    expect(() => evaluateStaticRestoringMoment({ ...reference, disturbanceAlphaDeg: Infinity })).toThrow();
  });
});
