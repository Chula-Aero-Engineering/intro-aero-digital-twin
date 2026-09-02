function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
  return value;
}

export function calculateStaticMargin({ cgM, neutralPointM, meanChordM }) {
  finite("cgM", cgM); finite("neutralPointM", neutralPointM); finite("meanChordM", meanChordM);
  if (meanChordM <= 0) throw new RangeError("meanChordM must be positive.");
  const staticMargin = (neutralPointM - cgM) / meanChordM;
  return {
    cgToNeutralPointM: neutralPointM - cgM,
    staticMargin,
    staticMarginPercent: 100 * staticMargin,
    tendency: staticMargin > 0 ? "positive static margin" : staticMargin < 0 ? "negative static margin" : "neutral point",
  };
}
