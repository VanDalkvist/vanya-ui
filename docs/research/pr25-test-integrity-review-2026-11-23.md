# PR #25 — Arch Improvement Loop Cycle 7: architecture and test integrity review

**Date:** 2026-11-23  
**Source:** `VanDalkvist/vanya-ui` branch `fix/ux-13-16-interaction-browser-gate-20261123`, reviewed implementation SHA `0204ab53138ac4a7d17601f6ca4e8b5eaa30301f`. Base `main` remains unchanged.  
**Scope:** #13 / #14 / #15 / #16 only. [Plan](../superpowers/plans/2026-11-23-arch-improvement-cycle-7-pr25.md), [canonical loop](https://github.com/VanDalkvist/arch-improvement-skills/blob/main/skills/arch-improvement-loop/SKILL.md), [arch-rules baseline](https://github.com/ai-meatbags/arch-rules/blob/main/arch-rules.md).

> **Overall gate: VERDICT: FAIL / BLOCKED** — the full unit/typecheck/build and compiled-browser suites have not been executed on this SHA, and the black-box S9b product circuit cannot be claimed from source inspection. This is a documented architectural review and repair, **not** a false green or approval to merge.

## S0–S3: State checkpoints

- S0: exact PR #25 head and main base obtained through authenticated GitHub, no local repo clone; changes confined to the existing PR feature branch.
- S1: memory replay from `docs/arch-improvement/ledger.md` cycles 1–6; all prior browser PASS counts belong to **earlier commits** and do not carry forward.
- S2: stage **prod** (public React library and showcase); runtime entrypoint `index.html` / `showcase.html` -> `src/showcase/main.tsx` -> `Showcase` -> `ShowcaseHeader`/`ComponentCatalog` -> the public exports `SegmentedControl`/`ThemeToggle`; optional browser QA -> `bun run build` -> `vite preview` -> Playwright. Critical AP-011/012/020/025/046/074/075/076, baseline AP-028/054/056/057/068/069. DB/auth/tenant rules not applicable. Library source-distribution remains in separate issue #18.
- S3: the user already approved #13–16 as one PR and asked to review this solution. The repair is confined to acceptance/testing. API migration, release/tag and actual merge remain explicitly unapproved.
- S4/S5: see findings and triage below. S6 written [plan](../superpowers/plans/2026-11-23-arch-improvement-cycle-7-pr25.md). S7 critical plan review rejected a dev-server-only browser gate and tautological receipt-only assertions. S8 bounded fixes landed in the same feature branch. S9 remains FAIL. S10 ledger and S11 memory are recorded separately. S12 STOP until the environment can run the true checks.

## Architecture: four mandatory semantic probes (S9a source review)

| Probe | Source evidence | Verdict |
| --- | --- | --- |
| 1. Dependency traceability, AP-074/076 | `src/showcase/ComponentCatalog.tsx` actually wires `setTabMode` to visible panels, `src/components/ThemeToggle.tsx` calls `useTheme().setTheme`, `src/showcase/ShowcaseHeader.tsx` uses `useActiveShowcaseSection`. No injected but never-invoked infrastructure port introduced | **Source supported; runtime unverified** |
| 2. Split brain/runtime completeness | `src/components/SegmentedControl.tsx` is the sole exported implementation via `src/index.ts`; `EnergyRadar` also uses it, no new parallel filter engine. Old tests expecting pseudo-tabs were updated and real tab panel specimen added in `ComponentCatalog` | **Source supported; external consumers unverified** |
| 3. Entry point wiring, AP-020/075 | Real HTML files mount `src/showcase/main.tsx` -> `Showcase`. Browser gate initially used `bun run dev` (not a release surface); **repaired** in `browser-qa/playwright.config.ts` to `bun run build && bun run preview`, serving compiled `dist/` over localhost. Root `package.json` exposes `preview` | **Corrected in code; not executed** |
| 4. Anti-hollow/AP-076 | Browser assertions now check user-visible counter and pending/error/success output; slider input **and wave event --event-x**, active section after scroll, opened drawer content/focus, and both independent scroll offsets. The same right-edge hit-test oracle is exercised by a deliberate covering-overlay *negative control* | **Substantive oracles in source; red/green not observed** |

