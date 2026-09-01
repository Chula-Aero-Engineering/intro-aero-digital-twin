function finite(value) {
  return Number.isFinite(value);
}

export function normalizePlot(plot) {
  if (!plot || !Array.isArray(plot.series)) return null;

  const series = plot.series
    .map((item, index) => ({
      label: item.label || `Series ${index + 1}`,
      color: item.color || "#ff5a36",
      points: Array.isArray(item.points)
        ? item.points.filter((point) => finite(point?.x) && finite(point?.y))
        : [],
    }))
    .filter((item) => item.points.length > 0);

  if (series.length === 0) return null;

  return {
    id: plot.id || "engineering-plot",
    title: plot.title || "Engineering relationship",
    xLabel: plot.xLabel || "x",
    yLabel: plot.yLabel || "y",
    series,
    regions: (Array.isArray(plot.regions) ? plot.regions : [])
      .filter((region) => [region?.xMin, region?.xMax, region?.yMin, region?.yMax].every(finite))
      .map((region) => ({
        ...region,
        label: region.label || "Acceptable region",
        color: region.color || "#dce9ad",
      })),
    referenceLines: (Array.isArray(plot.referenceLines) ? plot.referenceLines : [])
      .filter((line) => ["x", "y"].includes(line?.axis) && finite(line?.value))
      .map((line) => ({ ...line, label: line.label || "Requirement" })),
  };
}

export function normalizeScene(scene) {
  if (!scene || typeof scene !== "object") return { caption: "Baseline aircraft geometry", overlays: [] };

  const overlays = (Array.isArray(scene.overlays) ? scene.overlays : [])
    .filter((overlay) => ["arrow", "point"].includes(overlay?.type))
    .filter((overlay) => {
      if (overlay.type === "point") {
        return [overlay.position?.x, overlay.position?.y, overlay.position?.z].every(finite);
      }
      return [
        overlay.origin?.x, overlay.origin?.y, overlay.origin?.z,
        overlay.vector?.x, overlay.vector?.y, overlay.vector?.z,
      ].every(finite);
    });

  return {
    caption: scene.caption || "Module visualization",
    overlays,
  };
}
