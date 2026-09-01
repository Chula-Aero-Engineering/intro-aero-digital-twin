# Instructor Guide

The repository supports repeated, bounded exercises in which students move from engineering reasoning to an AI-generated implementation candidate and then independently verify it. The goal is progressive independence, not web-development instruction or unrestricted AI application generation.

## Level 1: Highly Scaffolded

The instructor provides:

- engineering question;
- model;
- inputs and outputs;
- completed feature specification;
- completed AI prompt;
- verification cases.

Students primarily request the bounded files, integrate them manually, run tests, locate the equation in code, and interpret the output. The completed lift example is suitable as a model.

## Level 2: Partially Scaffolded

The instructor provides:

- engineering question;
- governing model.

Students determine inputs, outputs, units, assumptions, validity limits, expected behavior, tests, feature requirements, and the AI request. Review specifications and manual calculations before implementation when possible.

## Level 3: Open Engineering Problem

The instructor provides only the engineering problem, for example:

> Determine whether the current aircraft has acceptable longitudinal static stability and add whatever analysis capability is needed to investigate it.

Students select and justify the model, state assumptions and limits, define the necessary feature and validation evidence, write the implementation request, verify the candidate, and defend an engineering interpretation.

## Assessment emphasis

Evaluate whether students can:

- justify the governing physics and limits;
- predict behavior before implementation;
- produce an independent reference calculation;
- constrain the implementation request;
- inspect rather than blindly accept generated code;
- distinguish software correctness, model correctness, model validity, and real-world validation;
- make a qualified engineering decision from the output.

The feature checklist is a working aid, not a graded reflection form. Prefer small, frequent additions over one semester-ending application-generation prompt.

Use one repository and one persistent aircraft for the whole semester. A new lesson should extend the aircraft's capability stack rather than create another dashboard. The module rail keeps only one analysis visible at a time, while the same 3D aircraft and shared state remain on screen. Ask students to define a plot or overlay only when it makes the physical relationship easier to interpret.

## Assignment preparation

Choose an engineering question, decide the scaffolding level, and identify authoritative course sources. Normal assignments create one file in each of `src/student/physics`, `src/student/features`, and `tests/student`. The shared renderer owns all JSX and CSS, while automatic discovery removes registry edits.

If a lesson needs a new canonical aircraft input or shared behavior, complete [`templates/LESSON-CORE-SPEC.md`](../templates/LESSON-CORE-SPEC.md) with only the engineering information and ask Codex to add core support. Repository rules classify that as an instructor core update. Codex works on a clean `core/<lesson-slug>` branch, may read student work for compatibility, and may not change it. The local boundary checker and the `core/*` pull-request workflow independently enforce that separation.

If compatibility cannot be maintained, resolve the required student migration explicitly before assigning the lesson rather than allowing an agent to rewrite existing student physics or tests.

See [`DEVICE-WORKFLOWS.md`](./DEVICE-WORKFLOWS.md) for the matched laptop, Codespaces/iPad, and github.dev/Pages routes.

Distribute the course through the public organization repository and have students create personal forks. Publish core updates to its `main` branch. A template-generated repository is intentionally not used because it would not retain the Git relationship students need for later upstream synchronization.

The optional stability dry run is documented in [`STABILITY-UNIT-RUNBOOK.md`](./STABILITY-UNIT-RUNBOOK.md). Its five entries are planned slots in the module rail, not prebuilt physics. When a student adds a matching feature ID, automatic discovery replaces the placeholder with the verified analysis while retaining the shared 3D aircraft and renderer.
