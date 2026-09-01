# Intro Aero AI-Assisted Engineering Tool

A reusable Vite + React + JavaScript starter for an Introduction to Aerospace Engineering course. One persistent 3D aircraft gains small, verified analysis and visualization modules as students learn new physics. The purpose is engineering specification and verification—not web-development instruction and not asking AI to build an entire application.

> **AI-generated code is an implementation candidate, not engineering evidence.** Students select and understand the physics, predict behavior, define verification cases, inspect the implementation, and make the engineering decision.

```text
UNDERSTAND
   ↓
SPECIFY
   ↓
VERIFY EXPECTED BEHAVIOR
   ↓
ASK AI TO IMPLEMENT
   ↓
ADD GENERATED FILES
   ↓
RUN + TEST
   ↓
ENGINEERING DECISION
```

## Start

Requires a current Node.js installation.

```bash
npm install
npm run dev
```

Open the local address printed in the terminal. Run all automated checks with:

```bash
npm test
```

Create a production build with `npm run build`.

## Repository map

- `src/core` — instructor-owned application shell, aircraft state, rendering, styling, discovery, and demonstrations.
- `assets/blender/course-aircraft.blend` — editable low-poly semester aircraft source; `public/models` contains its browser-ready GLB export.
- `src/student/physics` — student-owned pure JavaScript engineering calculations using SI units.
- `src/student/features` — student-owned data-only analyses discovered and formatted automatically.
- `src/student/models` — reserved for future student assumption and derivation modules.
- `tests/core` and `tests/student` — instructor and student verification, kept separate.
- `student-work/specs` — completed student specifications.
- `templates` — feature specification, ChatGPT request, verification record, and checklist.
- `examples/lift-example` — one complete, deliberately simple lift workflow reference.
- `docs` — student, instructor, architecture, AI workflow, and troubleshooting guides.

## Add one bounded feature

1. Complete [`templates/FEATURE-SPEC.md`](templates/FEATURE-SPEC.md), including a manual calculation and tests defined before implementation. The file already contains the fixed application contract ChatGPT needs.
2. Attach that one completed file to ordinary ChatGPT and say: “Generate the feature described in this completed specification.”
3. Manually save the three complete new files ChatGPT returns.
4. Run `npm test` and `npm run dev`.
5. Compare the result with the manual calculation, test expected behavior, locate the equation in code, and use the result to answer the original engineering question.

The application automatically discovers every `src/student/features/*.feature.js` file and renders it through the shared module workspace. Version 2 features may provide numeric plot points and simple point/arrow overlays; the core owns Three.js, SVG plotting, JSX, CSS, and responsive behavior. Existing Version 1 features remain compatible. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`examples/lift-example`](examples/lift-example).

Instructor changes use a clean `core/<lesson-slug>` branch and are checked with `npm run verify:core-boundary -- --base main`. Repository rules in [`AGENTS.md`](AGENTS.md) tell Codex to preserve student work automatically.

## Teaching guides

- [`Student guide`](docs/STUDENT-GUIDE.md) — the recurring understand-to-decision workflow.
- [`Instructor guide`](docs/INSTRUCTOR-GUIDE.md) — three levels of progressive scaffolding.
- [`AI workflow`](docs/AI-WORKFLOW.md) — appropriate and inappropriate uses of AI.
- [`Troubleshooting`](docs/TROUBLESHOOTING.md) — evidence-based recovery prompts.
- [`Laptop and iPad workflows`](docs/DEVICE-WORKFLOWS.md) — local VS Code, Codespaces, and Pages fallback.
- [`3D aircraft asset`](docs/3D-AIRCRAFT.md) — Blender source, named parts, performance intent, and rebuild process.
- [`Stability unit dry run`](docs/STABILITY-UNIT-RUNBOOK.md) — five planned student modules and the recurring classroom sequence.
- [`Stability student briefs`](examples/stability-unit/README.md) — engineering questions and bounded file sets without implemented solutions.
- [`Stability lecture deck`](docs/slides/stability-from-physics-to-feature.pptx) — physics-to-feature classroom slides.

This is intentionally not a complete aerospace analysis package. Atmosphere, drag, performance, stability, control, and structures remain future student features.
