# Architecture

The instructor-owned application has one shared aircraft state in `src/core/App.jsx`, initialized from `src/core/data/aircraft.js`. The parameter panel updates that state, and every discovered feature receives the same current aircraft object. There is no parallel copy of the design state.

```text
src/core/data/aircraft.js
        ↓ initializes
 src/core/App.jsx ────→ AircraftOverview + ParameterPanel
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
      src/student/physics/*.js
                   ↑
       tests/student/*.test.js
```

## Boundaries

- `src/core` is instructor-owned and contains the shell, state, renderer, styling, discovery, and demonstrations.
- `src/student/physics` contains student-owned pure SI-unit calculations with no React or browser dependencies.
- `src/student/features` contains student-owned data-only definitions that call physics functions and return results, verification outcomes, and interpretations.
- `src/student/models` is reserved for future student-authored assumption and derivation modules.
- `tests/core` verifies the shell and contracts; `tests/student` verifies student physics directly.
- `student-work/specs` stores completed student specifications.
- `templates` scaffolds engineering thinking and bounded AI requests.
- `examples` contains complete teaching references that are not automatically active in the starter app.

## Adding a feature

A feature creates one physics file, one data-only `*.feature.js` definition, and one test file. `src/core/features/index.js` uses Vite's built-in discovery, so students do not edit the registry or `App.jsx`. The definition receives `aircraft` and returns the Version 1 result schema.

`src/core/features/FeatureCard.jsx` is instructor-owned. It validates the returned schema and renders every result, unit, verification case, decision, error state, and responsive layout consistently. A missing `contractVersion` is interpreted as legacy Version 1, so older generated features continue to work. Generated feature files contain no React, JSX, HTML, or CSS.

## Ownership enforcement

`AGENTS.md` supplies repository-scoped Codex instructions. `.course/ownership.json` is the machine-readable boundary used by the local checker and GitHub Actions. On a `core/*` update, `npm run verify:core-boundary -- --base main` examines committed, staged, unstaged, deleted, renamed, and untracked paths and fails if student work changed. It only reports violations; it never restores or modifies files.
