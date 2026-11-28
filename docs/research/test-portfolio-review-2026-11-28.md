# Test portfolio review — 2026-11-28

## S0–S4: context and scope

Owner asks to review all tests, especially 176 visual snapshots. Reviewed source at [fe6ff676e6c6f48284f0ba57deca576cb3667cae](https://github.com/VanDalkvist/vanya-ui/tree/fe6ff676e6c6f48284f0ba57deca576cb3667cae), production 3.0.0 at 8fc08b24a40e978bf2d4e0900069f1488baf0ca0. Workflow revision arch-improvement-skills@eeda1921e0cace214c2e04306db4e1dce82bb300; existing AGENTS, Regression Gate, memory and Release Integrity. Scope review/triage only; no source test deletion, no run, no production changes. All 59 *.test/spec files fetched at exact revision, scenario inventory reviewed; detailed assertion-level inspection of overlaps and critical oracles, not exhaustive manual proof of every assertion. Independent circuits unavailable. Local worktree not accessed. Prior production receipt: 156 Vitest, 55 Node, 3 harness E2E, 140 functional browser, 8 opt-in visual contexts; additional design-lint fixture/self-tests and consumer smoke. File counts: 30 Vitest, 17 browser specs, 12 Node .mjs including one manual Action contract. Source count not a fresh runner count.

Architecture map: Vitest tests portable component contracts; Node tests package/CLI/publication/manifest contracts; real-browser suite owns actual interaction, layout, focus, scroll and computed CSS; Playwright visual oracle owns pixel regression; manual review owns intended design; cloudflare-deploy owns execution/storage configuration, not the test policy. Existing R2 proven for two artifacts, no reason to enlarge storage infrastructure before reducing the matrix. AP-076 real outcome and negative-control evidence remain.

## S4/S5 findings, impact and decisions

- **P2 / planned, owner decision on visual policy:** Cartesian matrix oversamples low-risk combinations. `browser-qa/visual-baseline.mjs:5–10` declares 20 anchors + 2 dialogs, 4 widths × 2 themes; `composition-visual.spec.ts:8–20,39–43` captures viewport for every scene, no differentiated risk profile. 176 images per version, up to 352 distinct originals in a pair. Repeated header and viewport context inflate diffs (prior strict comparison 163/176 different); structural checks already cover all 4 widths. Extra images still protect some CSS regressions, so coverage removal needs measured validation. Propose risk-profile 56 as below, full profile retained for broad layout/token changes, no silent rebaseline.
- **P2 / planned:** screenshot scope gaps. `composition-visual.spec.ts:24–43` scrolls anchor then page screenshot; 900px viewport cannot establish entire tall chapter; first hero and actual /agents/ page absent from 22 scenes. Add deliberate hero + /agents/ contexts, separate visual smoke of open/high-risk states, retain real interactions. Do not claim component-complete visual coverage.
- **P2 / planned:** visual artifact provenance and oracle test gap. `visual-cloud-report.mjs` sets candidate to baseline when status matched. That's a useful comparison preview, but actual candidate bytes not retained for matched cases; maxDiffPixels=0 uses Playwright's default perceptual threshold (not byte equality). No dedicated visual-cloud-report test in inventory. Preserve actual baseline/candidate origins and native diff status; explicitly label reused reference if no candidate original. Test missing/duplicate receipt, wrong side/hash, matched reference labeling and incompleteness before export. Never mark a reference copy as original candidate.
- **P2 / planned:** `composition-regression.spec.ts:83–98` collects per-row overflow boolean but never asserts it; root scrollWidth can pass while an internal row clips content. Add explicit negative control with clipping/overflowing row and assert intended row overflow contract (exclude deliberately scrollable named subregions by documented semantic boundary). Also `new-tab-links.spec.ts:13–16` calls link.focus() after Tab, so popup test does not prove keyboard reachability of that link; retain popup destination test and add real Tab traversal from a known reachable predecessor with bounded steps and focus-visible evidence. Native browser regression negative probes protect these repairs.
- **P2 / planned:** fragile oracles pin raw CSS syntax in `tests/interaction-states.test.tsx:13–37,118–124`, `press-feedback.test.tsx:13–22`, `header-hierarchy.test.tsx:21–44,54–60`. Equivalent CSS formatting/refactor may fail, ineffective rule can remain in text and pass. Preserve structural shared-token/slot invariants where intentional; move presentation claims to computed browser assertions already present, add missing pointer/reduced-motion check. Exact public CSS token names and export checks remain valid.
- **P3 / log-only until mutation evidence:** same-level duplicates: CraftCard activation in `press-feedback.test.tsx:53–67` and `craft-card.test.tsx:8–41`; consolidate into CraftCard owner test with explicit opt-out, no-handler, repeat key, nested independent action and callback counts. `ui-contract.spec.ts:245–264` desktop independent scroll overlaps `composition-regression.spec.ts:159–218` (preserve initial scroll restoration after left reset from old test); merge invariant into canonical workspace scenario. `quiet-controls.spec.ts:39–53` and `new-tab-links.spec.ts:64–76` confirmation action repeats; retain inspector edits + single confirmation state/geometry test. Link hover broad sweep and focused neighbor geometry overlap partially; preserve actual popup, real keyboard path, external marker semantics and neighbor movement check; sample canonical link variants in both themes for hover, retain all-link destination/marker census. `ui-contract.spec.ts:320–335` CSS zoom approximation has unique hero/reduced motion/removed hotkeys assertions; native zoom test covers filter/search and DPR, preserve both unique outcomes before consolidating. No blind deletion.
- **P3 / log-only:** test suite cost not measured per file; `cloudflare-browser.sh:8–14` runs root typecheck also invoked by package test; browser adapter always prepares Chromium and APT, each Playwright local run builds compiled site. Consumer smoke performs real repeated builds/lint for negative tests. Separate timing/receipt per stage; remove repeat root typecheck only if exact-SHA preflight known in same gate, keep standalone invocation correct. Optimize tool preparation/cache only with real timing evidence. No estimates of wall time savings claimed.

VERDICT: review findings open; no claim of defect-free suite. Product runtime previously green, no newly observed product failure. Review uses [Playwright best practices](https://playwright.dev/docs/best-practices) and [visual comparisons](https://playwright.dev/docs/test-snapshots): visible outcomes, isolated tests, identical rendering environment, explicit snapshots and tolerance.

## Test inventory disposition (all 59 files)

### Vitest 30
| File under tests/ (extension omitted) | Decision / unique contract |
|---|---|
| agent-page, agent-section | Keep scoped prompt/clipboard routing, error/fallback; browser actual clipboard separately. |
| apg-navigation | Keep controlled tab recovery, disabled/all-unavailable, roving focus, menu, navigation pure rules. |
| branding, identity | Keep public identity and approved mark contracts; combine same assertion only if demonstrated. |
| component-sizes | Keep supported size API + basic outcome; visual height tested separately. |
| composition | Keep chapter anchor contract; check shared layout in browser. |
| craft-card | Canonical callback/opt-out/nested events owner. |
| crawler-docs, licenses, registry-sync, token-reference | Keep generated corpus, license, registry and exact public token/export contracts. |
| filter-select, filter-toolbar | Keep selection/portal/disabled/dynamic/filter semantics; replace private CSS syntax tests where computed oracle exists. |
| footer, header-hierarchy | Keep author destination, accessible links, actual structure; consolidate raw CSS assertions into relevant browser presentation checks. |
| interaction-states, press-feedback | Keep state transitions, disabled callbacks, Minimap keyboard, disclosure state; consolidate repeated CraftCard, replace redundant CSS strings. |
| navigation-guidelines, utility-links, shortcuts | Keep route/redirect, safe link attributes, target markers, semantic shortcuts/absence of global interception. Consolidate overlapping same-level assertions only. |
| passive-labels, quiet-controls | Keep no accidental interaction, actual controlled changes, labels and validation. |
| primitives | Keep smoke for primitives without dedicated tests; trim repeated generic render assertions only after coverage mapping. |
| refinements | Keep category caller identity, theme sync, registry specimen contract; audit overlap with registry-sync. |
| showcase | Keep component-level modal content/focus ownership; native browser lifecycle separately. |
| skeleton | Keep accessibility, shape/dimension/reduced-motion contracts; test rendered behavior when moving CSS assertions. |
| typography-writing | Keep role and bilingual/editorial attribution/public copy contract; browser rendered fonts independently. |
| wave-events | Keep reference coordinates, weight radii, controls, invalid input and passive/active semantics. |
| workspace-primitives | Keep public slots, breadcrumbs, unknown cost, scroll regions, modal stack lifecycle, consumer control ownership. |

### Browser 17
| File under browser-qa/tests/ | Decision |
|---|---|
| accessibility | KEEP actual axe scopes, incomplete findings separately, negative oracle, SVG contrast and forced colors. |
| active-navigation | KEEP history/deep links/clamped header + native clearance; 4 responsive widths matter. |
| agent-section | KEEP real clipboard success/failure, links, responsive UX; inspect overlap in geometry combinations. |
| composition-regression | KEEP broad geometry/link/scroll/function gate; fix overflow/keyboard and absorb duplicate desktop scroll. |
| composition-visual | Replace default Cartesian with explicit risk coverage subject to validation; full profile for broad changes. |
| craft-card | KEEP actual compiled user activation and independent controls. |
| divider-composition | KEEP computed border ownership, avoid replacing with pixel snapshots alone. |
| dynamic-tabs | KEEP real controlled props and native focus reconciliation. |
| hero-initial-frame | KEEP delayed hydration and no-script oracle, independent of static screenshots. |
| native-zoom | KEEP actual Chrome zoom 200%, DPR and keyboard in both themes. |
| new-tab-links | KEEP actual popup/destination, neighbor geometry and focus; move form/confirmation duplicates into owner scenarios after assertions preserved. |
| quiet-controls | KEEP actual save/cancel, filters, status/action and computed geometry, responsive version label; consolidate overlaps. |
| quiet-search | KEEP actual filtered results, clear/focus and geometry. |
| stable-geometry | KEEP all six real states + SVG series and negative controls at responsive extremes; test whether pure geometry can use fewer theme repeats. |
| stacked-dialogs | KEEP real nested modal and outer-first removal, native inert/lock/focus. |
| typography | KEEP loaded bilingual fonts, roles and computed metrics, sample themes by actual risk. |
| ui-contract | KEEP hero hit-test and falsification, current section history, APG, real pending/error/success, unique zoom/hotkeys; consolidate duplicated scroll and only fully repeated navigation/modal checks. |

### Node 12 and additional executed stages
| Path | Decision |
|---|---|
| .github/actions/ui-contract/check.test.mjs | KEEP manual adapter contract. |
| browser-qa/visual-baseline.test.mjs | KEEP negative integrity cases; extend profile identity/completeness and tamper checks. |
| scripts/bootstrap-ui-pipeline.test.mjs | KEEP portable bootstrap without git/CI mutation. |
| scripts/check-built-ui.test.mjs | KEEP actual compiled CSS oracle. |
| scripts/check-llm-publication.test.mjs | KEEP public corpus routing/inventory. |
| scripts/check-release.test.mjs | KEEP SemVer, install lock binding, consumer fixtures, compiled CSS negatives. |
| scripts/design-harness.e2e.test.mjs | KEEP actual lint/adopt/verify/negative debt. |
| scripts/design-lint-baseline.test.mjs | KEEP all four matcher tests (invoked via design-lint-pilot, not root Node list). |
| scripts/finalize-published-licenses.test.mjs | KEEP exact license/pin rejection cases. |
| scripts/install-ui-contract.test.mjs | KEEP immutable pin and preservation. |
| scripts/markdown-publication.test.mjs | KEEP canonical link rewrites/source, missing references. |
| scripts/ui-pipeline.test.mjs | KEEP CLI contract/receipts/monorepo/invalid inputs and no fake gate. |
| scripts/consumer-smoke.mjs | KEEP two actual installed-package combinations: npm/React18, Bun/React19, exact SHA, CSS/CLI/types/client/SSR and negative tests. Optional consumer browser remains separate and not claimed by --harness alone. |
| scripts/design-lint-pilot.mjs | KEEP actual frozen lint, component inventory coverage, positive/negative fixtures. |
| root typecheck/build/publication checks | KEEP public outputs/compiled fixture checks; dedupe repeated same-SHA preflight only with proof. |

## S5 proposal — default visual profile (56 captures; 68.2% fewer than 176)

Explicit scenes × contexts, 52 retained existing scene/context pairs + 4 new pairs. Every old scene retained at least once; actual user flows remain independently checked. Default profile proposal, not implemented or approved.

| context | scenes | count |
|---|---|---:|
| light 1440 | all original 22 | 22 |
| light 390 | typography, writing, catalog, workspace, agents, compact-filter-toolbar, quiet-editor, workspace-overview, workspace-context-header, composition-reading-inspector, inspector-open, digest-open | 12 |
| dark 1440 | identity, typography, catalog, quiet-editor, categories, status, inspector-open, digest-open | 8 |
| dark 390 | compact-filter-toolbar, quiet-editor, workspace-overview, workspace-context-header, inspector-open, digest-open | 6 |
| light 1024 | workspace-overview, workspace-context-header | 2 |
| dark 320 | compact-filter-toolbar, digest-open | 2 |
| new hero | light 1440, light 390, deterministic measured ready-state | 2 |
| new /agents/ actual route | dark 1440, light 390 | 2 |
| total | | 56 |

Maintain optional exhaustive original profile for global tokens, breakpoints, header/typography/composition primitives, major changes and explicit risk escalation. For ordinary small changes select affected and adjacent scenes + default smoke. Add targeted state/section locator captures when a component/state otherwise falls outside viewport; no blanket mask/tolerance change. Preserve exact pinned browser/OS/fonts, source SHA and sealed profile ID; compare candidate against same profile and expected scene set, reject missing/extra/corrupt images. Existing full manifest remains historical. A 56-capture profile means 112 potential originals per comparison (plus actual diffs), vs 352; only after actual new capture and acceptance. Reduced profile isn't evidence of equivalent coverage until experiments.

## Next bounded slice (S6 entry after decision)
1. Baseline: inventory actual durations from prior exact release logs or run one full functional/visual control when necessary; preserve negative prior evidence. No full matrix upload before profile decision.
2. Build canonical explicit visual scene/context contract and manifest tests first; full profile still reproduces old matrix. Test missing/extra keys, duplicate, profile mismatch, changed bytes and no automatic approval. Add direct hero/agents route captures with actual page identity and state. Repair report provenance and scoped transport.
3. Test reduced vs full on same exact source and environment using a small independent mutation panel: wrong mobile workspace breakpoint, hidden header link, dark badge contrast, nested modal escape/focus, shifted shared axis, clipped internal content, wrong hover/pressed state, disconnected CSS and corrupt golden. Require selected visual or functional oracle to detect each with meaningful failure; restore exact code. Native negative-control evidence required, no cosmetic coverage percentages.
4. Consolidate only confirmed duplicates within the same layer after mapping unique assertions; keep all high-value semantic contracts, source package checks, native browser and actual consumer build. Recount collected tests and timing; no arbitrary test-count target.
5. Run exact final functional gate once; compare chosen visual profile, persist verified originals/manifest in private R2 through scoped build transport; independent arch/product/design review, actual baseline approval. No production release, package bump or provider edits required for internal test-only changes. Published documentation changes follow project version policy.

## Boundaries
No tests executed in this review, no new test implementation, no source/UI edits or baseline approval. Review based on source inventory and detailed selected oracles; complete case-by-case mutation coverage remains unverified. User goal is a lean reliable suite; direct S3 credential and independent reviewer still open from Release Integrity.
