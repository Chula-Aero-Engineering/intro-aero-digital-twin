# Architecture

The application has one shared aircraft state in `App.jsx`, initialized from `src/data/aircraft.js`. The parameter panel updates that state, and every registered feature receives the same current aircraft object. There is no parallel copy of the design state.

```text
src/data/aircraft.js
        ↓ initializes
     App.jsx ─────────→ AircraftOverview + ParameterPanel
        │
        └── current aircraft state
                   ↓
          automatic *.feature.js discovery
                   ↓
             FeatureCard
                   ↓
          structured analysis data
                   ↓ fixed renderer
          results + verification + decision
                   ↓ calls
           src/physics/*.js
                   ↑
             tests/*.test.js
```

## Boundaries

- `src/data` defines readable starter data and input metadata.
- `src/physics` contains pure SI-unit calculations with no React or browser dependencies.
- `src/features` contains data-only definitions that call physics functions and return results, verification outcomes, and engineering interpretations.
- `src/components` contains reusable interface patterns, not aerospace equations.
- `tests` verifies physics functions directly.
- `templates` scaffolds engineering thinking and bounded AI requests.
- `examples` contains complete teaching references that are not automatically active in the starter app.

## Adding a feature

A feature creates one physics file, one data-only `*.feature.js` definition, and one test file. `src/features/index.js` uses Vite's built-in discovery, so students do not edit the registry or `App.jsx`. The definition receives `aircraft` and returns a fixed result schema.

`FeatureCard.jsx` is instructor-owned. It validates the returned schema and renders every result, unit, verification case, decision, error state, and responsive layout consistently. Generated feature files contain no React, JSX, HTML, or CSS.
