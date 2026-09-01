# Stability Unit Dry-Run Guide

The dashboard now contains foundations plus five stability blocks. Each stability block owns one expected student feature ID. Until that feature exists, the dashboard shows a teaching placeholder with the exact path students will create.

## Instructor preparation

1. Start the application and select each stability block.
2. Confirm that the input panel changes with the block and that existing foundation features remain available.
3. Review the assignment briefs in `examples/stability-unit/README.md`.
4. Give students a clean copy of `templates/FEATURE-SPEC.md` for the current block.
5. Do not supply generated solution files before the specification and manual verification discussion.

## Recurring class pattern

1. **Predict:** Present a disturbance or loading change and ask students to predict signs, trends, and limiting cases.
2. **Model:** Introduce the governing relationship, units, assumptions, and validity limits.
3. **Specify:** Students complete Sections 1–12 of `FEATURE-SPEC.md`.
4. **Verify first:** Students calculate one numerical case and define behavioral and boundary cases.
5. **Generate:** Students attach only the completed specification to ordinary ChatGPT.
6. **Integrate:** Students save the returned physics, feature, and test files at the specified student-owned paths.
7. **Test:** Students run `npm test`, compare with the manual result, and vary inputs.
8. **Decide:** Students answer the engineering question with qualified language.

## Feature sequence

| Block | Expected ID | Main result | Decision focus |
| --- | --- | --- | --- |
| Disturbance, trim, response | `trim-response` | trim angle and disturbance moment tendency | restoring tendency versus time response |
| Longitudinal static stability | `static-margin` | nondimensional static margin | positive, neutral, or negative restoring tendency |
| CG and loading limits | `cg-loading` | loaded CG | position inside the introductory envelope |
| Dynamic behavior | `dynamic-mode` | decay/growth, damping ratio, period | workload and response quality, not damping alone |
| Mission loading | `mission-loading` | before/after CG and static margin | mission acceptability after the payload moves aft |

## What the core intentionally does not do

The instructor-owned application stores and displays scenario inputs, organizes the teaching sequence, and formats analysis output. It does not calculate trim angle, static margin, loaded CG, modal properties, or the mission decision. Those equations remain the student work.

## Pulling later instructor updates

Students should commit their student-owned work before incorporating an instructor update. Because instructor changes remain outside `src/student`, `tests/student`, and `student-work`, a normal Git merge should preserve their files. The core boundary checker prevents a `core/*` pull request from changing those paths.
