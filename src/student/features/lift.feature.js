import {
  calculateLift,
  calculateRequiredCl,
  calculateWeight,
} from "../physics/lift.js";

function approximatelyEqual(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function rejectsNegativePhysicalInput() {
  const invalidCalls = [
    () => calculateLift(-1.225, 10, 0.5, 0.8),
    () => calculateLift(1.225, -10, 0.5, 0.8),
    () => calculateLift(1.225, 10, -0.5, 0.8),
    () => calculateWeight(-1),
    () => calculateRequiredCl(-1, 1.225, 10, 0.5),
  ];

  return invalidCalls.every((call) => {
    try {
      call();
      return false;
    } catch {
      return true;
    }
  });
}

export const feature = {
  id: "lift",
  title: "Lift analysis",
  description:
    "Compare modeled lift with aircraft weight at the current flight condition.",

  analyze(aircraft) {
    const totalMassKg = aircraft.massKg + aircraft.payloadKg;

    const liftN = calculateLift(
      aircraft.densityKgM3,
      aircraft.speedMps,
      aircraft.wingAreaM2,
      aircraft.cl
    );

    const weightN = calculateWeight(totalMassKg);

    const requiredCl = calculateRequiredCl(
      totalMassKg,
      aircraft.densityKgM3,
      aircraft.speedMps,
      aircraft.wingAreaM2
    );

    const referenceLiftN = calculateLift(1.225, 10, 0.5, 0.8);
    const doubledAreaLiftN = calculateLift(1.225, 10, 1.0, 0.8);
    const doubledSpeedLiftN = calculateLift(1.225, 20, 0.5, 0.8);
    const zeroClLiftN = calculateLift(1.225, 10, 0.5, 0);

    const sufficient = liftN >= weightN;

    return {
      results: [
        {
          label: "Lift available",
          value: liftN,
          unit: "N",
          precision: 2,
          emphasis: true,
        },
        {
          label: "Aircraft weight",
          value: weightN,
          unit: "N",
          precision: 2,
        },
        {
          label: "Required lift coefficient",
          value: requiredCl,
          unit: "",
          precision: 3,
        },
        {
          label: "Supplied lift coefficient",
          value: aircraft.cl,
          unit: "",
          precision: 3,
        },
      ],
      verificationCases: [
        {
          label: "Reference case produces 24.5 N",
          passed: approximatelyEqual(referenceLiftN, 24.5),
        },
        {
          label: "Doubling wing area produces 49.0 N",
          passed: approximatelyEqual(doubledAreaLiftN, 49.0),
        },
        {
          label: "Doubling speed produces 98.0 N",
          passed: approximatelyEqual(doubledSpeedLiftN, 98.0),
        },
        {
          label: "CL = 0 produces 0 N",
          passed: approximatelyEqual(zeroClLiftN, 0),
        },
        {
          label: "Negative physical inputs are rejected",
          passed: rejectsNegativePhysicalInput(),
        },
      ],
      decision: {
        question: "Can the current wing produce enough lift at this condition?",
        interpretation: sufficient
          ? "At the supplied condition, modeled lift is sufficient to balance modeled aircraft weight. This introductory comparison does not establish aerodynamic margin, model validity, or airworthiness."
          : "At the supplied condition, modeled lift is insufficient to balance modeled aircraft weight. More speed, wing area, or lift coefficient may be required, subject to aerodynamic limits and validity of the supplied data.",
        status: sufficient ? "pass" : "caution",
      },
    };
  },
};
