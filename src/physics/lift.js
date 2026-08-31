function requireFiniteNumber(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }

  return value;
}

function requireNonNegative(name, value) {
  requireFiniteNumber(name, value);

  if (value < 0) {
    throw new RangeError(`${name} cannot be negative.`);
  }

  return value;
}

function requirePositive(name, value) {
  requireFiniteNumber(name, value);

  if (value <= 0) {
    throw new RangeError(`${name} must be greater than zero.`);
  }

  return value;
}

/**
 * Modeled lift from the steady aerodynamic lift equation.
 * SI units: density [kg/m^3], speed [m/s], area [m^2], lift [N].
 * Assumes the supplied CL represents the selected flight condition.
 */
export function calculateLift(densityKgM3, speedMps, wingAreaM2, cl) {
  requirePositive("densityKgM3", densityKgM3);
  requireNonNegative("speedMps", speedMps);
  requirePositive("wingAreaM2", wingAreaM2);
  requireFiniteNumber("cl", cl);

  return 0.5 * densityKgM3 * speedMps ** 2 * wingAreaM2 * cl;
}

/**
 * Aircraft weight using g = 9.81 m/s^2.
 * SI units: mass [kg], weight [N].
 */
export function calculateWeight(massKg) {
  requireNonNegative("massKg", massKg);

  const gMps2 = 9.81;
  return massKg * gMps2;
}

/**
 * Lift coefficient required for modeled lift to equal aircraft weight.
 * SI units: mass [kg], density [kg/m^3], speed [m/s], area [m^2].
 * Assumes steady, level flight for the lift-equals-weight comparison.
 */
export function calculateRequiredCl(
  massKg,
  densityKgM3,
  speedMps,
  wingAreaM2
) {
  requireNonNegative("massKg", massKg);
  requirePositive("densityKgM3", densityKgM3);
  requirePositive("speedMps", speedMps);
  requirePositive("wingAreaM2", wingAreaM2);

  const weightN = calculateWeight(massKg);
  const liftPerUnitCl = calculateLift(
    densityKgM3,
    speedMps,
    wingAreaM2,
    1
  );

  return weightN / liftPerUnitCl;
}