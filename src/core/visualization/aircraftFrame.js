function finiteVector(vector, label) {
  const value = { x: vector?.x ?? 0, y: vector?.y ?? 0, z: vector?.z ?? 0 };
  if (![value.x, value.y, value.z].every(Number.isFinite)) {
    throw new TypeError(`${label} must contain finite x, y, and z values.`);
  }
  return value;
}

// Course body frame: +x forward, +y right wing, +z down.
// Three.js scene geometry uses +z up, so polar-vector z is reflected.
export function bodyVectorToScene(vector) {
  const value = finiteVector(vector, "Body vector");
  return { x: value.x, y: value.y, z: -value.z };
}

// Angular velocity is an axial vector. Under the z reflection, roll and
// pitch change sign while yaw retains its sign.
export function bodyAttitudeToScene(attitude = {}) {
  const rollRad = attitude.rollRad ?? 0;
  const pitchRad = attitude.pitchRad ?? 0;
  const yawRad = attitude.yawRad ?? 0;
  if (![rollRad, pitchRad, yawRad].every(Number.isFinite)) {
    throw new TypeError("Body attitude must contain finite angles.");
  }
  return { rollRad: -rollRad, pitchRad: -pitchRad, yawRad };
}
