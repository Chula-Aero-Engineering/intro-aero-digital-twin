function requireFinite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  return value;
}

function requirePositive(name, value) {
  requireFinite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return value;
}

function requireNonNegative(name, value) {
  requireFinite(name, value);
  if (value < 0) throw new RangeError(`${name} cannot be negative.`);
  return value;
}

function canonicalZero(value) {
  return value === 0 ? 0 : value;
}

// Input: angle [deg]. Output: angle [rad].
export function degreesToRadians(angleDeg) {
  requireFinite("angleDeg", angleDeg);
  return canonicalZero(angleDeg * Math.PI / 180);
}

// Inputs: density [kg/m^3], speed [m/s]. Output: dynamic pressure [Pa].
export function calculateDynamicPressurePa(densityKgM3, speedMps) {
  requirePositive("densityKgM3", densityKgM3);
  requireNonNegative("speedMps", speedMps);
  return 0.5 * densityKgM3 * speedMps ** 2;
}

// Cm uses the conventional aerodynamic sign: positive is nose-up.
export function calculateDeltaCm(cmAlphaPerRad, disturbanceAlphaRad) {
  requireFinite("cmAlphaPerRad", cmAlphaPerRad);
  requireFinite("disturbanceAlphaRad", disturbanceAlphaRad);
  return canonicalZero(cmAlphaPerRad * disturbanceAlphaRad);
}

// Conventional aerodynamic Cm and body +My are both positive nose-up in the
// standard +x-forward, +y-right, +z-down aircraft frame.
export function calculateBodyPitchMomentNm(dynamicPressurePa, wingAreaM2, meanChordM, deltaCm) {
  requireNonNegative("dynamicPressurePa", dynamicPressurePa);
  requirePositive("wingAreaM2", wingAreaM2);
  requirePositive("meanChordM", meanChordM);
  requireFinite("deltaCm", deltaCm);
  return canonicalZero(dynamicPressurePa * wingAreaM2 * meanChordM * deltaCm);
}

export function classifyStaticTendency(disturbanceAlphaRad, deltaCm) {
  requireFinite("disturbanceAlphaRad", disturbanceAlphaRad);
  requireFinite("deltaCm", deltaCm);
  const tendencyProduct = disturbanceAlphaRad * deltaCm;
  if (tendencyProduct < 0) return "restoring";
  if (tendencyProduct > 0) return "destabilizing";
  return "neutral";
}

export function evaluateStaticRestoringMoment({
  densityKgM3,
  speedMps,
  wingAreaM2,
  meanChordM,
  cmAlphaPerRad,
  disturbanceAlphaDeg,
}) {
  return evaluateStaticRestoringMomentFromAlphaRad({
    densityKgM3,
    speedMps,
    wingAreaM2,
    meanChordM,
    cmAlphaPerRad,
    disturbanceAlphaRad: degreesToRadians(disturbanceAlphaDeg),
  });
}

export function evaluateStaticRestoringMomentFromAlphaRad({
  densityKgM3,
  speedMps,
  wingAreaM2,
  meanChordM,
  cmAlphaPerRad,
  disturbanceAlphaRad,
}) {
  requireFinite("disturbanceAlphaRad", disturbanceAlphaRad);
  const dynamicPressurePa = calculateDynamicPressurePa(densityKgM3, speedMps);
  const deltaCm = calculateDeltaCm(cmAlphaPerRad, disturbanceAlphaRad);
  const bodyPitchMomentNm = calculateBodyPitchMomentNm(dynamicPressurePa, wingAreaM2, meanChordM, deltaCm);
  return {
    disturbanceAlphaRad,
    dynamicPressurePa,
    deltaCm,
    bodyPitchMomentNm,
    staticTendency: classifyStaticTendency(disturbanceAlphaRad, deltaCm),
  };
}
