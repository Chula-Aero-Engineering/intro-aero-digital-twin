// Teaching reference. ChatGPT should use ../physics/lift.js in the active app.
import { calculateLift, calculateRequiredCl, calculateWeight } from "./lift.js";

const referenceInputs = {
  densityKgM3: 1.225,
  speedMps: 10,
  wingAreaM2: 0.5,
  cl: 0.8,
};

function approximatelyEqual(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

export const feature = {
  id: "lift",
  title: "Lift analysis",
  description: "Compare modeled lift with aircraft weight at the current flight condition.",

  analyze(aircraft) {
    const inputs = {
      densityKgM3: aircraft.densityKgM3,
      speedMps: aircraft.speedMps,
      wingAreaM2: aircraft.wingAreaM2,
      cl: aircraft.cl,
    };
    const totalMassKg = aircraft.massKg + aircraft.payloadKg;
    const liftN = calculateLift(inputs);
    const weightN = calculateWeight(totalMassKg);
    const requiredCl = calculateRequiredCl({ ...inputs, totalMassKg });
    const sufficient = liftN >= weightN;
    const referenceLift = calculateLift(referenceInputs);

    return {
      results: [
        { label: "Lift available", value: liftN, unit: "N", precision: 2, emphasis: true },
        { label: "Aircraft weight", value: weightN, unit: "N", precision: 2 },
        { label: "Required lift coefficient", value: requiredCl, unit: "", precision: 3 },
        { label: "Supplied lift coefficient", value: aircraft.cl, unit: "", precision: 3 },
      ],
      verificationCases: [
        { label: "Reference case produces 24.5 N", passed: approximatelyEqual(referenceLift, 24.5) },
        { label: "CL = 0 produces zero lift", passed: calculateLift({ ...referenceInputs, cl: 0 }) === 0 },
        { label: "Doubling area doubles lift", passed: approximatelyEqual(calculateLift({ ...referenceInputs, wingAreaM2: 1 }), 2 * referenceLift) },
        { label: "Doubling speed quadruples lift", passed: approximatelyEqual(calculateLift({ ...referenceInputs, speedMps: 20 }), 4 * referenceLift) },
      ],
      decision: {
        question: "Can the current wing produce enough lift at this condition?",
        interpretation: sufficient
          ? `Available lift exceeds the ${weightN.toFixed(2)} N required at this modeled condition.`
          : `Available lift is below the ${weightN.toFixed(2)} N required at this modeled condition.`,
        status: sufficient ? "pass" : "caution",
      },
    };
  },
};