**Architecture contract caveats:** `SegmentedControl` default changed from implicit tabs to `filters`. This is **breaking ARIA semantics** (AP-046); doc/changelog correctly marks migration, but no compatibility proof from all consumers or version release exists. `ThemeToggle.leaveMenu` uses a manually assembled document-wide focus list, which may not exactly match native sequential focus for unusual controls, portals, Shadow DOM or positive tabIndex. The new browser tests verify ordinary adjacent controls; independent real browser confirmation remains mandatory.

## Findings and S5 triage

| ID | Severity | What was wrong | Decision | State |
| --- | --- | --- | --- | --- |
| F1 | P1 · AP-076 | Browser `07` claimed no false success while asserting only style and status marker | fix-now | **Replaced** with observable counter 0→1→2, plus pending→error / reset→pending→explicit success |
| F2 | P1 · AP-056/076 | Browser hit-test checked slider centre only *after* scrolling | fix-now | **Replaced** with initial screenshot, three horizontal hit points, actual pointer change, a negative-control right-side blocker |
| F3 | P1 · AP-075 | Browser gate used Vite dev server, bypassing production compilation/prerender | fix-now | **Corrected** webServer to full build + preview; still NOT_RUN |
| F4 | P2 · AP-056 | Missing browser Shift+Tab, tabpanel focus/content, manual section scroll and two-way independent scroll | fix-now | **Added** actual state assertions |
| F5 | P2 · AP-057 | CSS hover/press assertion susceptible to transition timing | fix-now | **Corrected**: reduced-motion mode plus computed :active and background, followed by click outcome |
| F6 | P2 · AP-056 | Theme default/persistence verified only in component tests | fix-now | **Added** cold-start system dark → explicit light → reload proof |
| F7 | P2 · AP-057 | Browser QA lacks generated transitive `package-lock.json`; exact `@playwright/test` version 1.65.1 is pinned, but install is not fully reproducible | blocked | Must run `npm install`, inspect+commit lockfile in a real checkout, then use `npm ci` |
| F8 | P1 · AP-075/076 | No executed compiled browser run, screenshot review or real S9b black-box journeys | blocked | Keep draft / no merge / no UI_VERIFIED until run |
| F9 | P2 · AP-046 | Public default semantics change from tabs to filters | blocked for release | Do not tag or upgrade consumers before deliberate release/migration acceptance |
| F10 | P3 | Older `tests/interaction-states.test.tsx` compares CSS source substrings | log-only | Keep as a lightweight static contract smoke, **never** count as browser behavior |

**Correction made during review:** the `07` action is `variant="outline"`, *not* `text`. Comparing its computed background on pressed state is appropriate; the defect was missing observable outcome and transition determinism. Source: `src/showcase/ComponentCatalog.tsx:69`, `src/tokens.css` hover and active rules.

## Test completeness by *risk*, not number of assertions

At reviewed SHA, the new `tests/apg-navigation.test.tsx` declares **9 focused unit cases**. The browser suite has **11 declared scenarios** with a 3-viewports × 2-themes parameterized hero: **16 expected Chromium executions**. This count is based on code, **none are claimed run**. Existing unit/source-pattern tests outside this PR are not counted as new coverage.

