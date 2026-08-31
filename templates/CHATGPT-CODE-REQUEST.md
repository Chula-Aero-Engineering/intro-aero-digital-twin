# ChatGPT Code Request

The reusable implementation instructions now travel inside every copy of `FEATURE-SPEC.md`. Students do not complete a second prompt or upload repository source files.

After completing Sections 1–12 of `FEATURE-SPEC.md`, attach that one file to a normal ChatGPT conversation and send:

```text
Generate the feature described in this completed specification. Follow the fixed AI implementation contract in the file.
```

ChatGPT should return three complete new files:

```text
src/student/physics/[feature-id].js
src/student/features/[feature-id].feature.js
tests/student/[feature-id].test.js
```

If ChatGPT asks for the feature registry, `App.jsx`, CSS, shared components, or another feature, remind it that the embedded contract is complete and that data-only files in `src/student/features` are discovered and formatted automatically.
