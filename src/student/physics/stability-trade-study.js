function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function evaluateStabilityTradeStudy(values) {
  Object.entries(values).forEach(([name, value]) => finite(name, value));
  const { cgM, neutralPointM, meanChordM, tailAreaM2, tailArmM, wingAreaM2, elevatorEffectiveness, minimumStaticMargin } = values;
  if (meanChordM <= 0 || wingAreaM2 <= 0 || tailAreaM2 < 0 || tailArmM < 0 || elevatorEffectiveness < 0) throw new RangeError("Geometry/effectiveness inputs are outside their valid ranges.");
  const staticMargin = (neutralPointM - cgM) / meanChordM;
  const tailVolumeCoefficient = tailAreaM2 * tailArmM / (wingAreaM2 * meanChordM);
  const controlAuthorityIndex = tailVolumeCoefficient * elevatorEffectiveness;
  return { staticMargin, staticMarginPercent: 100 * staticMargin, staticMarginRequirementMet: staticMargin >= minimumStaticMargin, tailVolumeCoefficient, controlAuthorityIndex };
}
