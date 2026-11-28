# Test Cleanup Implementation Plan
> Required: superpowers:executing-plans; Arch Loop S6–S12.
**Goal:** smaller, trustworthy visual gate and removal of proven duplicate assertions.
**Architecture:** one profile contract in existing browser-qa; baseline filesystem manifest and Playwright spec/report consume same context scene set. Existing full profile stays the safe default until reduced profile is demonstrated. No new runner or dependency.
**Tech Stack:** Node test, pinned Playwright 1.65.1, Vitest, existing Cloudflare validation.
**Spec:** [Test Portfolio Review](../../research/test-portfolio-review-2026-11-28.md). Owner approved implementation. Source c739f79446db13a3882a30de7c3a46c253a7aab5; workflow eeda1921e0cace214c2e04306db4e1dce82bb300; skills d2d24afb93918429fee0e5ed0dd4a19299b740da. AGENTS, Regression Gate, memory, prior inventory and actual runner read. Production exact 3.0.0 SHA unchanged.
## Global constraints
- Explicit risk profile lean-v1 56 images; full-v1 176 historical scenes. Keep full default until sensitivity proof; explicit lean opt-in. Profile-specific sealed manifest schema 2; preserve historical files, reject incompatible manifests rather than overwrite.
- No production marker, UI code, public API, dependency, consumer pin, CI or storage modification. Same browser/OS/font constraints and explicit snapshot policy. No automatic approval. Only synthetic screenshots.
## Review focus
Unknown profile, cross-profile manifest, missing/extra images, duplicate capture, report matched reference falsely represented as candidate. Native runner config, report and manifests must share the profile.
## Slice 1 — profile contract walking skeleton
- [ ] Add failing Node tests using existing prepareVisualRun/recordCapture: lean reservation captures exactly 56, rejects wrong profile, extra image, duplicate; full remains 176. Observe RED on old implementation; preserve existing integrity tests.
- [ ] Introduce profileScenes(env,theme,width) and profileContexts(env) in visual-baseline.mjs, exact scene mapping from review, no extra subsystem. Bind profile ID and expected filenames to manifest, reservation and compare. Check exact image sets and environment sets; reject partial/extra/duplicate. 
- [ ] Wire composition-visual.spec.ts and visual-cloud-report.mjs to shared profile; hero ready state and actual /agents/ route with actual version, font/environment checks. Capture candidate original separately only if authentic native output can be proven; otherwise clearly label matched reference reuse, do not claim original. Add report integrity tests. Run native Node tests, browser typecheck and one focused real context.
## Slice 2 — oracle quality / consolidation
- [ ] Fix actual row overflow assertion with discriminating negative control; real keyboard traversal for popup. Preserve destination and marker checks.
- [ ] Remove duplicate CraftCard callback test after unique coverage mapping; preserve desktop scroll reset and confirmation geometry when consolidating overlapping browser scenarios. Keep all unique assertions, no count target. Review CSS string assertions individually and replace only where a computed oracle exists.
## Slice 3 — evidence and acceptance
- [ ] Measure actual durations from comparable runs. Compare lean/full sensitivity using representative actual mutations; restore exact candidate. Do not switch default until evidence.
- [ ] Final exact candidate full functional gate once, lean visual capture and independent review. R2 storage uses established private target; direct build token blocker remains. No baseline approval without actual review.
- [ ] Ledger/memory, read-back, explicit blocked gates. 
S7 self-review: independent slices, first is minimal contract and current runner. Full fallback and manifest rejection preserve coverage while lean evidence is incomplete. Avoid generalizing profile API beyond these two. S9 independent reviewer unavailable in current host; keep OPEN until verified.
