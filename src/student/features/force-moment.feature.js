import {
  calculateMomentArmM,
  calculatePitchMomentNm,
  calculatePitchAngularAccelerationRadS2,
  evaluateForceMoment,
} from "../physics/force-moment.js";

const approximatelyEqual = (actual, expected, tolerance = 1e-12) =>
  Math.abs(actual - expected) <= tolerance;

function runVerificationCases() {
  const reference = evaluateForceMoment({
    externalForceN: 2,
    externalForceXM: 0.45,
    cgM: 0.12,
    pitchInertiaKgM2: 0.12,
  });

  const forceScaling = evaluateForceMoment({
    externalForceN: 4,
    externalForceXM: 0.45,
    cgM: 0.12,
    pitchInertiaKgM2: 0.12,
  });

  const ahead = evaluateForceMoment({
    externalForceN: 2,
    externalForceXM: 0.45,
    cgM: 0.12,
    pitchInertiaKgM2: 0.12,
  });

  const behind = evaluateForceMoment({
    externalForceN: 2,
    externalForceXM: -0.21,
    cgM: 0.12,
    pitchInertiaKgM2: 0.12,
  });

  const atCg = evaluateForceMoment({
    externalForceN: 2,
    externalForceXM: 0.12,
    cgM: 0.12,
    pitchInertiaKgM2: 0.12,
  });

  let zeroInertiaRejected = false;
  try {
    evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: 0,
    });
  } catch {
    zeroInertiaRejected = true;
  }

  let negativeInertiaRejected = false;
  try {
    evaluateForceMoment({
      externalForceN: 2,
      externalForceXM: 0.45,
      cgM: 0.12,
      pitchInertiaKgM2: -0.12,
    });
  } catch {
    negativeInertiaRejected = true;
  }

  const requiredInputs = [
    "externalForceN",
    "externalForceXM",
    "cgM",
    "pitchInertiaKgM2",
  ];

  const nonFiniteValues = [NaN, Infinity, -Infinity];

  const nonFiniteInputsRejected = requiredInputs.every((key) =>
    nonFiniteValues.every((invalidValue) => {
      const inputs = {
        externalForceN: 2,
        externalForceXM: 0.45,
        cgM: 0.12,
        pitchInertiaKgM2: 0.12,
        [key]: invalidValue,
      };

      try {
        evaluateForceMoment(inputs);
        return false;
      } catch {
        return true;
      }
    })
  );

  return [
    {
      label: "Numerical reference case",
      passed:
        approximatelyEqual(reference.momentArmM, 0.33) &&
        approximatelyEqual(reference.pitchMomentNm, 0.66) &&
        approximatelyEqual(
          reference.pitchAngularAccelerationRadS2,
          5.5
        ),
    },
    {
      label: "Force-scaling behavior",
      passed:
        approximatelyEqual(forceScaling.pitchMomentNm, 1.32) &&
        approximatelyEqual(
          forceScaling.pitchAngularAccelerationRadS2,
          11
        ),
    },
    {
      label: "Application-point behavior",
      passed:
        approximatelyEqual(ahead.pitchMomentNm, 0.66) &&
        approximatelyEqual(behind.pitchMomentNm, -0.66),
    },
    {
      label: "Force applied at CG produces zero pitch response",
      passed:
        atCg.pitchMomentNm === 0 &&
        atCg.pitchAngularAccelerationRadS2 === 0,
    },
    {
      label: "Zero pitch inertia is rejected",
      passed: zeroInertiaRejected,
    },
    {
      label: "Negative pitch inertia is rejected",
      passed: negativeInertiaRejected,
    },
    {
      label: "Non-finite required inputs are rejected",
      passed: nonFiniteInputsRejected,
    },
  ];
}

function createPitchMomentPlot(externalForceN, cgM) {
  const points = Array.from({ length: 11 }, (_, index) => {
    const offsetM = -0.5 + index * 0.1;
    const forceXM = Number((cgM + offsetM).toFixed(12));

    const momentArmM = calculateMomentArmM(forceXM, cgM);
    const pitchMomentNm = calculatePitchMomentNm(
      momentArmM,
      externalForceN
    );

    return {
      x: forceXM,
      y: pitchMomentNm,
    };
  });

  return {
    id: "force-location-pitch-moment",
    title: "Pitch moment versus force application location",
    xLabel: "Force application location x_F (m)",
    yLabel: "Pitch moment M_y (N·m)",
    series: [
      {
        label: "External-force pitch moment",
        color: "#ff5a36",
        points,
      },
    ],
    regions: [],
    referenceLines: [
      {
        axis: "x",
        value: cgM,
        label: "CG",
      },
      {
        axis: "y",
        value: 0,
        label: "Zero pitch moment",
      },
    ],
  };
}

