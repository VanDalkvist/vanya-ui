# Browser and release acceptance — #17 / #18 / #19

## Cycle 32 — 0.4.1

Baseline 0.4.0 `4bcb4b824e74c09a0273ef05c451ec2dde38e023`. Owner approved the desktop editorial/divider design and mobile appearance; that approval is scoped to visual review. Exact-head real-browser acceptance remains pending.

Source finding: horizontal zero-value SVG polyline can have a zero-height geometry box despite a visible stroke. In an isolated local Chromium fixture with the exact zero-series points, getBBox().height=0, getTotalLength()=276; computed stroke oracle true; display:none false; restored true. This was an isolated fixture, not the production React application. Replaced the fragile series visibility assertion with visible SVG, computed stroke, positive path length, exact points and visible marker coordinates; added hide/restore negative control. Added #21 specimen to existing axe scope. No production UI change in this cycle.

## Evidence and remaining execution
- 0.3.29 exact SHA `c9ee6a107fe0c292d6f70a3ebbabb4b3b31ff9b5`: Cloudflare build successful, 119 Vitest and 23 Node tests, 17 public references. Historical evidence only.
- 0.4.0/0.4.1: new exact-head build and browser receipts required. Browser suite, real glyph checks, divider checks, keyboard/contrast and screen reader remain NOT_VERIFIED until executed. Do not infer them from visual acceptance or unit tests. Owner cancelled separate full mobile audit #27.
- Local environment check: Node 22.16.0 and npm 10.9.2 available; Bun missing and DNS lookups for GitHub, codeload, npm registry failed. Local Chromium can exercise isolated fixtures. Full dependency install and actual app browser run BLOCKED in this environment. Earlier remote browser rendering hit rate limit; no retry before provider cooldown. Existing manual consumer smoke remains the supported release route.
- Release tag requires exact SHA with verified build, types, browser and consumer matrix; existing connector does not expose tag creation. No tag created; no new workflow or automated consumer update.

## Manual commands on a networked machine

```sh
bun install --frozen-lockfile
bun run test
bunx tsc --noEmit -p tsconfig.build.json
bun run build
npm --prefix browser-qa install
npm --prefix browser-qa exec -- playwright install chromium
npm run test:browser
npm run test:consumer -- "$(git rev-parse HEAD)"
```

Review browser lockfile and receipts, use exact SHA, and follow [release process](../versioning.md) before creating an immutable tag. Keep private raw logs local.

## Cycle 33 — local production acceptance, 2026-11-25

Baseline: `0cee760c6aebaf5d3db57628128384d27137266a`. The historical environment block above no longer describes this run. Work is directly on main, without subagents, PRs, new workflows or consumer application changes. This is an author self-check, **not independent review**.

### Decision and boundaries

Freeze the existing, previously untagged **0.4.1**. These are compatible accessibility/QA fixes, not another API expansion; the earlier intentional CraftCard change is already documented under 0.4.0 with migration notes. An immutable annotated `v0.4.1` may be created only after the candidate's exact-SHA consumer matrix and its own successful Cloudflare build. A follow-up evidence-only commit records the full candidate SHA without moving the tag. No npm publication or dependent-product update is implied.

### Findings and fix decisions

- **[P1]** Evidence: scoped axe found FilterSelect `label-content-name-mismatch` in both themes. Impact: the spoken name did not match the visible label/value. Rule: **AP-069**. Fix decision: use the visible spans via `aria-labelledby`, with explicit whitespace (`src/components/FilterSelect.tsx:134`). Four unit cases failed with the corrected name before the fix, then passed; axe passes without suppressed rules.
- **[P1]** Evidence: dark selected theme-menu text measured **4.13:1**, below 4.5:1. Impact: small selected text was insufficiently legible. Rule: **AP-054, AP-069**. Fix decision: mix selected fill with the real `--ground` token and remove the hover override (`src/tokens.css`, selected feedback-row rules). Assert the computed fill is nontransparent; axe verifies both themes. An intermediate invalid `--paper` attempt was rejected rather than accepted as an apparent green.
- **[P1]** Evidence: native Chromium 200% keyboard opening left focus on the trigger; the searchable popup was present but unfocused. Impact: keyboard navigation did not enter the popup. Rule: **AP-069**. Fix decision: focus only after the positioned portal becomes visible (`src/components/FilterSelect.tsx:101–108`). The real-browser case failed before this change and passes afterward; jsdom alone had missed it.
- **[P2]** Evidence: axe incomplete `aria-prohibited-attr` on the labelled generic result-count span. Impact: its label had no supported semantic role. Rule: **AP-069**. Fix decision: give SectionToolbar's counter `role="status"` (`src/components/SectionToolbar.tsx:21`); unit checks the actual role, and the final axe scan no longer reports this incomplete.
- **[P2]** Evidence: visual review of dark forced-colors output showed faint SVG axis labels on the system's white background. Impact: label colors did not follow the system palette. Rule: **AP-054, AP-069**. Fix decision: `svg text { fill: CanvasText }` only inside forced-colors; both theme tests require the actual computed system text color. Default-theme SVG text contrast is independently measured after resolving Oklch through Canvas2D.

