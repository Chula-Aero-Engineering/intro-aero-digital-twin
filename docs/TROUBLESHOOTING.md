# Troubleshooting

When something fails, give AI evidence. Include what you expected, what actually happened, the exact error, the smallest relevant file, and your manual reference calculation. Do not begin with only “it doesn't work.”

## Wrong numerical result

```text
I added the generated files.

Expected result:
24.5 N lift.

Actual result:
24,500 N.

Here is the relevant physics function:
[paste]

Here is the reference calculation:
[paste]

Identify whether this is likely a unit conversion, equation, or implementation problem. Do not redesign the application. Explain the cause, then provide the complete corrected physics file and any affected test file.
```

## Application no longer starts

```text
The application no longer starts.

Here is the complete terminal error:
[paste]

Here is the file I added:
[paste]

Explain the error and provide the complete corrected file. Preserve the existing architecture and do not modify unrelated files.
```

## Test fails

```text
This verification test fails.

Engineering model and assumptions:
[paste]

Manual expected value with units:
[paste]

Test failure:
[paste]

Physics function and test file:
[paste]

Determine whether the problem is in my expected value, tolerance, units, equation, or implementation. Do not simply weaken or delete the test.
```

## Useful checks before asking

- Confirm that you saved the file at the exact requested path and used the exact capitalization.
- Confirm that imports include the filename extension used by nearby files.
- Check that inputs are in SI units.
- Read the first error in the terminal; later errors may be consequences.
- Re-run `npm test` after every correction.
- Recalculate the reference case independently before changing an expected value.
