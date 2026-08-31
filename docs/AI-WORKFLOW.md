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
3. Attach that one file and ask ChatGPT to generate the described feature.
4. Manually save the three complete new files into the named repository paths.
5. Run the application and tests locally. The feature is discovered automatically.
6. If an error occurs, report the actual result, expected result, terminal message, relevant generated file, and reference calculation.
7. Inspect the equation and independently verify the behavior.

Free access to a general-purpose assistant is sufficient. The application contains no AI API and does not depend on Codex, Copilot, autonomous agents, or repository access.
