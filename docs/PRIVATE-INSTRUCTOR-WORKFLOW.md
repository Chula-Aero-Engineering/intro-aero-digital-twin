# Private Instructor Companion Workflow

The private companion is the only location for completed stability/control solutions and lecture-preparation fixtures.

## Repository setup

1. Use private repository `Chula-Aero-Engineering/intro-aero-digital-twin-instructor` as `origin`.
2. Add the public repository as a fetch-only `upstream` remote.
3. Protect the private default branch and never open a pull request from the private repository into the public repository.
4. Merge or rebase verified public core releases into the private repository.

## Dry run

1. Create a private `prep/<topic>-<stage>` branch or worktree.
2. Complete the same specification students will use.
3. Put candidate files in the normal `src/student/physics`, `src/student/features`, and `tests/student` paths.
4. Run the student tests, full test suite, production build, app interaction, and evidence export.
5. Record corrections in private preparation material.
6. Delete or retain the private preparation branch according to instructor policy; never copy its implementation into a public core branch.

The public release may contain reusable canonical inputs, rendering vocabulary, capability IDs, stage titles, purposes, and prerequisite lists. It must not contain completed equations, reference output, solution tests, or lecture-preparation fixtures.
