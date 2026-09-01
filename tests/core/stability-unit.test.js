import { describe, expect, it } from "vitest";
import { initialAircraft, parameterDefinitions } from "../../src/core/data/aircraft.js";
import { featuresForLesson, lessonCatalog } from "../../src/core/data/lessonCatalog.js";

describe("stability teaching core", () => {
  it("provides foundations plus the five stability blocks", () => {
    expect(lessonCatalog.map((lesson) => lesson.id)).toEqual([
      "foundations",
      "disturbance-trim-response",
      "longitudinal-static-stability",
      "cg-loading-limits",
      "lateral-directional-dynamics",
      "mission-loading-decision",
    ]);
  });

  it("uses unique feature slots", () => {
    const featureIds = lessonCatalog.flatMap((lesson) => lesson.featureIds);
    expect(new Set(featureIds).size).toBe(featureIds.length);
    expect(featureIds).toEqual([
      "trim-response", "static-margin", "cg-loading", "dynamic-mode", "mission-loading",
    ]);
  });

  it("defines every lesson input in the canonical aircraft state", () => {
    const definitionKeys = new Set(parameterDefinitions.map(({ key }) => key));
    const lessonKeys = new Set(lessonCatalog.flatMap((lesson) => lesson.parameterKeys));

    lessonKeys.forEach((key) => {
      expect(initialAircraft).toHaveProperty(key);
      expect(definitionKeys.has(key)).toBe(true);
    });
  });

  it("places assigned analyses and leaves legacy analyses in foundations", () => {
    const features = [{ id: "lift" }, { id: "static-margin" }, { id: "weight-demo" }];

    expect(featuresForLesson(features, lessonCatalog[0]).map(({ id }) => id)).toEqual([
      "lift", "weight-demo",
    ]);
    expect(featuresForLesson(features, lessonCatalog[2]).map(({ id }) => id)).toEqual([
      "static-margin",
    ]);
  });

  it("starts with a physically consistent introductory loading scenario", () => {
    expect(initialAircraft.forwardCgLimitM).toBeLessThan(initialAircraft.aftCgLimitM);
    expect(initialAircraft.initialPayloadPositionM).toBeLessThan(initialAircraft.missionPayloadPositionM);
    expect(initialAircraft.dutchRollRealPartPerS).toBeLessThan(0);
    expect(initialAircraft.dutchRollImagPartRadS).toBeGreaterThan(0);
  });
});
