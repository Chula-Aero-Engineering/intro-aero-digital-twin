function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function calculatePitchDynamicResponse(values) {
  Object.entries(values).forEach(([name, value]) => finite(name, value));
  const { pitchInertiaKgM2, cmQPerRad, pitchRateRadS, speedMps, densityKgM3, wingAreaM2, meanChordM, appliedPitchMomentNm = 0 } = values;
  if (pitchInertiaKgM2 <= 0 || speedMps <= 0 || densityKgM3 <= 0 || wingAreaM2 <= 0 || meanChordM <= 0) throw new RangeError("Inertia, speed, density, area, and chord must be positive.");
  const dynamicPressurePa = 0.5 * densityKgM3 * speedMps ** 2;
  const nondimensionalPitchRate = pitchRateRadS * meanChordM / (2 * speedMps);
  const dampingMomentCoefficient = nondimensionalPitchRate === 0 ? 0 : cmQPerRad * nondimensionalPitchRate;
  const dampingPitchMomentNm = dampingMomentCoefficient === 0 ? 0 : dynamicPressurePa * wingAreaM2 * meanChordM * dampingMomentCoefficient;
  const netPitchMomentNm = appliedPitchMomentNm + dampingPitchMomentNm;
  return { dynamicPressurePa, nondimensionalPitchRate, dampingMomentCoefficient, dampingPitchMomentNm, netPitchMomentNm, pitchAngularAccelerationRadS2: netPitchMomentNm / pitchInertiaKgM2 };
}
