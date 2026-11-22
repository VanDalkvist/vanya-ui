# Arch Improvement Loop — PR #25, cycle 7 — 2026-11-23

## S0–S3: Source / memory / context / approved scope

- **S0:** source `VanDalkvist/vanya-ui` feature branch `fix/ux-13-16-interaction-browser-gate-20261123` at the PR #25 head captured before this cycle. Base `main` unchanged. The connected GitHub API is the Git source; no local clone exists in the shell, and no preview builds have been executed.
- **S1:** replay [project ledger](../../arch-improvement/ledger.md), cycles 1–6: a real browser path, end-to-end focus/spacing and observable outcomes are more trustworthy than isolated DOM assertions. Prior evidence is historical and must not be reused as this branch's PASS. No existing project memory.md in this tree; a durable lesson may be created after this cycle.
- **S2 Architecture Context Map:** stage **prod** (public Vanya UI design system, live Cloudflare site). Source: `AGENTS.md`, `DESIGN.md`, `src/index.ts`, `src/showcase/main.tsx`, `package.json`, `docs/patterns/interaction-states.md`, `browser-qa/`, issue contracts #13–16. Upstream baseline `ai-meatbags/arch-rules` (project ledger names AP rules; no pinned upstream copy identified). Applicable: **critical** AP-011, AP-012, AP-020, AP-023, AP-025, AP-046, AP-074, AP-075, AP-076; **baseline** AP-028, AP-051, AP-054, AP-056, AP-057, AP-068, AP-069. AP-010 is contextual for library boundaries. Not applicable: DB/auth/tenant/webhooks/data migrations. Known deviation: source-distribution package; it is tracked separately in issue #18 and versioning policy. UI-specific entry points: `index.html` and `showcase.html` → `src/showcase/main.tsx` → `Showcase` → `ShowcaseHeader`/catalog → exported `SegmentedControl` and `ThemeToggle`. Browser runner uses Playwright→local Vite server; never a fake HTML/JS mock.
- **S3:** user already approved implementing #13–16 **within one PR**, now explicitly requested architectural/test review. No permission to merge, enable automatic GitHub Actions or broaden to package migration; retain PR as draft when S9 unverified. Broader public contract choice (changing filter default versus keeping old tabs) is reviewed as a compatibility risk and reserved for explicit release planning, not hidden behind tests.

## S4 source-backed findings and S5 triage

1. **[P1] AP-076 false positive risk in `browser-qa/tests/ui-contract.spec.ts:140+`**: the press test's name claims no false success, but it only checks CSS/background and `data-action-state` following a click, not the actual displayed counter or caller-approved result. **fix-now**: split observable click outcome from pending/error/success journey, check actual output and pressed CSS via separate assertions.
2. **[P1] AP-056 partial hit-test in `browser-qa/tests/ui-contract.spec.ts:12+`**: a center-only, post-scroll hit test can miss the original bottom-right overlay collision or miss the initial viewport composition. **fix-now**: capture initial state before forced scrolling, inspect multiple track points (left/mid/right) for interception, and independently exercise actual slider change. A small screen where the slider legitimately starts below fold should not be marked obstructed merely because it is offscreen; report initial visibility separately.
3. **[P2] AP-056 incomplete keyboard contract in `browser-qa/tests/ui-contract.spec.ts`**: menu Shift+Tab, disabled tab skip, browser Tab to panel, manual scroll current section and bidirectional independent scrolling are missing despite docs promising them. **fix-now**: add targeted, state-changing assertions; avoid duplicate unit-only assertions when browser evidence adds nothing.
4. **[P2] AP-057 portability/reproducibility**: browser QA subpackage lacks immutable transitive dependency lock; only version of Playwright itself is pinned. **log-only** until isolated dependency installation can be executed and `package-lock.json` verified on a networked machine; do not invent lock content.
5. **[P1] AP-075 verification**: new test subsystem has no executed walking-skeleton evidence, no native 200% browser zoom or screenshots review. **blocked** by missing networked local clone + browser runtime in this chat. S9 must be FAIL/NOT_VERIFIED, not PASS.
6. **[P2] AP-046 public contract change**: SegmentedControl default from tabs to filters is an intentional semantic breaking change. **blocked for release**: existing pinned consumers require compatibility/release decision; keep change explicitly in Unreleased/migration note and do not silently bump/tag/merge.
7. **[P3] shallow preexisting CSS-string tests**: `tests/interaction-states.test.tsx` asserts fragments of CSS text. **log-only**: they are valid static contract smoke, but not browser behavior; never count them as visual verification.

## S6 lean slices, AP gates and behavioral oracles

### Slice 0 — prove the actual browser gate (AP-075)
- **Boundary:** public package/compiled showcase + browser adapter.
- **Red oracle:** run `npm run test:browser` on this PR in real Chromium. No fake DOM or stubbed `elementFromPoint`.
- **Green:** running real local Vite + browser suite, observed screenshot/geometry and output.
- **Blocked now:** local checkout/npm install/browser execution unavailable through this context. Preserve explicit `NOT_RUN`; do not claim evidence.

### Slice 1 — press/result and negative-state truth (AP-076)
- **Boundary:** page `#interaction-states` & `#action-feedback` via public browser controls.
- **Red oracle:** the displayed click counter must change from instructional to `Нажатие принято · 1`, then `... · 2`; clicked ActionButton is not counted as success merely by having a CSS class. For the separate pending/explicit success/error demo, assert the full result text before/after actual user selection, not just button status.
- **Implementation:** replace only browser test assertions/selectors. Do not change the library ActionButton contract.

### Slice 2 — meaningful geometry and navigation (AP-056/057)
- **Boundary:** first-screen slider, native hash, composite keyboard, two scroll owners.
- **Red oracle:** a block at track right 80% fails `elementFromPoint`; a manual `scrollIntoView` updates current heading; a tab selected by Arrow moves focus and changes *actual visible panel content*; Escape returns focus; both independent regions scroll without moving sibling.
- **Implementation:** test asserts multiple hit samples at initial view and after bringing slider into view, and adds keyboard/history/scroll journeys.
- **Flake control:** avoid hard-coded timed delays; rely on role/visibility expectations, live DOM, and `expect.poll` only when necessary.

### Slice 3 — verify / preserve evidence
- **Boundary:** src tests + browser-qa + docs, no other consumers.
- **Review:** four mandatory semantic probes with file evidence (dependencies actually used, no split brain, entrypoint wiring, anti-hollow).
- **S9:** Architecture and black-box Product PASS both required. No environment run => FAIL; report separately what can be determined statically.
- **S10/S11:** append ledger entry and memory lesson. **S12:** concise handoff, same draft PR.

## S7 critique before execution

Avoid changing production behavior to satisfy a test whose oracle is mistaken. A screenshot is an artifact, not a pass condition. Do not match incidental implementation class names when a user-visible counter / accessible selected state exists. Do not add a large e2e project-wide framework or automated GitHub actions. The selected changes remain inside browser-qa and documentation unless a code-level defect is independently proven.
