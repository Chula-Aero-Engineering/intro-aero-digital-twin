# Stability Unit Student Feature Set

This is an instructor-owned assignment reference. Students complete a fresh copy of `templates/FEATURE-SPEC.md` for each feature and generate only the three student-owned files named below.

## 1. Trim response

- Feature ID: `trim-response`
- Question: At the selected angle of attack, is the simplified pitching-moment model trimmed, and does a small angle-of-attack disturbance create a restoring moment tendency?
- Model: `Cm = Cm0 + Cm_alpha * alpha`, `alpha_trim = -Cm0 / Cm_alpha`, and `delta_Cm = Cm_alpha * delta_alpha`.
- Units: convert degrees to radians before using a per-radian slope.
- Assumptions: linear, quasi-static, small-disturbance pitching-moment model; this does not predict the time history.
- Behavior: `Cm_alpha < 0` gives an opposing moment-coefficient change for a positive angle-of-attack disturbance; `Cm_alpha = 0` has no restoring slope.
- Files: `src/student/physics/trim-response.js`, `src/student/features/trim-response.feature.js`, `tests/student/trim-response.test.js`.

## 2. Static margin

- Feature ID: `static-margin`
- Question: What longitudinal static margin is implied by the selected CG and neutral point?
- Model: `SM = (x_NP - x_CG) / c_bar`.
- Assumptions: the supplied neutral point and mean aerodynamic chord represent the modeled condition.
- Behavior: moving CG aft reduces static margin; CG at the neutral point gives zero; CG aft of the neutral point gives negative static margin.
- Files: `src/student/physics/static-margin.js`, `src/student/features/static-margin.feature.js`, `tests/student/static-margin.test.js`.

## 3. CG loading

- Feature ID: `cg-loading`
- Question: Where is the loaded CG, and is it inside the introductory loading limits?
- Model: `x_loaded = (m_airframe*x_airframe + m_payload*x_payload) / (m_airframe + m_payload)`.
- Assumptions: airframe and payload are represented as point masses at their stated longitudinal locations.
- Behavior: zero payload returns the airframe CG; moving payload aft moves loaded CG aft; loaded CG on a limit has zero margin to that limit.
- Files: `src/student/physics/cg-loading.js`, `src/student/features/cg-loading.feature.js`, `tests/student/cg-loading.test.js`.

## 4. Dynamic mode

- Feature ID: `dynamic-mode`
- Question: Does the supplied oscillatory lateral-directional mode decay or grow, and what are its introductory modal properties?
- Model: for `lambda = sigma +/- i*omega_d`, use `omega_n = sqrt(sigma^2 + omega_d^2)`, `zeta = -sigma/omega_n`, and `T = 2*pi/abs(omega_d)` when `omega_d` is nonzero.
- Assumptions: one isolated linear oscillatory mode; modal values are supplied rather than derived from full aircraft equations of motion.
- Behavior: negative `sigma` decays; zero is neutrally damped; positive grows. Increasing `abs(sigma)` at fixed `omega_d` increases the decay rate.
- Files: `src/student/physics/dynamic-mode.js`, `src/student/features/dynamic-mode.feature.js`, `tests/student/dynamic-mode.test.js`.

## 5. Mission loading

- Feature ID: `mission-loading`
- Question: What changes when the payload moves aft, and does the modeled aircraft remain within the loading limits with a positive static margin?
- Model: calculate loaded CG at the initial and mission payload stations, then calculate `SM = (x_NP - x_loaded) / c_bar` for both cases.
- Assumptions: the payload moves longitudinally without changing mass; the same neutral point and chord apply to both cases.
- Behavior: an aft payload movement cannot move the loaded CG forward; static margin decreases as loaded CG moves aft; crossing the aft limit changes the loading decision.
- Files: `src/student/physics/mission-loading.js`, `src/student/features/mission-loading.feature.js`, `tests/student/mission-loading.test.js`.

## Decision language

Positive static margin is evidence of a restoring tendency in this model, not proof of acceptable handling qualities or safety. Student conclusions must also discuss control authority, maneuverability, workload, loading margin, mission needs, and model validity.
