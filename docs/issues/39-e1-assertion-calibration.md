# E1 — optional assertion calibration

Status: CLOSED / not planned. Owner: Vanya UI.

E1 uncovered limitations of a one-off eval's assertions (path matching and mismatch between schema and exact identifier checks). The recommendation was semantically correct; complete skill adherence and actual browser behavior remain unverified. No design-system defect was established. The evidence and possible future calibration are already documented in [E1 disposition](../../evals/skill-canary/README.md).

Decision: defer further scenario-specific eval work; preserve the original FAIL and return to Composition S9. Generic skill-read detection research is tracked in [vanya-os #9](https://github.com/VanDalkvist/vanya-os/issues/9). Reopen only if recurring UI-agent evals become an agreed goal. If reopened, require explicit output schema, calibrated positive/negative controls, and separate trace evidence before any live model calls.

No source edits, additional model calls or release changes.
