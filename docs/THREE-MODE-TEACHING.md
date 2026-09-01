# Three-Mode Teaching Progression

The three modes are levels of engineering reasoning applied to the same aircraft and topic. They are not separate applications. Each completed student module still begins with one `FEATURE-SPEC.md`, produces exactly three new files, and enters the shared renderer automatically.

```text
CONCEPT              AIRCRAFT                 DESIGN
What does the        Where does the           What configuration
equation mean?  →    behavior come from?  →   satisfies the need?
```

## Mode 1: Concept

Purpose: isolate the mathematical meaning before adding component detail.

The instructor supplies the governing relationship and a deliberately small input set. Students predict slopes, signs, intercepts, trim/equilibrium points, perturbation behavior, and limiting cases. The existing lift analysis is a model: supplied `rho`, `V`, `S`, and `CL` reveal the behavior of `L = 0.5 rho V² S CL` without requiring an airfoil or finite-wing model.

For a future stability concept module, an appropriate bounded scope might use `xCG`, `Cm0`, and `CmAlpha` to investigate a `Cm-alpha` line, trim, and the sign of a small perturbation. This is a specification example only; the repository does not implement that physics.

Student evidence:

- one manual numerical case;
- slope/sign and limiting-case predictions;
- tests that distinguish stable, neutral, and unstable mathematical behavior;
- an explanation of what the plot means and what it cannot establish.

## Mode 2: Aircraft

Purpose: replace an aggregate supplied coefficient with modeled aircraft causes.

Students identify component contributions, geometry, effectiveness factors, units, sign conventions, and assumptions. The output should connect physical changes in the persistent aircraft to the aggregate relationship introduced in Concept mode.

A future stability aircraft module might calculate `CmAlpha` from wing lift-curve slope and aerodynamic-center/CG separation plus a tail contribution using tail volume, tail efficiency, tail lift-curve slope, and downwash. The instructor must select and teach the exact formulation before students specify it.

When an earlier module is reused, the specification names only its public function contract—for example file path, export name, inputs, units, and output. ChatGPT does not need the earlier source file and must not duplicate the earlier equation.

Student evidence:

- a hand calculation showing at least two component contributions;
- dimensional and sign-convention checks;
- behavioral tests for physical changes such as tail area, tail arm, or CG;
- comparison between the derived aggregate value and the Concept-mode behavior.

## Mode 3: Design

Purpose: make a qualified configuration decision from requirements and constraints.

The instructor gives a scenario and quantitative requirements rather than a finished answer. Students still select or are taught the governing model, define design variables, identify fixed data, state validity limits, and decide how the design space will be evaluated.

A future stability design problem might specify an operating CG range from 22% to 37% MAC and ask for horizontal-tail geometry that maintains a stated minimum static margin. The feature could calculate `SM(xCG)`, plot the payload range, shade the acceptable region, and report the controlling condition. The acceptable static margin must be supplied or justified in the specification; ChatGPT may not invent it.

Student evidence:

- verification of requirement boundaries and the controlling case;
- a plotted feasible/acceptable region with numerical limits;
- at least one rejected and one acceptable candidate;
- a decision that discusses control authority, maneuverability, workload, mission needs, and model validity—not stability margin alone.

## One recurring ChatGPT workflow

The interaction does not change by mode:

1. Copy `templates/FEATURE-SPEC.md` into `student-work/specs`.
2. Choose the mode and topic ID.
3. Complete the engineering question, model, inputs, outputs, assumptions, validity limits, expected behavior, reference calculation, verification cases, visualization requirements, file names, and enabled decision.
4. For Aircraft or Design mode, declare earlier capability dependencies by ID, minimum version, inputs, units, and output.
5. Attach only that completed Markdown file to ordinary ChatGPT.
6. Ask ChatGPT to show its Implementation Interpretation first and generate no code.
7. Check the equations, units, conditions, assumptions, behavior, and verification plan. Request a revised interpretation if needed.
8. Reply `APPROVE ENGINEERING INTERPRETATION` only when the engineering interpretation is correct.
9. Save the three returned files under `src/student/physics`, `src/student/features`, and `tests/student`.
10. Run tests, compare the manual case, inspect the equation, manipulate the visualization, and answer the engineering question.

The three generated files remain the same at every level. What becomes more sophisticated is the engineering specification, not the web-development task.

## Instructor release gate

Before assigning a new level, confirm:

- the required canonical aircraft fields already exist in the core;
- any earlier capability dependency has a stable documented ID, version, inputs, units, and output;
- the exact governing formulation has been selected and taught;
- every requirement and acceptable limit is numerical or explicitly justified;
- the starter renderer already supports the requested plot, time history, or data-only scene overlay;
- the assignment can still be generated from one completed specification without uploading repository files.

If new shared state or rendering vocabulary is needed, add that as an instructor core update before the lesson. Do not ask students or ChatGPT to redesign the shell.
