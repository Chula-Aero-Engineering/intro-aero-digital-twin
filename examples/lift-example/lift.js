const GRAVITY_MPS2 = 9.81;

function requireNonNegative(name, value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative number.`);
  }
}

// Inputs: density kg/m³, speed m/s, area m², dimensionless CL. Output: lift N.
// Assumes steady conditions and that the supplied CL represents this flight condition.
export function calculateLift({ densityKgM3, speedMps, wingAreaM2, cl }) {
  requireNonNegative("Density", densityKgM3);
  requireNonNegative("Speed", speedMps);
  requireNonNegative("Wing area", wingAreaM2);
  requireNonNegative("Lift coefficient", cl);

  return 0.5 * densityKgM3 * speedMps ** 2 * wingAreaM2 * cl;
}

// Input: total mass kg. Output: weight N. Assumes g = 9.81 m/s².
export function calculateWeight(totalMassKg) {
  requireNonNegative("Total mass", totalMassKg);
  return totalMassKg * GRAVITY_MPS2;
}

// Inputs use SI units. Output is dimensionless required CL for lift equal to weight.
export function calculateRequiredCl({ totalMassKg, densityKgM3, speedMps, wingAreaM2 }) {
  requireNonNegative("Total mass", totalMassKg);
  requireNonNegative("Density", densityKgM3);
  requireNonNegative("Speed", speedMps);
  requireNonNegative("Wing area", wingAreaM2);

  const dynamicPressureArea = 0.5 * densityKgM3 * speedMps ** 2 * wingAreaM2;
  if (dynamicPressureArea === 0) return totalMassKg === 0 ? 0 : Infinity;

  return calculateWeight(totalMassKg) / dynamicPressureArea;
}
