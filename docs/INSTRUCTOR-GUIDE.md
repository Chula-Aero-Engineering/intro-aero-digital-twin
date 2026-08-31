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

## Assignment preparation

Choose an engineering question, decide the scaffolding level, and identify authoritative course sources. Normal assignments create one physics file, one data-only `*.feature.js` definition, and one test file. The shared renderer owns all JSX and CSS, while automatic discovery removes registry edits. If a model needs an aircraft input outside the fixed contract, update the starter architecture before assigning it rather than asking students or AI to improvise state changes.
