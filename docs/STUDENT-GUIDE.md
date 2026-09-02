# Student Guide

This repository helps you turn newly learned aerospace physics into a small computational feature. It does not require you to become a web developer. You are responsible for the engineering reasoning; an ordinary ChatGPT conversation may help translate your bounded specification into code.

For the complete browser-based Stage 4 walkthrough—from creating a personal GitHub fork through prompting ChatGPT, adding the three `trim-response` files, testing, previewing, pushing, and publishing—use [`STAGE-4-STUDENT-GUIDE.md`](./STAGE-4-STUDENT-GUIDE.md).

> **AI-generated code is an implementation candidate, not engineering evidence. A feature is not accepted until its behavior has been independently verified.**

## A. Understand

Learn the aerospace model before touching AI. Identify the governing equation, variables, units, assumptions, and limits. If you cannot explain why the equation applies, you are not ready to implement it.

## B. Specify

Copy [`templates/FEATURE-SPEC.md`](../templates/FEATURE-SPEC.md) into `student-work/specs` and complete every section. Keep the feature narrow: one engineering question, one model, and a small number of outputs.

Choose the assigned learning mode: Concept isolates the equation, Aircraft derives behavior from physical parameters, and Design evaluates requirements and constraints. The upload and three-file workflow is identical in all modes. See [`THREE-MODE-TEACHING.md`](./THREE-MODE-TEACHING.md).

## C. Verify Before Coding

Perform at least one manual reference calculation. Define a numerical test, a test of expected physical behavior, and a boundary or sanity test before code exists.

## D. Ask AI

Attach your one completed `FEATURE-SPEC.md` file to normal ChatGPT and send: “Review the completed specification and follow the fixed AI implementation contract in the file. Show me the Implementation Interpretation first. Do not generate code until I approve it.” Do not upload repository source files. The specification already contains the stable application contract ChatGPT needs.

ChatGPT must first restate the engineering interpretation without producing code. Compare its equations, variable definitions, units, sign conventions, classifications, assumptions, expected behavior, and tests with your specification and manual calculation. Correct the interpretation until it matches the intended model. Then reply exactly `APPROVE ENGINEERING INTERPRETATION`. Only after that approval may ChatGPT generate the three files.

You should understand the engineering specification before submitting it. Do not ask ChatGPT to choose an aerospace model or rebuild the whole application.

## E. Add the Files

Manually create the three new files named in the specification under `src/student/physics`, `src/student/features`, and `tests/student`. Do not replace existing files or edit `src/core`. The application discovers and formats the new feature automatically.

## F. Run

From the repository folder:

```bash
npm install
npm run dev
```

Open the local address shown in the terminal. If the application stops, use the evidence-based prompts in [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md).

On an iPad, use the browser-based Codespaces route in [`DEVICE-WORKFLOWS.md`](./DEVICE-WORKFLOWS.md). You add the same three files and run the same checks.

## G. Verify

Run:

```bash
npm test
```

Compare the displayed result to your manual calculation. Also change inputs to check the predicted qualitative behavior. A passing test only says that the code behaved as specified for those cases.

If your feature includes a plot or 3D overlay, explain what every axis, point, or arrow means physically. The core draws it; your feature remains responsible for supplying correct engineering data.

## H. Inspect

Open the physics file. Locate the actual governing equation and explain how each variable maps to an input and unit. Confirm that the feature definition calls the physics function rather than repeating the equation.

## I. Use

Return to the original engineering question. Vary the aircraft state, interpret the feature output, and state a decision with the model's assumptions and limits.

Use [`templates/FEATURE-CHECKLIST.md`](../templates/FEATURE-CHECKLIST.md) before accepting the feature.

## What verification can and cannot establish

- **Software correctness:** the function gives the specified results for selected cases.
- **Model correctness:** the governing relationships were selected and transcribed appropriately.
- **Model validity:** the assumptions are suitable for the conditions being studied.
- **Real-world validation:** predictions agree with trustworthy experimental or flight evidence.

Unit tests primarily support software correctness. They do not automatically establish the other three.