| User-observable risk | Positive assertion | Negative/control observation | Remaining hole |
| --- | --- | --- | --- |
| Slider covered by help control | `elementFromPoint` at 15%/50%/85%, before scroll if visible; real value and SineWave `--event-x` move | A synthetic fixed right-side blocker must make the 85% sample fail and leave 15%/50% intact; then restored | Actual 200% native zoom and human first-screen visual sign-off missing |
| Pseudo-tabs / keyboard trapping | group buttons `aria-pressed`; real `tab` arrow/Home/End, skip disabled, focus actual visible `tabpanel` | Unit shows wrong role or disabled navigation fails | Screen-reader manual check; consumer supplied panels are caller responsibility |
| Theme selection and focus | ArrowUp/Down, Home/End, Escape, Tab **and Shift+Tab** to exact adjacent controls; cold system-theme → user choice → reload | Wrong adjacent focus / theme not persisted must fail | Full Shadow DOM / portal focus topology, forced colors in actual browser unverified |
| Active section stale after scroll/back | User scroll without click, deep link, Back/Forward, nested workspace → parent catalogue, exactly one `aria-current` | Removing scroll observer should fail manual-scroll scenario | Real visual viewport zoom and rapid anchor-scroll sequencing unverified |
| Drawer receipts without real content | After click: actual dialog title + body, Escape and return focus to opener | Empty dialog now fails | Modal screen-reader and assistive-tech sanity not executed |
| Fake action success | Counter increments visibly 1→2; separate pending/error and deliberate success; pressed background uses real CSS in reduced motion | Immediate fake success fails pending/error journey | No actual network operation: these are intentionally local interactive examples |
| Scroll ownership coupling | Scroll left keeps right stable; scroll right keeps left stable; scroll left back still keeps right | A shared scroll container should fail | Mobile stack composition and wheel/touch tested only after run |

### Mutation / falsification matrix

These are **predictive assertions from reviewing the tests**, not executed mutant runs:

1. Delete SegmentedControl `onChange` -> tab selected state and visible panel/callback tests should fail.
2. Remove `aria-controls` -> unit contract + browser control/panel ID comparison should fail.
3. Break disabled skip -> unit ArrowRight expected `Атлас` focus should fail.
4. Remove ThemeToggle Tab or Shift+Tab -> exact adjacent control focus tests should fail.
5. Remove showcase scroll observer -> manual-scroll current-location test should fail despite hash links.
6. Disconnect Scene slider from wave `events` -> `--event-x` test should fail even if input changes.
7. Put an intercepting element over slider right edge -> negative-control probe must observe `interactable=false`.
8. Force success on initial submit -> pending-status and error-path assertions should fail.
9. Remove drawer content or focus return -> dialog body/focus assertions should fail.
10. Tie reader scroll to list scroll -> independent-owner offset assertions should fail.

**Only mutant #7 is implemented as a falsification control in the test suite. No mutant has been executed in Chromium here.** Do not represent this matrix as a mutation score.

## S9b Product Reviewer: strict black-box surface

The review skill requires real compiled/public paths and prohibits using source inspection as a substitute.

- **Happy:** open compiled showcase, move slider and see wave, choose a theme, switch tabs, move between sections. **NOT_EXECUTED**.
- **Cold/empty:** fresh origin with no saved theme / system preference, no selected tab data. **NOT_EXECUTED**.
- **Recovery/edge:** Escape from dialog, keyboard menu exit, malformed fragment, zoom, temporary obstruction, reduced motion. **NOT_EXECUTED**.
- S9b **VERDICT: FAIL (missing execution evidence)**. No fake invocation of an independent agent/reviewer is claimed.

## S9 stop / verification commands

The local shell cannot resolve GitHub to clone this repository, the authenticated GitHub connector cannot run the repo's Bun/Playwright process, and Cloudflare's existing production build trigger includes a deploy. A safe isolated preview build was unavailable. This is an environment **blocker**, not a test PASS or source-code failure.

Run from checked-out PR commit:

```sh
bun install --frozen-lockfile
bun run test
bunx tsc --noEmit -p tsconfig.build.json
bun run build
npm --prefix browser-qa install
npm --prefix browser-qa exec -- playwright install chromium
npm run test:browser
```

Then inspect `browser-qa/artifacts/report/index.html` and its screenshots, commit generated subpackage lockfile, rerun using `npm --prefix browser-qa ci`, and save reviewed visual evidence under `docs/verification/<verified-sha>/`. Only then may S9a and independently observed S9b be reconsidered. **Do not merge, close issues #13–16, mark UI_VERIFIED, or publish a release solely from this source review.**

## S10 / S11 learning

See [cycle 7 ledger](../arch-improvement/ledger.md) and [project memory](../arch-improvement/memory.md). Durable lesson: executable assertions need at least one observable downstream change and one negative control around original failure modes. A compiled-surface walking skeleton must precede claims about E2E readiness; fixture/mock or dev-only success is not sufficient.
