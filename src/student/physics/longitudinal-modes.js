function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function calculateLongitudinalModes(values) {
  Object.entries(values).forEach(([name, value]) => finite(name, value));
  const { speedMps, densityKgM3, wingAreaM2, meanChordM, pitchInertiaKgM2, cmAlphaPerRad, cmQPerRad } = values;
  if (speedMps <= 0 || densityKgM3 <= 0 || wingAreaM2 <= 0 || meanChordM <= 0 || pitchInertiaKgM2 <= 0) throw new RangeError("Physical scale inputs must be positive.");
  const dynamicPressurePa = 0.5 * densityKgM3 * speedMps ** 2;
  const pitchStiffnessNmPerRad = -dynamicPressurePa * wingAreaM2 * meanChordM * cmAlphaPerRad;
  const pitchDampingNmsPerRad = -dynamicPressurePa * wingAreaM2 * meanChordM ** 2 * cmQPerRad / (2 * speedMps);
  if (pitchStiffnessNmPerRad <= 0) return { dynamicPressurePa, pitchStiffnessNmPerRad, pitchDampingNmsPerRad, shortPeriodStable: false, shortPeriodNaturalFrequencyRadS: 0, shortPeriodDampingRatio: 0 };
  const shortPeriodNaturalFrequencyRadS = Math.sqrt(pitchStiffnessNmPerRad / pitchInertiaKgM2);
  const shortPeriodDampingRatio = pitchDampingNmsPerRad / (2 * Math.sqrt(pitchStiffnessNmPerRad * pitchInertiaKgM2));
  return { dynamicPressurePa, pitchStiffnessNmPerRad, pitchDampingNmsPerRad, shortPeriodStable: shortPeriodDampingRatio > 0, shortPeriodNaturalFrequencyRadS, shortPeriodDampingRatio };
}
