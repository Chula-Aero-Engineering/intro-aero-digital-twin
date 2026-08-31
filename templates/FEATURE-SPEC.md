# Feature Name

Complete Sections 1–12. Do not edit the implementation contract at the end.

## 1. Engineering Question

What engineering question should this feature help answer?

## 2. Physics Model

List the governing equation or relationships.

## 3. Inputs and Units

List each required input and its units.

## 4. Outputs and Units

List each calculated output and its units.

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

List the results and engineering interpretation the dashboard must display. Do not specify colors, layout, HTML, or CSS.

## 11. Files to Create

Replace `[feature-id]` with a short kebab-case name. Create exactly these three new files:

- `src/physics/[feature-id].js`
- `src/features/[feature-id].feature.js`
- `tests/[feature-id].test.js`

## 12. Engineering Decision Enabled

What design question should the completed feature help answer?

---

# Fixed AI Implementation Contract — Do Not Edit

Generate the complete contents of exactly the three new files named in Section 11. Do not request repository files or additional implementation instructions from the student.

## Application contract

- The application uses Vite, React, plain JavaScript, and Vitest.
- Put all engineering equations in the `src/physics` file as exported pure functions.
- Physics files have no React imports and no browser dependencies.
- Use SI units internally and reject obviously invalid numeric inputs.
- Concisely comment input units, output units, and important assumptions.
- Do not add dependencies or modify existing files.
- The application automatically discovers `src/features/*.feature.js` files.
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
  neutralPointM
}
```

If a required aircraft input is not listed, stop and identify the missing field. Do not create a contradictory local copy.

## Feature data contract

The `*.feature.js` file imports functions from its new physics file and exports one object with this exact shape:

```javascript
export const feature = {
  id: "unique-kebab-case-id",
  title: "Feature title",
  description: "One-sentence engineering purpose",

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
      }
    };
  }
};
```

Contract rules:

- `results` contains one object per displayed result.
- `value` is a finite number or short text; `unit` is always a string, including `""` for dimensionless values.
- `precision` is a non-negative integer for numeric display.
- Use `emphasis: true` only for the primary result.
- `verificationCases` implements every case from Section 9 using the physics functions.
- `passed` is a Boolean expression, not hard-coded `true`.
- `decision.status` is `"pass"`, `"caution"`, or `"neutral"`.
- Do not include a component property or import React/shared UI components.

The application owns the feature header, result grid, units, verification styling, decision styling, error presentation, and responsive layout.

## Test contract

- Use Vitest and import pure functions directly from the new physics file.
- Implement every numerical, behavioral, and boundary or sanity case in Section 9.
- Do not claim passing tests proves model validity or real-world validation.

## Required response format

First state the three files, governing calculation, and verification approach. Then provide the complete contents of each file in separately labeled code blocks. If engineering information is missing, identify it instead of inventing a model.
