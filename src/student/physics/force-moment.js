/**
 * External force and pitch-moment physics.
 *
 * Aircraft frame:
 * +x forward
 * +y toward the right wing
 * +z downward
 *
 * Positive externalForceN is upward.
 * Positive pitch moment about +y is nose-up.
 * Negative pitch moment about +y is nose-down.
 */

function requireFiniteNumber(value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}

/**
 * Calculate the signed longitudinal moment arm.
 *
 * Inputs:
 * - externalForceXM: force application x-location [m]
 * - cgM: aircraft center-of-gravity x-location [m]
 *
 * Output:
 * - signed moment arm [m]
 */
export function calculateMomentArmM(externalForceXM, cgM) {
  requireFiniteNumber(externalForceXM, "externalForceXM");
  requireFiniteNumber(cgM, "cgM");

  return externalForceXM - cgM;
}

/**
 * Calculate pitch moment about the CG from one vertical external force.
 *
 * Inputs:
 * - momentArmM: signed longitudinal moment arm [m]
 * - externalForceN: signed vertical external force [N], positive upward
 *
 * Output:
 * - pitch moment about +y [N·m]
 *
 * Under the specified aircraft-frame convention:
 * positive moment = nose-up
 * negative moment = nose-down
 */
export function calculatePitchMomentNm(momentArmM, externalForceN) {
  requireFiniteNumber(momentArmM, "momentArmM");
  requireFiniteNumber(externalForceN, "externalForceN");

  const pitchMomentNm = momentArmM * externalForceN;

  return pitchMomentNm === 0 ? 0 : pitchMomentNm;
}

/**
 * Calculate the initial pitch angular acceleration contributed by the
 * external-force pitch moment.
 *
 * Inputs:
 * - pitchMomentNm: pitch moment about the CG [N·m]
 * - pitchInertiaKgM2: pitch moment of inertia about the CG [kg·m²]
 *
 * Output:
 * - initial pitch angular acceleration [rad/s²]
 */
export function calculatePitchAngularAccelerationRadS2(
  pitchMomentNm,
  pitchInertiaKgM2
) {
  requireFiniteNumber(pitchMomentNm, "pitchMomentNm");
  requireFiniteNumber(pitchInertiaKgM2, "pitchInertiaKgM2");

  if (pitchInertiaKgM2 <= 0) {
    throw new RangeError("pitchInertiaKgM2 must be greater than zero.");
  }

  return pitchMomentNm / pitchInertiaKgM2;
}

/**
 * Classify pitch tendency using the specified sign convention.
 *
 * Input:
 * - pitchMomentNm: pitch moment about +y [N·m]
 *
 * Output:
 * - "nose-up", "nose-down", or "zero pitch tendency"
 */
export function classifyPitchTendency(pitchMomentNm) {
  requireFiniteNumber(pitchMomentNm, "pitchMomentNm");

  if (pitchMomentNm > 0) {
    return "nose-up";
  }

  if (pitchMomentNm < 0) {
    return "nose-down";
  }

  return "zero pitch tendency";
}

/**
 * Evaluate the complete external-force pitch contribution.
 *
 * Inputs:
 * - externalForceN [N]
 * - externalForceXM [m]
 * - cgM [m]
 * - pitchInertiaKgM2 [kg·m²]
 *
 * Assumes a rigid aircraft, fixed CG and pitch inertia, and one concentrated
 * vertical force acting on the aircraft x-axis.
 */
export function evaluateForceMoment({
  externalForceN,
  externalForceXM,
  cgM,
  pitchInertiaKgM2,
}) {
  requireFiniteNumber(externalForceN, "externalForceN");
  requireFiniteNumber(externalForceXM, "externalForceXM");
  requireFiniteNumber(cgM, "cgM");
  requireFiniteNumber(pitchInertiaKgM2, "pitchInertiaKgM2");

  if (pitchInertiaKgM2 <= 0) {
    throw new RangeError("pitchInertiaKgM2 must be greater than zero.");
  }

  const momentArmM = calculateMomentArmM(externalForceXM, cgM);
  const pitchMomentNm = calculatePitchMomentNm(
    momentArmM,
    externalForceN
  );
  const pitchAngularAccelerationRadS2 =
    calculatePitchAngularAccelerationRadS2(
      pitchMomentNm,
      pitchInertiaKgM2
    );

  return {
    momentArmM,
    pitchMomentNm,
    pitchAngularAccelerationRadS2,
    pitchTendency: classifyPitchTendency(pitchMomentNm),
  };
}
