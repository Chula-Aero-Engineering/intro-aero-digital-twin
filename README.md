# Intro Aero AI-Assisted Engineering Tool

A reusable Vite + React + JavaScript starter for an Introduction to Aerospace Engineering course. Students add small analysis features as they learn new physics. The purpose is engineering specification and verification—not web-development instruction and not asking AI to build an entire application.

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

- `src/data/aircraft.js` — initial shared aircraft state and parameter definitions.
- `src/physics` — pure JavaScript engineering calculations using SI units.
- `src/features` — data-only analysis definitions discovered and formatted automatically.
- `src/components` — reusable display patterns for inputs, verification, and decisions.
- `tests` — automated verification of active physics modules.
- `templates` — feature specification, ChatGPT request, verification record, and checklist.
- `examples/lift-example` — one complete, deliberately simple lift workflow reference.
- `docs` — student, instructor, architecture, AI workflow, and troubleshooting guides.

## Add one bounded feature

1. Complete [`templates/FEATURE-SPEC.md`](templates/FEATURE-SPEC.md), including a manual calculation and tests defined before implementation. The file already contains the fixed application contract ChatGPT needs.
2. Attach that one completed file to ordinary ChatGPT and say: “Generate the feature described in this completed specification.”
3. Manually save the three complete new files ChatGPT returns.
4. Run `npm test` and `npm run dev`.
5. Compare the result with the manual calculation, test expected behavior, locate the equation in code, and use the result to answer the original engineering question.

The application automatically discovers every `src/features/*.feature.js` file and renders it through the shared dashboard layout. Students do not write JSX or CSS and do not edit a registry, `App.jsx`, or existing features. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`examples/lift-example`](examples/lift-example).

## Teaching guides

- [`Student guide`](docs/STUDENT-GUIDE.md) — the recurring understand-to-decision workflow.
- [`Instructor guide`](docs/INSTRUCTOR-GUIDE.md) — three levels of progressive scaffolding.
- [`AI workflow`](docs/AI-WORKFLOW.md) — appropriate and inappropriate uses of AI.
- [`Troubleshooting`](docs/TROUBLESHOOTING.md) — evidence-based recovery prompts.

This is intentionally not a complete aerospace analysis package. Atmosphere, drag, performance, stability, control, and structures remain future student features.
