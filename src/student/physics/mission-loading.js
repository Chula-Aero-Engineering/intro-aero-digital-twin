function finite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

function loadedCg(massKg, airframeCgM, payloadKg, payloadPositionM) {
  return (massKg * airframeCgM + payloadKg * payloadPositionM) / (massKg + payloadKg);
}

export function evaluateMissionLoading(values) {
  Object.entries(values).forEach(([name, value]) => finite(name, value));
  const { massKg, airframeCgM, payloadKg, initialPayloadPositionM, missionPayloadPositionM, neutralPointM, meanChordM, forwardCgLimitM, aftCgLimitM, minimumStaticMargin } = values;
  if (massKg <= 0 || payloadKg < 0 || meanChordM <= 0 || forwardCgLimitM > aftCgLimitM) throw new RangeError("Mass, chord, or CG limits are invalid.");
  const initialLoadedCgM = loadedCg(massKg, airframeCgM, payloadKg, initialPayloadPositionM);
  const missionLoadedCgM = loadedCg(massKg, airframeCgM, payloadKg, missionPayloadPositionM);
  const initialStaticMargin = (neutralPointM - initialLoadedCgM) / meanChordM;
  const missionStaticMargin = (neutralPointM - missionLoadedCgM) / meanChordM;
  const initialWithinLimits = initialLoadedCgM >= forwardCgLimitM && initialLoadedCgM <= aftCgLimitM;
  const missionWithinLimits = missionLoadedCgM >= forwardCgLimitM && missionLoadedCgM <= aftCgLimitM;
  return { initialLoadedCgM, missionLoadedCgM, cgShiftM: missionLoadedCgM - initialLoadedCgM, initialStaticMargin, missionStaticMargin, initialWithinLimits, missionWithinLimits, initialRequirementMet: initialWithinLimits && initialStaticMargin >= minimumStaticMargin, missionRequirementMet: missionWithinLimits && missionStaticMargin >= minimumStaticMargin };
}