### Semantic probes

1. **Dependency traceability — PASS.** No infrastructure port or service is introduced. The existing injected React callback is declared at `FilterSelect.tsx:10` and actually invoked at `:77`; the production caller supplies `setToolbarGenre` at `src/showcase/ComponentCatalog.tsx:147`. The QA fixture imports the real SegmentedControl, not a substitute implementation.
2. **Runtime completeness / split brain — PASS.** No module migration or duplicate production implementation. The changed test imports resolve to the same component sources exported by `src/index.ts:106,126`. Generated publication output is distinguished from source; no legacy parallel component was added.
3. **Entrypoint wiring — PASS.** `src/showcase/main.tsx:5–9` mounts/hydrates Showcase; `Showcase.tsx:7,23` renders ComponentCatalog; `ComponentCatalog.tsx:147,154` uses the corrected components. Playwright builds and serves compiled `dist/`, not a dev-only application. Dynamic-tab and extension fixtures remain QA-only.
4. **Anti-gaming / implementation completeness — PASS.** No product logic or error handling was removed to satisfy line limits. Real keyboard focus, selection, connected panels, geometry and accessible names are asserted; native zoom checks the browser's own zoom plus viewport/DPR, not CSS scaling. Axe's deliberately unnamed-slider negative control remains active. Incomplete results are triaged below, not counted as successful rules.

**Architecture verification:** Passed AP-020, AP-028, AP-054, AP-069, AP-075, AP-076. AP-074 introduces no new infrastructure injection and was checked as above. No open P0/P1/P2 finding in this bounded change. Residual risk: manual screen-reader operation and non-Chromium engines are not verified. This is not accessibility certification.

### Reproduction and evidence policy

Node 26.13.1, npm 11.20.0, Bun 1.4.4; Playwright 1.65.1, axe 4.14.1, Chromium 159.0.8154.6 / build 1255. QA lock SHA-256: `ce8ed8a2acc3599c81377b2825c96ce74ce375d67ec675a5a14717bda39687d6`.

```sh
bun install --frozen-lockfile
bun run test
bunx tsc --noEmit -p tsconfig.build.json
npm --prefix browser-qa ci
npm --prefix browser-qa exec -- playwright install chromium --no-shell
node scripts/ui-pipeline.mjs inspect --project . --mode visual
node scripts/ui-pipeline.mjs check --project . --mode visual
node scripts/ui-pipeline.mjs verify --project . --mode visual
# Faster equivalent full browser rerun; still builds the production application:
npm --prefix browser-qa run test -- --workers=2
npm run test:consumer -- <full-candidate-SHA>
```

The generic pipeline's automatic React-consumer check fails on the library itself because it has no dependency on its own package. This was observed, not hidden. Explicit `visual` mode is used for the library authoring repository: it still runs the complete production build and browser script, with no skipped browser gate. Real npm/Bun consumers separately prove the pinned package contract.

Visual review covers 390/1024/1440 in light/dark, Cyrillic typography and composition. A separate interactive browser-tool pass verified FilterSelect ArrowDown → search focus → Escape → trigger, and theme-menu ArrowDown/End → system item → Escape → trigger. Native 200% uses an isolated temporary profile and the supported `chrome.tabs.setZoom`, verifies 1440→720 CSS px and DPR 1→2, both themes, input and focus behavior. Native screenshots are taken at the top after an instant scroll reset: Chromium's scrolled native-zoom capture produced blank images despite populated hit-tests, which were rejected as visual evidence. No arbitrary sleep or CSS-zoom substitution is used.

Axe controls/menu/drawer scans are retained in ignored local JSON/HTML artifacts. Remaining controls incompletes are reviewed explicitly: 12 SVG axis-label contrast nodes are checked numerically against the actual ground; three decorative, `aria-hidden` artwork glyphs are not text labels; three icon-only artwork links have the corresponding title as their accessible name, with no meaningful visible text label to compare. Those decorative cases are **not applicable**, not suppressed axe rules. Open-menu/drawer incompletes are empty in both themes.

**Manual screen reader: NOT_VERIFIED. Non-Chromium: NOT_RUN.** Forced-colors/reduced-motion results are Chromium media emulation, not a physical Windows/assistive-technology session. Exact candidate SHA, final counts, consumer receipts and build/tag read-back are recorded in the candidate's `docs/verification/<SHA>/` follow-up receipt; this section alone does not authorize a tag.
