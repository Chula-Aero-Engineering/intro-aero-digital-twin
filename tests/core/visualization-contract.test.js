import { describe, expect, it } from "vitest";
import { normalizePlot, normalizeScene } from "../../src/core/visualization/visualizationContract.js";

describe("visualization data contract", () => {
  it("accepts calculated plot series and removes invalid points", () => {
    const plot = normalizePlot({
      title: "Test relationship",
      series: [{ label: "Model", points: [{ x: 0, y: 1 }, { x: 2, y: 5 }, { x: NaN, y: 9 }] }],
    });

    expect(plot.series[0].points).toEqual([{ x: 0, y: 1 }, { x: 2, y: 5 }]);
  });

  it("rejects empty plot data without breaking the workspace", () => {
    expect(normalizePlot({ series: [] })).toBeNull();
  });

  it("accepts point and arrow overlays but ignores unknown renderer instructions", () => {
    const scene = normalizeScene({
      overlays: [
        { type: "point", position: { x: 0, y: 0, z: 0 } },
        { type: "arrow", origin: { x: 0, y: 0, z: 0 }, vector: { x: 0, y: 1, z: 0 } },
        { type: "custom-three-js-mesh" },
      ],
    });

    expect(scene.overlays).toHaveLength(2);
  });
});
