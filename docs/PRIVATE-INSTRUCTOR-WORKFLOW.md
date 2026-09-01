# Private Instructor Companion Workflow

The private companion is the only location for completed stability/control solutions and lecture-preparation fixtures.

## Repository setup

1. Use private repository `Chula-Aero-Engineering/intro-aero-digital-twin-instructor` as `origin`.
2. Add the public repository as a fetch-only `upstream` remote.
3. Keep the repository-scoped Git hooks enabled with `core.hooksPath=.instructor/hooks`.
4. Store the cross-repository GitHub token only in the private repository's `PUBLIC_SYNC_TOKEN` Actions secret.

## Dry run

1. Create a private `prep/<topic>-<stage>` branch or worktree.
2. Complete the same specification students will use.
3. Put candidate files in the normal `src/student/physics`, `src/student/features`, and `tests/student` paths.
4. Run the student tests, full test suite, production build, app interaction, and evidence export.
5. Commit normally. The local hook pushes the private branch automatically.
6. Record corrections in private preparation material.

## Automatic ownership routing

Every private push runs `.github/workflows/private-core-mirror.yml`:

- `src/student/**`, `tests/student/**`, `student-work/**`, `.instructor/**`, private workflow files, and the private `AGENTS.md` remain private.
- Approved application/core paths are extracted without student files and applied to a clean checkout of the public repository.
- The clean public checkout must pass the ownership boundary, full tests, and production build before the workflow pushes it to public `main`.
- The verified public core is then merged back into private `main` automatically.
- If there is no unpublished core difference, the public repository is not changed.

This means an instructor may fix an app/core problem while dry-running in the private repository. Committing the change is sufficient; it must not be repeated manually in the public repository.

The public release may contain reusable canonical inputs, rendering vocabulary, capability IDs, stage titles, purposes, and prerequisite lists. It must not contain completed equations, reference output, solution tests, or lecture-preparation fixtures.
