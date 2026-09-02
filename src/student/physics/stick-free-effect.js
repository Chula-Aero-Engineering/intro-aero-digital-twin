function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function calculateStickFreeEffect({ fixedControlDerivativePerRad, elevatorEffectiveness, stickFreeFactor }) {
  [fixedControlDerivativePerRad, elevatorEffectiveness, stickFreeFactor].forEach((v, i) => finite(["fixedControlDerivativePerRad", "elevatorEffectiveness", "stickFreeFactor"][i], v));
  if (elevatorEffectiveness < 0 || stickFreeFactor < 0 || stickFreeFactor > 1) throw new RangeError("Effectiveness must be nonnegative and stickFreeFactor must be between zero and one.");
  const effectiveElevatorEffectiveness = elevatorEffectiveness * stickFreeFactor;
  const stickFreeControlDerivativePerRad = stickFreeFactor === 0 ? 0 : fixedControlDerivativePerRad * stickFreeFactor;
  return { effectiveElevatorEffectiveness, stickFreeControlDerivativePerRad, authorityRetainedPercent: 100 * stickFreeFactor, authorityLostPercent: 100 * (1 - stickFreeFactor) };
}