export const feature = {
  contractVersion: 4,
  id: "force-moment",
  title: "External force and pitch moment",
  description:
    "Calculates the pitch-moment and initial angular-acceleration contribution produced by one externally applied vertical force.",
  category: "Stability · Student feature",
  learningMode: "concept",
  topicId: "stability",

  inputKeys: [
    "externalForceN",
    "externalForceXM",
    "cgM",
    "pitchInertiaKgM2",
  ],

  requiresCapabilities: [],

  providesCapabilities: [
    {
      id: "loads.pitch.external-moment",
      version: 1,
    },
  ],

  assumptions: [
    "The aircraft is represented as a rigid body.",
    "The force is a concentrated vertical force applied on the aircraft x-axis.",
    "The CG and pitch inertia remain fixed during the calculation.",
    "Only the pitch effect of this one external force is modeled.",
    "The external force remains constant during the short illustrative simulation.",
  ],

  validityLimits: [
    "Distributed aerodynamic or structural loads require an equivalent resultant force and moment before using this model.",
    "Gravity, aerodynamic restoring moments, damping, thrust, and all other loads are omitted.",
    "Angular acceleration is an instantaneous contribution rather than a prediction of stable or realistic flight response.",
    "The constant-force simulation becomes unrepresentative when attitude changes become large.",
    "This feature cannot determine static stability, dynamic stability, handling qualities, or flight safety.",
  ],

  simulation: {
    durationS: 1,
    initialState: {
      pitchRad: 0,
      pitchRateRadS: 0,
    },
    controls: {},
    disturbance: {},
  },

  analyze(aircraft, capabilityContext) {
    const {
      externalForceN,
      externalForceXM,
      cgM,
      pitchInertiaKgM2,
    } = aircraft;

    const analysis = evaluateForceMoment({
      externalForceN,
      externalForceXM,
      cgM,
      pitchInertiaKgM2,
    });

    const forceDirection = Math.sign(externalForceN);
    const tendencyPhrase = analysis.pitchTendency === "zero pitch tendency"
      ? "zero pitch tendency"
      : `a ${analysis.pitchTendency} tendency`;

    const cgPosition = {
      x: cgM,
      y: 0,
      z: 0,
    };

    const forcePosition = {
      x: externalForceXM,
      y: 0,
      z: 0,
    };

    return {
      results: [
        {
          label: "Moment arm",
          value: analysis.momentArmM,
          unit: "m",
          precision: 2,
        },
        {
          label: "Pitch moment",
          value: analysis.pitchMomentNm,
          unit: "N·m",
          precision: 2,
          emphasis: true,
          note:
            "Positive is nose-up and negative is nose-down in the standard aircraft body frame.",
        },
        {
          label: "Initial pitch angular acceleration",
          value: analysis.pitchAngularAccelerationRadS2,
          unit: "rad/s²",
          precision: 2,
        },
        {
          label: "Pitch tendency",
          value: analysis.pitchTendency,
          unit: "",
        },
      ],

      verificationCases: runVerificationCases(),

      decision: {
        question:
          "What pitching moment about the aircraft center of gravity, and what initial pitch angular acceleration, are produced by one externally applied vertical force?",
        interpretation:
          `The selected external force contributes ${analysis.pitchMomentNm.toFixed(
            2
          )} N·m of pitch moment and ${analysis.pitchAngularAccelerationRadS2.toFixed(
            2
          )} rad/s² of initial pitch angular acceleration, corresponding to ${tendencyPhrase}. This is one load contribution only and does not establish aircraft stability, handling qualities, or flight safety.`,
        status: "neutral",
      },

      plots: [
        createPitchMomentPlot(externalForceN, cgM),
      ],

      scene: {
        caption:
          "CG, external-force application point, moment arm, and vertical force direction in the aircraft frame.",
        overlays: [
          {
            type: "marker",
            position: cgPosition,
            label: "CG",
          },
          {
            type: "marker",
            position: forcePosition,
            label: "External force application point",
          },
          {
            type: "moment-arm",
            start: cgPosition,
            end: forcePosition,
            label: "Moment arm",
          },
          {
            type: "arrow",
            origin: forcePosition,
            vector: {
              x: 0,
              y: 0,
              z: -0.2 * forceDirection,
            },
            label: "External force direction",
          },
        ],
      },
    };
  },
};

export const model = {
  kind: "load",

  evaluate(runtimeContext) {
    const {
      externalForceN,
      externalForceXM,
      cgM,
      pitchInertiaKgM2,
    } = runtimeContext.aircraft;

    const externalForceScale = runtimeContext.disturbance?.externalForceScale ?? 1;
    if (!Number.isFinite(externalForceScale)) {
      throw new TypeError("externalForceScale must be finite.");
    }
    const appliedExternalForceN = externalForceN * externalForceScale;
    const analysis = evaluateForceMoment({
      externalForceN: appliedExternalForceN,
      externalForceXM,
      cgM,
      pitchInertiaKgM2,
    });

    return {
      forcesBodyN: {
        x: 0,
        y: 0,
        z: -appliedExternalForceN,
      },

      momentsBodyNm: {
        x: 0,
        y: analysis.pitchMomentNm,
        z: 0,
      },

      values: {
        momentArmM: analysis.momentArmM,
        pitchMomentNm: analysis.pitchMomentNm,
        pitchAngularAccelerationRadS2:
          analysis.pitchAngularAccelerationRadS2,
      },
    };
  },
};
