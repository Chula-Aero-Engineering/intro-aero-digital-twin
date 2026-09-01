export const lessonCatalog = [
  {
    id: "foundations",
    shortTitle: "Foundations",
    title: "Aircraft foundations",
    description: "Existing introductory analyses remain available while the stability unit develops.",
    featureIds: [],
    parameterKeys: [
      "massKg", "payloadKg", "speedMps", "densityKgM3", "wingSpanM",
      "wingAreaM2", "meanChordM", "cl", "cgM", "neutralPointM",
    ],
  },
  {
    id: "disturbance-trim-response",
    shortTitle: "Trim + response",
    title: "1. Disturbance, trim, and response",
    description: "Connect a pitch disturbance to moment tendency and the meaning of a trimmed condition.",
    featureIds: ["trim-response"],
    parameterKeys: ["cm0", "cmAlphaPerRad", "angleOfAttackDeg", "disturbanceAlphaDeg"],
  },
  {
    id: "longitudinal-static-stability",
    shortTitle: "Static stability",
    title: "2. Longitudinal static stability",
    description: "Relate CG, neutral point, and mean chord to nondimensional static margin.",
    featureIds: ["static-margin"],
    parameterKeys: ["cgM", "neutralPointM", "meanChordM"],
  },
  {
    id: "cg-loading-limits",
    shortTitle: "CG + loading",
    title: "3. CG, static margin, and loading limits",
    description: "Calculate a loaded CG and compare it with an introductory loading envelope.",
    featureIds: ["cg-loading"],
    parameterKeys: [
      "massKg", "airframeCgM", "payloadKg", "payloadPositionM",
      "forwardCgLimitM", "aftCgLimitM", "neutralPointM", "meanChordM",
    ],
  },
  {
    id: "lateral-directional-dynamics",
    shortTitle: "Dynamic modes",
    title: "4. Lateral-directional and dynamic behavior",
    description: "Interpret a simplified oscillatory mode without treating damping as the only design objective.",
    featureIds: ["dynamic-mode"],
    parameterKeys: ["dutchRollRealPartPerS", "dutchRollImagPartRadS"],
  },
  {
    id: "mission-loading-decision",
    shortTitle: "Mission decision",
    title: "5. Mission-specific loading decision",
    description: "Compare the aircraft before and after a payload moves aft, then make a qualified mission decision.",
    featureIds: ["mission-loading"],
    parameterKeys: [
      "massKg", "airframeCgM", "payloadKg", "initialPayloadPositionM",
      "missionPayloadPositionM", "forwardCgLimitM", "aftCgLimitM",
      "neutralPointM", "meanChordM",
    ],
  },
];

export function featuresForLesson(features, lesson) {
  if (lesson.id === "foundations") {
    const assignedIds = new Set(lessonCatalog.flatMap((item) => item.featureIds));
    return features.filter((feature) => !assignedIds.has(feature.id));
  }

  const featureById = new Map(features.map((feature) => [feature.id, feature]));
  return lesson.featureIds.map((id) => featureById.get(id)).filter(Boolean);
}

export const foundationInputKeys = lessonCatalog[0].parameterKeys;

export const plannedFeatureSlots = lessonCatalog.slice(1).map((lesson) => ({
  id: lesson.featureIds[0],
  title: lesson.title.replace(/^\d+\.\s*/, ""),
  description: lesson.description,
  category: "Stability unit · Planned student module",
  inputKeys: lesson.parameterKeys,
  planned: true,
  learningMode: {
    "disturbance-trim-response": "concept",
    "longitudinal-static-stability": "concept",
    "cg-loading-limits": "design",
    "lateral-directional-dynamics": "concept",
    "mission-loading-decision": "design",
  }[lesson.id],
  topicId: "stability",
}));
