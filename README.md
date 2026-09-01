# Intro Aero AI-Assisted Engineering Tool

A reusable Vite + React + JavaScript starter for an Introduction to Aerospace Engineering course. One persistent 3D aircraft gains small, verified analysis, force/moment, and reduced-order response capabilities as students learn new physics. Stability, control, lift, drag, performance, and future topics share the same aircraft and dependency-aware runtime. The purpose is engineering specification and verification—not web-development instruction and not asking AI to build an entire application.

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

## Course distribution

The canonical public repository is owned by the `Chula-Aero-Engineering` organization. Students fork it into their personal GitHub accounts, then work locally or in Codespaces. Forking preserves the upstream relationship required to receive instructor core updates throughout the semester. See [`docs/DEVICE-WORKFLOWS.md`](docs/DEVICE-WORKFLOWS.md) for first-time setup, syncing, iPad development, and Pages publishing.

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
2. Attach that one completed file to ordinary ChatGPT and ask it to show its Implementation Interpretation without generating code.
3. Check the interpreted physics, units, assumptions, behavior, and tests. Request corrections when needed, then reply `APPROVE ENGINEERING INTERPRETATION`.
4. Manually save the three complete new files ChatGPT returns after approval.
5. Run `npm test` and `npm run dev`.
6. Compare the result with the manual calculation, test expected behavior, locate the equation in code, and use the result to answer the original engineering question.

The application automatically discovers every `src/student/features/*.feature.js` file and renders it through the shared module workspace. Version 4 features may declare reusable capabilities and export a data-only `derived`, `load`, or `state-model` adapter. The core resolves prerequisites, integrates reduced-order states with fixed-step RK4, animates the aircraft, records histories, and produces print/JSON/CSV evidence. Existing Version 1–3 features remain compatible as analysis modules. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`examples/lift-example`](examples/lift-example).

Modules progress through three learning modes: **Concept** isolates mathematical behavior, **Aircraft** derives it from physical contributors, and **Design** evaluates requirements and feasible regions. Every mode uses the same one-specification, three-generated-file student workflow. See [`docs/THREE-MODE-TEACHING.md`](docs/THREE-MODE-TEACHING.md).

Instructor changes use a clean `core/<lesson-slug>` branch and are checked with `npm run verify:core-boundary -- --base main`. Repository rules in [`AGENTS.md`](AGENTS.md) tell Codex to preserve student work automatically.

## Teaching guides

- [`Student guide`](docs/STUDENT-GUIDE.md) — the recurring understand-to-decision workflow.
- [`Instructor guide`](docs/INSTRUCTOR-GUIDE.md) — three levels of progressive scaffolding.
- [`AI workflow`](docs/AI-WORKFLOW.md) — appropriate and inappropriate uses of AI.
- [`Troubleshooting`](docs/TROUBLESHOOTING.md) — evidence-based recovery prompts.
- [`Laptop and iPad workflows`](docs/DEVICE-WORKFLOWS.md) — local VS Code, Codespaces, and Pages fallback.
- [`3D aircraft asset`](docs/3D-AIRCRAFT.md) — Blender source, named parts, performance intent, and rebuild process.
- [`Stability unit dry run`](docs/STABILITY-UNIT-RUNBOOK.md) — the recurring classroom sequence for the cumulative stability topic.
- [`Private instructor workflow`](docs/PRIVATE-INSTRUCTOR-WORKFLOW.md) — solution-safe preparation and dry runs outside the public repository.
- [`Stability student briefs`](examples/stability-unit/README.md) — engineering questions and bounded file sets without implemented solutions.
- [`Stability lecture deck`](docs/slides/stability-from-physics-to-feature.pptx) — physics-to-feature classroom slides.

This is intentionally not a complete aerospace analysis package. Atmosphere, drag, performance, stability, control, and structures remain future student features.
