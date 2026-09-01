# Feature Name

Complete Sections 1–12. Do not edit the implementation contract at the end.

## Learning Mode

Write exactly one: `concept`, `aircraft`, or `design`.

- `concept` — isolate the governing mathematical relationship with very few inputs.
- `aircraft` — calculate supplied coefficients from aircraft geometry, component behavior, and assumptions.
- `design` — evaluate design variables against quantitative requirements and constraints.

State the topic ID used to connect related modules, for example `lift` or `stability`.

## 1. Engineering Question

What engineering question should this feature help answer?

## 2. Physics Model

List the governing equation or relationships.

For Aircraft or Design mode, list any earlier student physics functions that this feature must reuse. Give the exact file path, export name, inputs, units, and output. Do not paste the implementation. Write `No prior module dependency` if none.

For Design mode, requirements do not replace physics. State the model used to evaluate every requirement and the sweep, search, or comparison method.

## 3. Inputs and Units

List each required input and its units.

In Aircraft mode, distinguish measured/supplied aircraft data from derived values. In Design mode, distinguish fixed scenario data, design variables, and requirements.

## 4. Outputs and Units

List each calculated output and its units.

Aircraft mode should expose useful intermediate contributions. Design mode should include requirement margins or feasibility, not only a pass/fail label.

## 5. Assumptions

What assumptions are embedded in the model?

## 6. Validity Limits

When should this model NOT be trusted?

## 7. Expected Physical Behavior

Describe qualitative relationships that must hold.

## 8. Reference Calculation

Manually calculate at least one known case. Include inputs, expected output, and units.

## 9. Verification Cases

Define at least one numerical case, one behavioral case, and one boundary or sanity case before implementation.

## 10. Feature Requirements

List the results and engineering interpretation the dashboard must display.

If a plot helps answer the engineering question, define its x-variable, y-variable, units, series, and the range or points to calculate. Otherwise write `No plot`.

For Design mode, define any acceptable region with numerical `xMin`, `xMax`, `yMin`, and `yMax` limits. Define requirement lines by axis and value. Do not ask ChatGPT to choose unstated limits.

If a visual marker helps, request only one or more data overlays: a point at an aircraft-relative `{x, y, z}` position or an arrow with an origin and vector, all in meters. Otherwise write `No 3D overlay`. Do not specify colors, layout, HTML, CSS, Three.js, or chart code.

## 11. Files to Create

Replace `[feature-id]` with a short kebab-case name. Create exactly these three new files:

- `src/student/physics/[feature-id].js`
- `src/student/features/[feature-id].feature.js`
- `tests/student/[feature-id].test.js`

If the instructor assigned a dashboard feature ID, use that exact ID and filename so the feature appears in the intended lesson block.

## 12. Engineering Decision Enabled

What design question should the completed feature help answer?

---

# Fixed AI Implementation Contract — Do Not Edit

Generate the complete contents of exactly the three new files named in Section 11. Do not request repository files or additional implementation instructions from the student.

## Application contract

- The application uses Vite, React, plain JavaScript, and Vitest.
- Put all engineering equations in the `src/student/physics` file as exported pure functions.
- Physics files have no React imports and no browser dependencies.
- Use SI units internally and reject obviously invalid numeric inputs.
- Concisely comment input units, output units, and important assumptions.
- Do not add dependencies or modify existing files.
- The application automatically discovers `src/student/features/*.feature.js` files.
- The feature file contains no React, JSX, HTML, CSS, class names, or inline styles. The application formats its structured data automatically.

The shared `aircraft` object provides:

```javascript
{
  massKg,
  payloadKg,
  speedMps,
  densityKgM3,
  wingSpanM,
  wingAreaM2,
  meanChordM,
  cl,
  cgM,
  neutralPointM,
  cm0,
  cmAlphaPerRad,
  angleOfAttackDeg,
  disturbanceAlphaDeg,
  airframeCgM,
  payloadPositionM,
  initialPayloadPositionM,
  missionPayloadPositionM,
  forwardCgLimitM,
  aftCgLimitM,
  dutchRollRealPartPerS,
  dutchRollImagPartRadS
}
```

