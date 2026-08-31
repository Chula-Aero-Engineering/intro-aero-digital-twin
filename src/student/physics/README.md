# Student physics modules

Keep engineering calculations here as small, pure JavaScript functions.

A physics module must:

- have no React or browser imports;
- use SI units internally;
- state input units, output units, and important assumptions in concise comments;
- reject obviously invalid inputs when that improves clarity;
- export functions that can be tested without starting the application.

Preferred pattern:

```javascript
// Inputs: speed in m/s and area in m². Output: a result in SI units.
export function calculateSomething({ speedMps, areaM2 }) {
  if (!Number.isFinite(speedMps) || speedMps < 0) {
    throw new RangeError("Speed must be a non-negative number.");
  }

  return /* governing engineering equation */;
}
```

Physics modules calculate. Data-only feature definitions interpret the results, and the instructor-owned core displays them.
