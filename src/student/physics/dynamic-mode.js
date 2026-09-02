function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

export function calculateDynamicMode({ dutchRollRealPartPerS, dutchRollImagPartRadS }) {
  finite("dutchRollRealPartPerS", dutchRollRealPartPerS); finite("dutchRollImagPartRadS", dutchRollImagPartRadS);
  const naturalFrequencyRadS = Math.hypot(dutchRollRealPartPerS, dutchRollImagPartRadS);
  const dampingRatio = naturalFrequencyRadS === 0 ? 0 : -dutchRollRealPartPerS / naturalFrequencyRadS;
  const periodS = dutchRollImagPartRadS === 0 ? null : 2 * Math.PI / Math.abs(dutchRollImagPartRadS);
  const timeToHalfOrDoubleS = dutchRollRealPartPerS === 0 ? null : Math.log(2) / Math.abs(dutchRollRealPartPerS);
  return { naturalFrequencyRadS, dampingRatio, periodS, timeToHalfOrDoubleS, behavior: dutchRollRealPartPerS < 0 ? "decaying" : dutchRollRealPartPerS > 0 ? "growing" : "neutral" };
}

export function sampleDynamicMode({ sigmaPerS, omegaDRadS, initialAmplitude, durationS, samples = 41 }) {
  [sigmaPerS, omegaDRadS, initialAmplitude, durationS].forEach((v, i) => finite(["sigmaPerS", "omegaDRadS", "initialAmplitude", "durationS"][i], v));
  if (durationS < 0 || samples < 2) throw new RangeError("Duration and sample count are invalid.");
  return Array.from({ length: samples }, (_, index) => {
    const timeS = durationS * index / (samples - 1);
    return { timeS, value: initialAmplitude * Math.exp(sigmaPerS * timeS) * Math.cos(omegaDRadS * timeS) };
  });
}
