function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function calculateLoadedCg({ massKg, airframeCgM, payloadKg, payloadPositionM, neutralPointM, meanChordM }) {
  [massKg, airframeCgM, payloadKg, payloadPositionM, neutralPointM, meanChordM].forEach((v, i) => finite(["massKg", "airframeCgM", "payloadKg", "payloadPositionM", "neutralPointM", "meanChordM"][i], v));
  if (massKg <= 0 || payloadKg < 0 || meanChordM <= 0) throw new RangeError("Mass and chord inputs are outside their valid ranges.");
  const totalMassKg = massKg + payloadKg;
  const loadedCgM = payloadKg === 0 ? airframeCgM : (massKg * airframeCgM + payloadKg * payloadPositionM) / totalMassKg;
  const staticMargin = (neutralPointM - loadedCgM) / meanChordM;
  return { totalMassKg, loadedCgM, staticMargin, staticMarginPercent: 100 * staticMargin };
}
