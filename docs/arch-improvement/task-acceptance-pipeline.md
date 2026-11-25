# Scoped UI task acceptance — 0.4.2

Baseline 3948cf50aa61fb63123b0204b62ba30bc421513f; verified library release remains v0.4.1. Owner requested stronger CLI and concrete skill output criteria.

Findings: base contract detects imports and script existence, but cannot infer task scope, applicability or visual evidence. Library authoring needs explicit visual mode. Older installed APIs can diverge from guide version. Existing bootstrap pointers preserve user policy.

Decision: additive plan/review with 14 stable UI-specific IDs and canonical references, structured evidence and explicit mandatory rows. No repository-wide redesign by default; no additional dependencies, Git integration, workflow, installation, deploy or auto-upgrade. Existing check/verify keep their contract. Evidence validator does not claim truth or UI_VERIFIED. Warn on version/CSS mismatch; do not mandate latest dependency. Explicit arbitrary nested package path fixes an existing documented flag gap. Keep product-specific evidence local.

Verification: Node regression tests for plan, review, missing/duplicate IDs, invalid N/A, missing evidence, unresolved checks, CLI exit, installed version warnings, arbitrary nested package and canonical files. Existing bootstrap test preserves user policy. Exact-head build and tests pending at commit. No rendered production component changes; release remains UNTAGGED until normal release gate.
