function requireFinite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  return value;
}

function canonicalZero(value) {
  return value === 0 ? 0 : value;
}

// Positive forceN is upward, or negative body Fz in the +z-down frame.
// It therefore produces body-axis My = (x - xCG)Fup.
export function calculateVerticalForcePitchMomentNm(forceN, forceXM, cgM) {
  requireFinite("forceN", forceN);
  requireFinite("forceXM", forceXM);
  requireFinite("cgM", cgM);
  return canonicalZero((forceXM - cgM) * forceN);
}

// Thrust Fx acting at vertical offset z produces body-axis My = z Fx.
export function calculateThrustPitchMomentNm(thrustN, thrustLineZM) {
  requireFinite("thrustN", thrustN);
  requireFinite("thrustLineZM", thrustLineZM);
  if (thrustN < 0) throw new RangeError("thrustN cannot be negative.");
  return canonicalZero(thrustLineZM * thrustN);
}

export function sumPitchMomentsNm(...momentsNm) {
  momentsNm.forEach((value, index) => requireFinite(`momentsNm[${index}]`, value));
  return canonicalZero(momentsNm.reduce((sum, value) => sum + value, 0));
}

export function classifyPitchMoment(pitchMomentNm) {
  requireFinite("pitchMomentNm", pitchMomentNm);
  if (pitchMomentNm > 0) return "nose-up";
  if (pitchMomentNm < 0) return "nose-down";
  return "balanced";
}

export function evaluateMomentContributions({
  wingLiftN,
  wingForceXM,
  tailForceN,
  tailPositionM,
  thrustN,
  thrustLineZM,
  cgM,
  externalPitchMomentNm,
  staticRestoringBodyMomentNm,
}) {
  requireFinite("externalPitchMomentNm", externalPitchMomentNm);
  requireFinite("staticRestoringBodyMomentNm", staticRestoringBodyMomentNm);
  const wingPitchMomentNm = calculateVerticalForcePitchMomentNm(wingLiftN, wingForceXM, cgM);
  const tailPitchMomentNm = calculateVerticalForcePitchMomentNm(tailForceN, tailPositionM, cgM);
  const thrustPitchMomentNm = calculateThrustPitchMomentNm(thrustN, thrustLineZM);
  const addedPitchMomentNm = sumPitchMomentsNm(wingPitchMomentNm, tailPitchMomentNm, thrustPitchMomentNm);
  const netPitchMomentNm = sumPitchMomentsNm(
    externalPitchMomentNm,
    staticRestoringBodyMomentNm,
    addedPitchMomentNm,
  );
  return {
    externalPitchMomentNm,
    staticRestoringBodyMomentNm,
    wingPitchMomentNm,
    tailPitchMomentNm,
    thrustPitchMomentNm,
    addedPitchMomentNm,
    netPitchMomentNm,
    pitchTendency: classifyPitchMoment(netPitchMomentNm),
  };
}
