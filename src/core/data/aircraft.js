export const initialAircraft = {
  massKg: 1.35,
  payloadKg: 0.25,
  speedMps: 10,
  densityKgM3: 1.225,
  wingSpanM: 1.6,
  wingAreaM2: 0.5,
  meanChordM: 0.32,
  cl: 0.8,
  cgM: 0.12,
  neutralPointM: 0.16,
};

export const parameterDefinitions = [
  { key: "massKg", label: "Aircraft mass", unit: "kg", min: 0, step: 0.05 },
  { key: "payloadKg", label: "Payload mass", unit: "kg", min: 0, step: 0.05 },
  { key: "speedMps", label: "Flight speed", unit: "m/s", min: 0, step: 0.5 },
  { key: "densityKgM3", label: "Air density", unit: "kg/m³", min: 0, step: 0.001 },
  { key: "wingSpanM", label: "Wingspan", unit: "m", min: 0, step: 0.05 },
  { key: "wingAreaM2", label: "Wing area", unit: "m²", min: 0, step: 0.01 },
  { key: "meanChordM", label: "Mean chord", unit: "m", min: 0, step: 0.01 },
  { key: "cl", label: "Lift coefficient", unit: "—", min: 0, step: 0.05 },
  { key: "cgM", label: "CG location", unit: "m", min: 0, step: 0.01 },
  { key: "neutralPointM", label: "Neutral-point location", unit: "m", min: 0, step: 0.01 },
];
