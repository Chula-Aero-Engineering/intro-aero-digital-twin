import {
  calculateDeltaCm,
  degreesToRadians,
  evaluateStaticRestoringMoment,
  evaluateStaticRestoringMomentFromAlphaRad,
} from "../physics/static-restoring-moment.js";

const close = (actual, expected, tolerance = 1e-9) => Math.abs(actual - expected) <= tolerance;

function verificationCases() {
  const reference = evaluateStaticRestoringMoment({
    densityKgM3: 1.225,
    speedMps: 10,
    wingAreaM2: 0.5,
    meanChordM: 0.32,
    cmAlphaPerRad: -0.8,
    disturbanceAlphaDeg: 2,
  });
  const doubledDisturbance = evaluateStaticRestoringMoment({
    densityKgM3: 1.225,
    speedMps: 10,
    wingAreaM2: 0.5,
    meanChordM: 0.32,
    cmAlphaPerRad: -0.8,
    disturbanceAlphaDeg: 4,
  });
  const zeroDisturbance = evaluateStaticRestoringMoment({
    densityKgM3: 1.225,
    speedMps: 10,
    wingAreaM2: 0.5,
    meanChordM: 0.32,
    cmAlphaPerRad: -0.8,
    disturbanceAlphaDeg: 0,
  });
  return [
    {
      label: "Reference case gives q = 61.25 Pa, ΔCm = -0.02793, and body My = -0.27367 N·m",
      passed: close(reference.dynamicPressurePa, 61.25)
        && close(reference.deltaCm, -0.8 * 2 * Math.PI / 180)
        && close(reference.bodyPitchMomentNm, -0.273667627),
    },
    {
      label: "Doubling the disturbance doubles the restoring moment",
      passed: close(doubledDisturbance.bodyPitchMomentNm, 2 * reference.bodyPitchMomentNm),
    },
    {
      label: "Negative Cmα opposes a nonzero angle-of-attack disturbance",
      passed: reference.staticTendency === "restoring",
    },
    {
      label: "Zero disturbance gives exactly zero moment",
      passed: Object.is(zeroDisturbance.bodyPitchMomentNm, 0) && zeroDisturbance.staticTendency === "neutral",
    },
  ];
}

function createCmPlot(cmAlphaPerRad) {
  const points = Array.from({ length: 11 }, (_, index) => -5 + index).map((alphaDeg) => ({
    x: alphaDeg,
    y: calculateDeltaCm(cmAlphaPerRad, degreesToRadians(alphaDeg)),
  }));
  return {
    id: "static-restoring-cm",
    title: "Pitching-moment change from an angle-of-attack disturbance",
    xLabel: "Angle-of-attack disturbance, Δα (deg)",
    yLabel: "Pitching-moment coefficient change, ΔCm",
    series: [{ label: "ΔCm = Cmα Δα", points }],
    regions: [],
    referenceLines: [
      { axis: "x", value: 0, label: "No disturbance" },
      { axis: "y", value: 0, label: "No moment change" },
    ],
  };
}

export const feature = {
  contractVersion: 4,
  id: "static-restoring-moment",
  title: "Static restoring tendency",
  description: "Relates a small angle-of-attack disturbance and Cmα to the resulting aerodynamic pitch-moment tendency.",
  category: "Stability · Student feature",
  learningMode: "concept",
  topicId: "stability",
  inputKeys: ["densityKgM3", "speedMps", "wingAreaM2", "meanChordM", "cmAlphaPerRad", "disturbanceAlphaDeg"],
  requiresCapabilities: [{ id: "loads.pitch.external-moment", version: 1 }],
  providesCapabilities: [{ id: "aero.pitch.static-restoring", version: 1 }],
  assumptions: [
    "Cmα is constant over the small disturbance range.",
    "The supplied flight condition and reference geometry remain fixed.",
    "The aerodynamic coefficient and body-axis moment both use the standard positive-nose-up sign.",
    "The reduced-order response approximates the angle-of-attack perturbation by the pitch-angle perturbation.",
  ],
  validityLimits: [
    "The linear relationship is not reliable for large disturbances or separated flow.",
    "The restoring simulation contains no damping, so a restoring case oscillates rather than settling.",
    "The initial ramp to the selected disturbance is prescribed for visualization; only the response after release is physics-driven.",
    "A restoring tendency alone does not establish acceptable handling qualities or flight safety.",
  ],
  simulation: {
    display: "response",
    durationS: 0.7,
    initialState: { pitchRad: 0, pitchRateRadS: 0 },
    controls: {},
    disturbance: {
      externalForceScale: 0,
      pitchRamp: {
        targetDegAircraftKey: "disturbanceAlphaDeg",
        durationS: 0.3,
        label: "Disturbance released",
      },
    },
    plotStateKeys: ["pitchRad"],
  },

  analyze(aircraft) {
    const result = evaluateStaticRestoringMoment(aircraft);
    const conventionalMomentNm = result.bodyPitchMomentNm;
    return {
      results: [
        { label: "Dynamic pressure", value: result.dynamicPressurePa, unit: "Pa", precision: 2 },
        { label: "Disturbance", value: result.disturbanceAlphaRad, unit: "rad", precision: 4 },
        { label: "Pitch-moment coefficient change", value: result.deltaCm, unit: "", precision: 4 },
        { label: "Aerodynamic moment (conventional sign)", value: conventionalMomentNm, unit: "N·m", precision: 3 },
        { label: "Body-axis pitch moment", value: result.bodyPitchMomentNm, unit: "N·m", precision: 3, emphasis: true, note: "Positive body +My is nose-up in the standard aircraft frame." },
        { label: "Static tendency", value: result.staticTendency, unit: "" },
      ],
      verificationCases: verificationCases(),
      decision: {
        question: "Does the modeled aerodynamic moment oppose the selected angle-of-attack disturbance?",
        interpretation: result.staticTendency === "restoring"
          ? "The modeled moment opposes the selected disturbance, which is evidence of a static restoring tendency within the linear model. It does not predict the time response."
          : result.staticTendency === "destabilizing"
            ? "The modeled moment reinforces the selected disturbance, indicating a destabilizing static tendency within the linear model."
            : "The selected condition produces no modeled restoring slope or no disturbance; the result is neutral in this calculation.",
        status: result.staticTendency === "restoring" ? "pass" : result.staticTendency === "destabilizing" ? "caution" : "neutral",
      },
      plots: [createCmPlot(aircraft.cmAlphaPerRad)],
      scene: null,
    };
  },
};

export const model = {
  kind: "load",
  evaluate({ aircraft, state }) {
    // The single-degree-of-freedom teaching model approximates the current
    // angle-of-attack disturbance by the current positive-nose-up pitch angle.
    const result = evaluateStaticRestoringMomentFromAlphaRad({
      ...aircraft,
      disturbanceAlphaRad: state.pitchRad ?? 0,
    });
    const selectedDisturbance = evaluateStaticRestoringMoment(aircraft);
    return {
      momentsBodyNm: { x: 0, y: result.bodyPitchMomentNm, z: 0 },
      values: {
        ...result,
        selectedDisturbanceAlphaRad: selectedDisturbance.disturbanceAlphaRad,
        selectedDeltaCm: selectedDisturbance.deltaCm,
        selectedBodyPitchMomentNm: selectedDisturbance.bodyPitchMomentNm,
        selectedStaticTendency: selectedDisturbance.staticTendency,
      },
    };
  },
};
