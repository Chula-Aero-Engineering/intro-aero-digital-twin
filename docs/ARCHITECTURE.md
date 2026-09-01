# Architecture

The instructor-owned application has one shared aircraft state in `src/core/App.jsx`, initialized from `src/core/data/aircraft.js`. The parameter panel updates that state, and every discovered feature receives the same current aircraft object. There is no parallel copy of the design state.

```text
src/core/data/aircraft.js
        ↓ initializes
 src/core/App.jsx ────→ focused ParameterPanel
        │
        └── current aircraft state
                   ↓
          automatic *.feature.js discovery
                   ↓
          ModuleWorkspace
          ├── AircraftViewport (Three.js)
          ├── EngineeringPlot (SVG)
          └── FeatureCard
                   ↓
          structured analysis data
                   ↓ fixed renderer
 results + verification + decision + plot/overlay data
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

A feature creates one physics file, one data-only `*.feature.js` definition, and one test file. `src/core/features/index.js` uses Vite's built-in discovery, so students do not edit the registry or `App.jsx`. Version 2 modules may also return plot series and simple point/arrow overlays. They still contain no rendering code.

`src/core/features/FeatureCard.jsx` and the visualization components are instructor-owned. They validate and render every result, unit, verification case, decision, plot, overlay, error state, and responsive layout consistently. A missing `contractVersion` is interpreted as legacy Version 1, so older generated features continue to work. The optimized Blender source lives at `assets/blender/course-aircraft.blend`; the app loads its 209 KB GLB export from `public/models`. Major parts retain separate names for later instructor visualization work. A procedural aircraft remains as an immediate-loading and asset-failure fallback.

## Ownership enforcement

`AGENTS.md` supplies repository-scoped Codex instructions. `.course/ownership.json` is the machine-readable boundary used by the local checker and GitHub Actions. On a `core/*` update, `npm run verify:core-boundary -- --base main` examines committed, staged, unstaged, deleted, renamed, and untracked paths and fails if student work changed. It only reports violations; it never restores or modifies files.
