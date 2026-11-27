# Architecture Improvement Memory — Vanya UI

## 2026-11-23 — Never confuse test shape with a browser oracle
- Context: PR #25 (#13–16), AP-056/AP-057/AP-076.
- Symptom: a Playwright test could pass with only an input value change while the SineWave never moved, or miss a right-side overlay by probing only the middle of the slider.
- Cause: assertions checked intermediate representations or just one hit point rather than the delivered user outcome.
- Use next time: for each new browser acceptance test, name the broken user journey, observe a downstream visible result, and make one intentionally broken negative-control scenario where feasible. Keep screenshots as review artifacts, not automated approvals.
- Evidence: `browser-qa/tests/ui-contract.spec.ts` at PR #25, [test-integrity review](../research/pr25-test-integrity-review-2026-11-23.md).

## 2026-11-23 — Test the built entrypoint, not only the dev server
- Context: new browser QA runner.
- Symptom: Playwright originally ran `vite dev`, bypassing the Vite production build and prerender.
- Cause: the walking skeleton stopped at a development-only surface, so it could not prove production contract wiring.
- Use next time: browser gate must build first and test compiled `dist/` through real HTTP; S9 stays NOT_VERIFIED until that runner is executed and reviewed. No accidental Cloudflare production deploy from a PR.
- Evidence: `browser-qa/playwright.config.ts`, `package.json#scripts.preview`, [cycle 7 plan](../superpowers/plans/2026-11-23-arch-improvement-cycle-7-pr25.md).

## 2026-11-23 — Accurate source facts before criticizing an assertion
- Context: review of the pressed-state browser test.
- Symptom: an early criticism described a button as text variant when its actual source rendered outline variant.
- Cause: inference from test naming without tracing its exact live showcase instantiation.
- Use next time: inspect the rendering callsite, CSS variant-specific behavior and test locator together before declaring a wrong oracle. Correct mistakes explicitly and preserve what was genuinely wrong.
- Evidence: `src/showcase/ComponentCatalog.tsx` and `src/tokens.css`, [review](../research/pr25-test-integrity-review-2026-11-23.md).

## 2026-11-25 — Verify the consumer's installed design harness
- Context: #36, AP-012/AP-068/AP-075/AP-076.
- A checkout-only linter and a product-authored success script leave the real agent execution path unproven.
- Use next time: resolve policy and frozen toolchain from the installed immutable dependency; require canonical binding and execute before build/browser; exercise a deliberate invalid source change and observe actual nonzero exit. Prove separate distribution installs before release. Legacy baselines require explicit capture and policy fingerprint; never auto-refresh during feature work.
- Evidence: cycle 8 plan, design-harness.e2e.test.mjs, successful builds a78b3432-f6e0-4267-adf9-8833bafde97a and b5878c88-fd36-4044-92c9-9761f17a5365.

## 2026-11-27 — Golden baseline guard and truthful responsive examples
- Context: Composition checkpoint re-review.
- Symptom: visual mode baseline accepts updateSnapshots=all against any supplied directory; compact workspace example forces keep-columns while its prose promises mobile stacking, confirmed in actual 390px production capture.
- Use next time: enforce immutable baseline capture with explicit source/environment identity and refusal to overwrite; inspect actual example props against documented behavior at narrow widths before generalizing a component. An observed production baseline defect is a repair target, never evidence of candidate regression.
- Evidence: [checkpoint review R1/R2](../research/composition-checkpoint-review-2026-11-27.md).
