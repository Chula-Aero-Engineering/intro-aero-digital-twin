# Student analysis features

Each feature connects physics functions to shared aircraft state and returns structured analysis data. A typical addition requires only three new files:

1. `src/student/physics/your-model.js` — pure calculations;
2. `src/student/features/your-model.feature.js` — data-only results, verification status, interpretation, and metadata;
3. `tests/student/your-model.test.js` — numerical, behavioral, and boundary checks.

The `analyze` function receives the current shared `aircraft` object. Do not create a second copy of aircraft state inside a feature.

Every `*.feature.js` file exports metadata and an `analyze` function:

```javascript
export const feature = {
  contractVersion: 1,
  id: "your-analysis",
  title: "Your analysis",
  description: "What engineering question it helps answer.",
  analyze(aircraft) {
    return {
      results: [],
      verificationCases: [],
      decision: {},
    };
  },
};
```

`src/core/features/index.js` discovers the file automatically, and the core renderer formats it. Students do not write JSX or CSS and do not edit the renderer, registry, or `App.jsx`. Existing features without `contractVersion` remain compatible as legacy Version 1 features.
