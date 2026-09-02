function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
  return value;
}

export function calculateTailElevatorContribution(values) {
  const { tailAreaM2, tailArmM, wingAreaM2, meanChordM, elevatorDeflectionDeg, elevatorEffectiveness } = values;
  Object.entries(values).forEach(([name, value]) => finite(name, value));
  if (tailAreaM2 < 0 || tailArmM < 0 || wingAreaM2 <= 0 || meanChordM <= 0) throw new RangeError("Areas/chord must be positive and tail dimensions nonnegative.");
  if (elevatorEffectiveness < 0) throw new RangeError("elevatorEffectiveness cannot be negative.");
  const tailVolumeCoefficient = tailAreaM2 * tailArmM / (wingAreaM2 * meanChordM);
  const elevatorControlDerivativePerRad = -tailVolumeCoefficient * elevatorEffectiveness;
  const elevatorDeflectionRad = elevatorDeflectionDeg * Math.PI / 180;
  const elevatorMomentCoefficientChange = elevatorDeflectionRad === 0 ? 0 : elevatorControlDerivativePerRad * elevatorDeflectionRad;
  return { tailVolumeCoefficient, elevatorControlDerivativePerRad, elevatorDeflectionRad, elevatorMomentCoefficientChange };
}
