# AI-Assisted Engineering Workflow

Students are not being trained to ask AI for the answer. They are being trained to:

```text
understand an engineering model
→ formalize the model
→ specify computational behavior
→ use AI for implementation
→ verify the implementation
→ make an engineering decision
```

AI is useful for bounded code generation, explaining unfamiliar implementation details, debugging evidence-rich failures, suggesting implementation approaches, and helping build visualizations.

AI must not replace selecting the governing physics, defining assumptions, creating verification logic, deciding whether a result is physically plausible, or applying engineering judgment.

## Manual ChatGPT workflow

This repository assumes no coding agent has access to the files:

1. Open normal ChatGPT.
2. Complete one copy of `FEATURE-SPEC.md`; its fixed final section contains the reusable application contract.
3. Attach that one file and ask ChatGPT to show its Implementation Interpretation without generating code.
4. Check the interpreted equations, units, conditions, assumptions, behavior, and verification cases. Request corrections when needed.
5. Reply `APPROVE ENGINEERING INTERPRETATION` only when the engineering interpretation matches the intended model.
6. Manually save the three complete new files ChatGPT then generates into the named repository paths.
7. Run the application and tests locally. The feature is discovered automatically.
8. If an error occurs, report the actual result, expected result, terminal message, relevant generated file, and reference calculation.
9. Inspect the equation and independently verify the behavior.

The approval gate is deliberately about the engineering interpretation, not the code. Approval authorizes ChatGPT to implement the agreed specification; it does not demonstrate software correctness, model validity, or real-world validation.

For example, a stability specification might produce this first response:

```text
## Implementation Interpretation

I will implement:
1. Static margin: SM = (xNP - xCG) / MAC.
2. Stable when SM > 0, neutral when SM = 0, and unstable when SM < 0.
3. xCG, xNP, and MAC use meters; SM is dimensionless.
4. Moving CG aft while xNP and MAC remain fixed reduces static margin.
5. The specification mentions Cm_alpha but does not define its equation, so
   approval cannot proceed until that relationship and sign convention are supplied.

No code has been generated yet.
```

The student should resolve the missing `Cm_alpha` model and check the revised interpretation before approving it. This is the intended behavior: ambiguity is caught before it becomes code.

Free access to a general-purpose assistant is sufficient. The application contains no AI API and does not depend on Codex, Copilot, autonomous agents, or repository access.
