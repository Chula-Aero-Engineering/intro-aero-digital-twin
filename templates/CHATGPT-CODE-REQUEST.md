# ChatGPT Code Request

The reusable implementation instructions now travel inside every copy of `FEATURE-SPEC.md`. Students do not complete a second prompt or upload repository source files.

After completing Sections 1–12 of `FEATURE-SPEC.md`, attach that one file to a normal ChatGPT conversation and send:

```text
Review the completed specification and follow the fixed AI implementation contract in the file. Show me the Implementation Interpretation first. Do not generate code until I approve it.
```

ChatGPT's first response must contain the engineering interpretation and no code. Check its equations, definitions, units, sign conventions, conditions, assumptions, expected behavior, and verification cases against your specification and manual calculation.

If anything is wrong or ambiguous, describe the correction. ChatGPT must return a complete revised interpretation and still must not generate code. When the interpretation is correct, reply exactly:

```text
APPROVE ENGINEERING INTERPRETATION
```

Only then should ChatGPT return three complete new files:

```text
src/student/physics/[feature-id].js
src/student/features/[feature-id].feature.js
tests/student/[feature-id].test.js
```

If ChatGPT asks for the feature registry, `App.jsx`, CSS, shared components, or another feature, remind it that the embedded contract is complete and that data-only files in `src/student/features` are discovered and formatted automatically.
