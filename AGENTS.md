# Repository Working Rules

These instructions apply to the entire repository.

## Default ownership mode

Treat requests about the dashboard, application shell, architecture, navigation, shared aircraft state, rendering, styling, feature discovery, or core support for a lesson as **Instructor Core Updates** unless the user explicitly says they are creating student work.

For an Instructor Core Update:

- Student-owned paths are read-only: `src/student/**`, `tests/student/**`, and `student-work/**`.
- You may inspect student-owned files to preserve compatibility, but never create, modify, move, rename, or delete them.
- Adapt `src/core/**` and other instructor-owned files around existing student feature contracts and the canonical aircraft field names.
- A missing `contractVersion` on a student feature means legacy contract Version 1.
- If compatibility cannot be preserved, stop and report the required migration. Do not perform that migration in student-owned paths.
- Do not use shell commands, formatters, or generators that write into student-owned paths.

Examples, templates, documentation, scripts, configuration, and the shared aircraft contract are instructor-owned. A request explicitly asking to create a student feature may write only the student files named in that request; it must not change the core to make the feature work.

## Core branch gate

Before an Instructor Core Update:

1. Confirm the working tree is clean.
2. Confirm the branch is named `core/<lesson-slug>`, creating it from `main` when needed.
3. If the tree is dirty, stop and report the changed paths. Never stash, discard, reset, or overwrite the user's work.

Before completing an Instructor Core Update, run:

```bash
npm run verify:core-boundary -- --base main
npm test
npm run build
```

The ownership boundary is defined in `.course/ownership.json`. Never weaken the boundary checker or manifest merely to make an update pass.

## Student feature contract

The normal student workflow creates exactly three files and makes no core edits:

- `src/student/physics/<id>.js`
- `src/student/features/<id>.feature.js` (or, for a future assumption/derivation lesson, `src/student/models/<id>.model.js`)
- `tests/student/<id>.test.js`

Completed student specifications belong in `student-work/specs/**`.
