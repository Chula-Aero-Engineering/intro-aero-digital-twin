# Stability Topic Dry-Run Guide

The Stability topic contains fourteen cumulative public slots. The catalog publishes only each stage's title, purpose, expected feature ID, canonical inputs, and prerequisite capabilities. Completed implementations and lecture-preparation reference cases remain in the private instructor companion.

## Instructor preparation

1. Synchronize the latest verified public core into the private instructor repository.
2. Create a private preparation branch/worktree for the stage.
3. Complete and approve the engineering specification.
4. Install the three candidate files in the normal student-owned paths.
5. Confirm the preceding capabilities unlock the stage and the new capability unlocks only its direct dependents.
6. Run student tests, all core tests, the production build, the response controls, and the evidence export.
7. Keep every completed module, expected output, and correction note private.

## Recurring class pattern

1. **Predict:** Change one physical condition and record signs, trends, or limiting behavior.
2. **Observe:** Use the complete private instructor simulation during the live class.
3. **Explain:** Develop the minimum governing physics needed for the stage.
4. **Specify:** Define equations, variables, units, signs, assumptions, validity limits, capabilities, and tests.
5. **Interpret first:** Ask AI for its engineering interpretation without code.
6. **Approve and generate:** Approve only the corrected interpretation, then create exactly three files.
7. **Verify and integrate:** Run tests and compare against the manual/live-class evidence. The new capability remains available downstream.
8. **Decide:** State what the result supports and what the model cannot establish.

## Public sequence

| Stage | Expected ID | Capability focus |
| --- | --- | --- |
| 1 | `force-moment` | force/moment summation |
| 2 | `static-restoring-moment` | static restoring contribution |
| 3 | `moment-contributions` | component moment assembly |
| 4 | `trim-response` | live Cm–alpha and trim |
| 5 | `static-margin` | CG, neutral point, and static margin |
| 6 | `tail-elevator-contribution` | tail stability and control authority |
| 7 | `stick-free-effect` | stick-free effectiveness |
| 8 | `cg-loading` | payload-to-response chain |
| 9 | `lateral-static-stability` | sideslip-induced roll/yaw tendency |
| 10 | `pitch-dynamic-response` | pitch inertia, damping, and histories |
| 11 | `longitudinal-modes` | short-period and phugoid models |
| 12 | `dynamic-mode` | roll, Dutch-roll, and spiral models |
| 13 | `stability-trade-study` | stability/control/handling tradeoffs |
| 14 | `mission-loading` | evidence and model defensibility |

Stages 11–12 are separately validated reduced-order linear teaching models. Neither the UI, assignments, nor student reports may describe them as a validated nonlinear 6-DOF digital twin.

## Public/private gate

Public core updates may add shared state, rendering vocabulary, runtime behavior, documentation, and empty catalog slots. They must not add or change files in `src/student`, `tests/student`, or `student-work`, and must not contain completed stability/control implementations, private fixtures, or lecture-preparation output.
