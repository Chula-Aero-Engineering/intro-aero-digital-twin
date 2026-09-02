function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function calculateLateralStaticStability(values) {
  Object.entries(values).forEach(([name, value]) => finite(name, value));
  const { sideslipDeg, clBetaPerRad, cnBetaPerRad, wingSpanM, wingAreaM2, speedMps, densityKgM3 } = values;
  if (wingSpanM <= 0 || wingAreaM2 <= 0 || speedMps < 0 || densityKgM3 <= 0) throw new RangeError("Geometry, speed, and density inputs are outside their valid ranges.");
  const sideslipRad = sideslipDeg * Math.PI / 180;
  const dynamicPressurePa = 0.5 * densityKgM3 * speedMps ** 2;
  const rollMomentCoefficient = sideslipRad === 0 ? 0 : clBetaPerRad * sideslipRad;
  const yawMomentCoefficient = sideslipRad === 0 ? 0 : cnBetaPerRad * sideslipRad;
  return {
    sideslipRad, dynamicPressurePa, rollMomentCoefficient, yawMomentCoefficient,
    rollMomentNm: dynamicPressurePa * wingAreaM2 * wingSpanM * rollMomentCoefficient,
    yawMomentNm: dynamicPressurePa * wingAreaM2 * wingSpanM * yawMomentCoefficient,
    rollRestoring: clBetaPerRad < 0, yawRestoring: cnBetaPerRad > 0,
  };
}