If a required aircraft input is not listed, stop and identify the missing field. Do not create a contradictory local copy.

## Feature data contract

The `*.feature.js` file imports functions from its new physics file and exports one object with this exact shape:

```javascript
export const feature = {
  contractVersion: 3,
  id: "unique-kebab-case-id",
  title: "Feature title",
  description: "One-sentence engineering purpose",
  category: "Course topic",
  learningMode: "concept",
  topicId: "topic-id",
  inputKeys: ["speedMps", "wingAreaM2"],

  analyze(aircraft) {
    // Call imported physics functions. Do not repeat governing equations here.

    return {
      results: [
        {
          label: "Result label",
          value: 12.34,
          unit: "N",
          precision: 2,
          emphasis: true,
          note: "Optional short engineering context"
        }
      ],
      verificationCases: [
        { label: "Known-case description", passed: trueOrFalse }
      ],
      decision: {
        question: "Engineering question this feature answers",
        interpretation: "Qualified interpretation based on the current results",
        status: "pass"
      },
      plots: [
        {
          id: "unique-plot-id",
          title: "Physical relationship",
          xLabel: "Input name (unit)",
          yLabel: "Output name (unit)",
          series: [
            {
              label: "Series label",
              color: "#ff5a36",
              points: [{ x: 0, y: 0 }, { x: 1, y: 2 }]
            }
          ],
          regions: [
            {
              label: "Acceptable region",
              xMin: 0.22,
              xMax: 0.37,
              yMin: 0.05,
              yMax: 0.20,
              color: "#dce9ad"
            }
          ],
          referenceLines: [
            { axis: "y", value: 0.05, label: "Minimum requirement" }
          ]
        }
      ],
      scene: {
        caption: "What this overlay represents",
        overlays: [
          {
            type: "arrow",
            origin: { x: 0, y: 0, z: 0 },
            vector: { x: 0, y: 0, z: 1 },
            color: "#dce9ad"
          }
        ]
      }
    };
  }
};
```

Contract rules:

- `results` contains one object per displayed result.
- `contractVersion` is `3`; older Version 1 and 2 files and files that omit the version remain compatible.
- `learningMode` exactly matches the completed Learning Mode section. `topicId` connects the three levels of one engineering topic.
- `inputKeys` contains only canonical aircraft fields actually used by this module. The core uses it to show focused controls.
- `value` is a finite number or short text; `unit` is always a string, including `""` for dimensionless values.
- `precision` is a non-negative integer for numeric display.
- Use `emphasis: true` only for the primary result.
- `verificationCases` implements every case from Section 9 using the physics functions.
- `passed` is a Boolean expression, not hard-coded `true`.
- `decision.status` is `"pass"`, `"caution"`, or `"neutral"`.
- Include `plots: []` when Section 10 says no plot. Plot points must be calculated from the physics functions, not typed as unexplained display values.
- Include `regions: []` and `referenceLines: []` when no design constraints are plotted. Every displayed limit must come from the completed specification.
- Include `scene: null` when Section 10 says no 3D overlay. Supported overlays are data-only `point` and `arrow` objects. Coordinates use the aircraft frame: +x forward, +y right wing, +z up.
- Do not include a component property or import React/shared UI components.

Mode rules:

- Concept mode must keep the model intentionally small and must not introduce unrequested aircraft-detail equations.
- Aircraft mode must calculate the requested aggregate behavior from the listed aircraft parameters and expose component contributions where specified.
- Design mode must evaluate only the stated variables, model, requirements, and limits. It must not silently perform an optimizer search or invent a design criterion.
- A feature may import an earlier student physics function only when Section 2 provides its exact path and signature. Do not request the earlier source file or duplicate its equation.

The application owns the feature header, result grid, units, verification styling, decision styling, error presentation, and responsive layout.

## Test contract

- Use Vitest and import pure functions directly from the new physics file.
- Implement every numerical, behavioral, and boundary or sanity case in Section 9.
- Do not claim passing tests proves model validity or real-world validation.

## Required response format

First state the three files, governing calculation, and verification approach. Then provide the complete contents of each file in separately labeled code blocks. If engineering information is missing, identify it instead of inventing a model.
