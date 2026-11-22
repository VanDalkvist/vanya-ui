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
