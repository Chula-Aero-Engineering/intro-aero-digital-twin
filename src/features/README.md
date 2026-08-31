# Analysis features

Each feature connects physics functions to shared aircraft state and returns structured analysis data. A typical addition requires only three new files:

1. `src/physics/yourModel.js` — pure calculations;
2. `src/features/your-model.feature.js` — data-only results, verification status, interpretation, and metadata;
3. `tests/yourModel.test.js` — numerical, behavioral, and boundary checks.

The `analyze` function receives the current shared `aircraft` object. Do not create a second copy of aircraft state inside a feature.

Every `*.feature.js` file exports metadata and an `analyze` function:

```javascript
export const feature = {
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

`src/features/index.js` discovers the file automatically, and `FeatureCard.jsx` formats it. Students do not write JSX or CSS and do not edit the renderer, registry, or `App.jsx`.
