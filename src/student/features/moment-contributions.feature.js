import { evaluateMomentContributions } from "../physics/moment-contributions.js";

const close = (actual, expected, tolerance = 1e-9) => Math.abs(actual - expected) <= tolerance;

function capabilityMoment(capabilityContext, capabilityId, valueKey) {
  const result = capabilityContext?.[capabilityId];
  const value = result?.values?.[valueKey] ?? result?.momentsBodyNm?.y;
  if (!Number.isFinite(value)) throw new TypeError(`${capabilityId} did not provide a finite pitch moment.`);
  return value;
}

function referenceResult() {
  return evaluateMomentContributions({
    wingLiftN: 14,
    wingForceXM: 0.1,
    tailForceN: 1.2,
    tailPositionM: -0.48,
    thrustN: 4,
    thrustLineZM: -0.02,
    cgM: 0.12,
    externalPitchMomentNm: 0.66,
    staticRestoringBodyMomentNm: -0.273667627,
  });
}

function verificationCases() {
  const reference = referenceResult();
  const zeroArms = evaluateMomentContributions({
    wingLiftN: 14,
    wingForceXM: 0.12,
    tailForceN: 1.2,
    tailPositionM: 0.12,
    thrustN: 4,
    thrustLineZM: 0,
    cgM: 0.12,
    externalPitchMomentNm: 0,
    staticRestoringBodyMomentNm: 0,
  });
  return [
    {
      label: "Reference component moments assemble to -0.69367 N·m",
      passed: close(reference.wingPitchMomentNm, -0.28)
        && close(reference.tailPitchMomentNm, -0.72)
        && close(reference.thrustPitchMomentNm, -0.08)
        && close(reference.netPitchMomentNm, -0.693667627),
    },
    {
      label: "The net equals the sum of every displayed component",
      passed: close(reference.netPitchMomentNm,
        reference.externalPitchMomentNm + reference.staticRestoringBodyMomentNm
        + reference.wingPitchMomentNm + reference.tailPitchMomentNm + reference.thrustPitchMomentNm),
    },
    {
      label: "Forces acting through the CG and thrust on the CG line add zero moment",
      passed: Object.is(zeroArms.netPitchMomentNm, 0),
    },
  ];
}

export const feature = {
  contractVersion: 4,
  id: "moment-contributions",
  title: "Longitudinal moment contributions",
  description: "Assembles wing, tail, thrust, external, and restoring pitch-moment contributions about the shared CG.",
  category: "Stability · Student feature",
  learningMode: "aircraft",
  topicId: "stability",
  inputKeys: ["wingLiftN", "wingForceXM", "tailForceN", "tailPositionM", "thrustN", "thrustLineZM", "cgM"],
  requiresCapabilities: [
    { id: "loads.pitch.external-moment", version: 1 },
    { id: "aero.pitch.static-restoring", version: 1 },
  ],
  providesCapabilities: [{ id: "loads.pitch.component-sum", version: 1 }],
  assumptions: [
    "Wing and tail forces are signed vertical point forces acting at their supplied x-locations; positive force is upward, opposite body +z.",
    "Thrust acts forward along +x at the supplied vertical offset.",
    "Earlier external and restoring moments are consumed through the capability context.",
  ],
  validityLimits: [
    "Distributed loads must be represented by equivalent resultant forces and moments.",
    "The calculation is a rigid-body pitch-moment balance, not a structural-load model.",
    "A nonzero net moment indicates instantaneous pitch tendency, not static or dynamic stability by itself.",
  ],
  simulation: { durationS: 1, initialState: { pitchRad: 0, pitchRateRadS: 0 }, controls: {}, disturbance: {} },

  analyze(aircraft, capabilityContext) {
    const externalPitchMomentNm = capabilityMoment(capabilityContext, "loads.pitch.external-moment", "pitchMomentNm");
    const staticRestoringBodyMomentNm = capabilityMoment(capabilityContext, "aero.pitch.static-restoring", "selectedBodyPitchMomentNm");
    const result = evaluateMomentContributions({ ...aircraft, externalPitchMomentNm, staticRestoringBodyMomentNm });
    const rows = [
      ["External-force contribution", result.externalPitchMomentNm],
      ["Static-restoring contribution at selected disturbance", result.staticRestoringBodyMomentNm],
      ["Wing contribution", result.wingPitchMomentNm],
      ["Tail contribution", result.tailPitchMomentNm],
      ["Thrust contribution", result.thrustPitchMomentNm],
    ];
    return {
      results: [
        ...rows.map(([label, value]) => ({ label, value, unit: "N·m", precision: 3 })),
        { label: "Net pitch moment", value: result.netPitchMomentNm, unit: "N·m", precision: 3, emphasis: true },
        { label: "Net pitch tendency", value: result.pitchTendency, unit: "" },
      ],
      verificationCases: verificationCases(),
      decision: {
        question: "Which supplied load contributions control the net pitching moment about the CG?",
        interpretation: `At the selected disturbance, the modeled contributions sum to ${result.netPitchMomentNm.toFixed(3)} N·m, giving a ${result.pitchTendency} tendency in the repository body frame. This static moment balance does not establish trim or dynamic stability.`,
        status: "neutral",
      },
      plots: [{
        id: "pitch-moment-contributions",
        title: "Pitch-moment contribution assembly",
        xLabel: "Component index",
        yLabel: "Body-axis pitch moment (N·m)",
        series: [{ label: "Component moment", points: rows.map(([, value], index) => ({ x: index + 1, y: value })) }],
        regions: [],
        referenceLines: [{ axis: "y", value: 0, label: "Zero pitch moment" }],
      }],
      scene: null,
    };
  },
};

export const model = {
  kind: "load",
  evaluate(runtimeContext) {
    const { aircraft } = runtimeContext;
    const externalPitchMomentNm = capabilityMoment(
      runtimeContext.capabilities,
      "loads.pitch.external-moment",
      "pitchMomentNm",
    );
    const staticRestoringBodyMomentNm = capabilityMoment(
      runtimeContext.capabilities,
      "aero.pitch.static-restoring",
      "bodyPitchMomentNm",
    );
    const result = evaluateMomentContributions({
      ...aircraft,
      externalPitchMomentNm,
      staticRestoringBodyMomentNm,
    });
    return {
      forcesBodyN: { x: aircraft.thrustN, y: 0, z: -(aircraft.wingLiftN + aircraft.tailForceN) },
      momentsBodyNm: { x: 0, y: result.addedPitchMomentNm, z: 0 },
      values: result,
    };
  },
};
