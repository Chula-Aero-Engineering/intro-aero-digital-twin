# Lift Availability

## Learning Mode

`concept`

Topic ID: `lift`

## 1. Engineering Question

Can the current wing produce enough lift to balance the aircraft weight at the selected flight condition?

## 2. Physics Model

`L = 0.5 ρ V² S CL`, `W = mg`, and `CL_required = W / (0.5 ρ V² S)`.

## 3. Inputs and Units

Air density `ρ` (kg/m³), speed `V` (m/s), wing area `S` (m²), lift coefficient `CL` (dimensionless), and total mass `m` (kg).

## 4. Outputs and Units

Lift `L` (N), weight `W` (N), and required lift coefficient `CL_required` (dimensionless).

## 5. Assumptions

Steady conditions; the supplied density and lift coefficient represent the flight condition; `g = 9.81 m/s²`; steady, level flight requires lift equal to weight.

## 6. Validity Limits

Do not trust this comparison when the supplied coefficient is outside its aerodynamic source, during strongly unsteady or accelerated flight, or as a substitute for wind-tunnel or flight validation.

## 7. Expected Physical Behavior

Zero `CL` gives zero lift. Doubling area doubles lift. Doubling speed quadruples lift. Increasing mass increases weight and required `CL`, but does not by itself change lift available.

## 8. Reference Calculation

For `ρ = 1.225 kg/m³`, `V = 10 m/s`, `S = 0.5 m²`, and `CL = 0.8`:

`L = 0.5(1.225)(10²)(0.5)(0.8) = 24.5 N`.

## 9. Verification Cases

- Numerical: the reference inputs produce `24.5 N`.
- Behavioral: doubling area gives `49.0 N`; doubling speed gives `98.0 N`.
- Boundary: `CL = 0` gives `0 N`; negative physical inputs are rejected.

## 10. Feature Requirements

Display lift available, aircraft weight, required `CL`, supplied `CL`, verification status, and a cautious sufficient/insufficient interpretation. The application controls all formatting.

## 11. Files to Create

- `src/student/physics/lift.js`
- `src/student/features/lift.feature.js`
- `tests/student/lift.test.js`

## 12. Engineering Decision Enabled

Determine whether the modeled wing can balance weight at the chosen condition and identify whether more speed, wing area, or lift coefficient may be needed. This is an introductory model comparison, not a certified airworthiness decision.

---

# Fixed AI Implementation Contract — Do Not Edit

This interaction has two mandatory phases. Do not skip Phase 1 even if the student asks for code immediately.

## Phase 1 — Engineering interpretation and approval

On the first response, generate no code, pseudocode, file contents, or implementation snippets. Return only an `## Implementation Interpretation` that states:

1. the engineering question;
2. `L = 0.5 ρ V² S CL`, `W = mg`, and `CL_required = W / (0.5 ρ V² S)`, with every symbol defined;
3. the sufficient/insufficient comparison and any numerical tolerance;
4. every input and SI unit;
5. every output and SI unit;
6. the expected physical behavior from Section 7;
7. the assumptions and validity limits;
8. all verification cases from Section 9; and
9. the three exact paths from Section 11.

End with: `No code has been generated yet. Reply exactly APPROVE ENGINEERING INTERPRETATION to authorize code generation, or describe the engineering correction needed.`

If the student requests a correction, return a complete revised interpretation and no code. Do not invent or silently repair missing physics.

## Phase 2 — Code generation after approval

Generate code only after the student replies exactly `APPROVE ENGINEERING INTERPRETATION` in the same conversation. Approval authorizes only the displayed engineering interpretation; it does not prove the model or implementation is correct.

After approval, generate the complete contents of exactly the three new files in Section 11. Do not request repository files or additional implementation instructions.

## Application contract

- Use Vite, React, plain JavaScript, and Vitest; do not add dependencies or modify existing files.
- Put the governing equations only in exported pure functions in `src/student/physics/lift.js`.
- Use SI units, reject obviously invalid numeric inputs, and comment units and assumptions concisely.
- The application automatically discovers `src/student/features/*.feature.js` files.
- `lift.feature.js` contains no React, JSX, HTML, CSS, class names, inline styles, or `component` property. The application formats its data automatically.

The shared `aircraft` object provides `massKg`, `payloadKg`, `speedMps`, `densityKgM3`, `wingSpanM`, `wingAreaM2`, `meanChordM`, `cl`, `cgM`, and `neutralPointM`.

## Exact feature data contract

`lift.feature.js` imports the new physics functions and exports:

```javascript
export const feature = {
  contractVersion: 3,
  id: "lift",
  title: "Lift analysis",
  description: "Compare modeled lift with aircraft weight at the current flight condition.",
  category: "Forces",
  learningMode: "concept",
  topicId: "lift",
  inputKeys: ["massKg", "payloadKg", "speedMps", "densityKgM3", "wingAreaM2", "cl"],

  analyze(aircraft) {
    // Call the imported physics functions; do not repeat equations here.
    return {
      results: [
        { label: "Lift available", value: liftN, unit: "N", precision: 2, emphasis: true },
        { label: "Aircraft weight", value: weightN, unit: "N", precision: 2 },
        { label: "Required lift coefficient", value: requiredCl, unit: "", precision: 3 },
        { label: "Supplied lift coefficient", value: aircraft.cl, unit: "", precision: 3 }
      ],
      verificationCases: [
        { label: "Reference case produces 24.5 N", passed: booleanExpression }
      ],
      decision: {
        question: "Can the current wing produce enough lift at this condition?",
        interpretation: "A qualified interpretation calculated from the current results",
        status: "pass"
      },
      plots: [],
      scene: null
    };
  }
};
```

Implement every Section 9 case in `verificationCases` using Boolean expressions derived from the physics functions; never hard-code `passed: true`. Set decision status to `"pass"` when modeled lift is sufficient and `"caution"` otherwise.

## Test contract

Use Vitest, import the pure functions directly from `src/student/physics/lift.js`, and implement every numerical, behavioral, and boundary case in Section 9. Do not claim passing tests proves model validity or real-world validation.

## Required response format

Before approval, return only the Implementation Interpretation and no code. After approval, briefly state that the approved interpretation is being implemented, then provide the complete contents of each file in separate labeled code blocks. If new missing or conflicting engineering information becomes apparent, stop and return a revised interpretation for approval instead of inventing a model.
