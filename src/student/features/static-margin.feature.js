import { calculateStaticMargin } from "../physics/static-margin.js";

const verify = () => {
  const a = calculateStaticMargin({ cgM: 0.12, neutralPointM: 0.16, meanChordM: 0.32 });
  const b = calculateStaticMargin({ cgM: 0.16, neutralPointM: 0.16, meanChordM: 0.32 });
  return [{ label: "Reference static margin is 12.5% MAC", passed: Math.abs(a.staticMargin - 0.125) < 1e-12 }, { label: "CG at the neutral point gives zero static margin", passed: Object.is(b.staticMargin, 0) }];
};
const requireStage4 = (capabilities) => { if (!capabilities?.["stability.pitch.cm-alpha"]) throw new TypeError("Stage 4 trim-response capability is required."); };

export const feature = {
  contractVersion: 4, id: "static-margin", title: "Longitudinal static margin", description: "Relates center-of-gravity location to the neutral point and mean aerodynamic chord.", category: "Stability · Student feature", learningMode: "aircraft", topicId: "stability",
  inputKeys: ["cgM", "neutralPointM", "meanChordM"],
  requiresCapabilities: [{ id: "stability.pitch.cm-alpha", version: 1 }], providesCapabilities: [{ id: "stability.longitudinal.static-margin", version: 1 }],
  assumptions: ["The supplied neutral point and mean aerodynamic chord represent the modeled flight condition."],
  validityLimits: ["Positive static margin indicates a restoring tendency in this linear model; it does not establish acceptable handling qualities or safety."],
  simulation: { display: "analysis-only", durationS: 1, initialState: {}, controls: {}, disturbance: {} },
  analyze(aircraft, capabilities) {
    requireStage4(capabilities);
    const r = calculateStaticMargin(aircraft);
    const points = Array.from({ length: 11 }, (_, i) => { const cgM = aircraft.neutralPointM + aircraft.meanChordM * (i - 5) / 20; return { x: cgM, y: calculateStaticMargin({ ...aircraft, cgM }).staticMarginPercent }; });
    return { results: [{ label: "CG to neutral point", value: r.cgToNeutralPointM, unit: "m", precision: 3 }, { label: "Static margin", value: r.staticMarginPercent, unit: "% MAC", precision: 2, emphasis: true }, { label: "Classification", value: r.tendency, unit: "" }], verificationCases: verify(), decision: { question: "What longitudinal static margin is implied by this CG?", interpretation: `The CG is ${r.staticMarginPercent.toFixed(2)}% MAC ahead of the neutral point; this is ${r.tendency}.`, status: r.staticMargin > 0 ? "pass" : "caution" }, plots: [{ id: "static-margin-vs-cg", title: "Static margin versus CG", xLabel: "CG x-location (m)", yLabel: "Static margin (% MAC)", series: [{ label: "Static margin", points }], regions: [], referenceLines: [{ axis: "x", value: aircraft.neutralPointM, label: "Neutral point" }, { axis: "y", value: 0, label: "Neutral" }] }], scene: { caption: "CG and neutral-point locations on the aircraft x-axis.", overlays: [{ type: "point", position: { x: aircraft.cgM, y: 0, z: 0 }, label: "CG" }, { type: "point", position: { x: aircraft.neutralPointM, y: 0, z: 0 }, label: "Neutral point" }] } };
  },
};
export const model = { kind: "derived", evaluate: ({ aircraft }) => ({ values: calculateStaticMargin(aircraft) }) };
