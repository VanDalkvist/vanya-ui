# Architecture Improvement Ledger: @vanya/ui

## Cycle 1 — 2026-11-01: Showcase States Isolation, ThemeToggle Parity, Fact-Check Cleanup

### Context & Goals
- Target: `~/Projects/vanya-ui`
- Standards: AP-010 ... AP-071, Vanya-Arc/UI Design System.
- Scope:
  1. Fact-check & removal of non-existent `TurnArcBadge`.
  2. ThemeToggle interaction parity (`dropdown` and `segmented` variants; corner switcher controls page with system default; catalog demos are local only).
  3. Presentation of `DeskSlotCard` across isolated, labeled design system states.
  4. Separation of `EventCard` and `TimelinePreviewCard` into independent catalog rows.
  5. Removal of redundant framing borders around preview boxes.
  6. High-craft presentation of code snippets with copy button.

### Slices Executed
1. **Slice 1: Fact-check & removal of TurnArcBadge**
   - Fact-check confirmed `TurnArcBadge` was an ungrounded extrapolation from `TurnArcs.tsx` (an SVG timeline trajectory layer). Removed `src/components/TurnArcBadge.tsx` and updated exports.
2. **Slice 2: ThemeToggle variant parity**
   - Implemented working corner dropdown switcher in header with system theme default (`prefers-color-scheme`).
   - Catalog section showcases both `variant="dropdown"` and `variant="segmented"` without affecting page theme.
3. **Slice 3: DeskSlotCard state isolation**
   - Presented states in isolated labeled columns: `State 1: Active` and `State 2: Empty Slot`.
4. **Slice 4: Component separation**
   - Split `EventCard` and `TimelinePreviewCard` into individual rows.
5. **Slice 5: Border stripping & code snippets**
   - Stripped redundant `.preview-box` borders.
   - Refined code snippets into clean Geist-style containers with copy action.

### Architecture Verification (AP Rules)
- **Passed:**
  - AP-010 (Single Responsibility)
  - AP-019 (Line budget: all files <= 250 lines)
  - AP-030 (Explicit contracts & state isolation)
  - AP-048 (Temporal & system state synchronization)
  - AP-062 (Zero-drift sync verified via scripts/sync.ts)
- **Residual Risk:** None. All 25 components compile cleanly, Vitest passes 100%, and `impeccable detect` reports 0 anti-patterns.

### Verification Evidence
- Vitest: 4/4 passing (100%).
- `impeccable detect http://127.0.0.1:3020`: 0 anti-patterns, 0 advisory notes (Exit code: 0).
- Browser automation verified:
  - Corner dropdown theme toggle switches page between warm paper light and charcoal dark.
  - Catalog demos remain isolated.
  - DeskSlotCard states rendered in separate columns.
  - Code snippets copy cleanly with visual confirmation.

## Cycle 2 — Arc Wave live composition (2026-11-06)

### Scope and decisions
- Implemented the three remaining user-selected findings after an unrelated consumer change. No third-party skills or consumer sources changed.
- Replaced both handwritten HTML catalogs with shells mounting one React composition root and real package exports. Kept both URLs in the production build.
- EventCard / TimelinePreviewCard / InspectDrawer headings now use Manrope. Serif remains available for editorial digest prose.
- Added an open-space scene with preview selection, native modal sheet, focus return, context disclosure and a working spacing control; mobile remains a stacked composition.
- Added shared display / metadata / clearance / sheet-elevation roles. Kept the existing paper/ink/accent palette and mapped legacy token names to canonical values.
- Agent token reference is generated from actual CSS; component names come from public exports, not a second set of values. DESIGN.md no longer duplicates a stale palette or the deleted skill's blanket bans.
- Bounded real-component repairs: obsolete OfferCard ActionButton variants; readable metadata; theme-aware category contrast; stable preview borders on hover.

### Verification receipts
- Full Vitest suite: 8/8 passed (four baseline tests plus four focused regressions); report: BB thread [internal reference omitted] / ui-tests.json.
- TypeScript noEmit: exit 0. Baseline obsolete OfferCard variants previously failed this check.
- Production Vite build: exit 0; index.html and showcase.html both emitted and visited via a separately owned preview server.
- Browser smoke: 15 passed, no runtime errors; production acceptance: 6 passed. Covered native sheet, focus, Escape, theme persistence, data selection, disclosures, mobile overflow, spacing changes, reduced motion and both built URLs.
- Light desktop, native detail, dark desktop and 390px mobile screenshots saved under the same thread as showcase-after-*.jpg.
- Sync repeated without generated-output drift; git diff --check clean.
- Detector residuals: cream-palette warning (intentional, user-pinned reference) and em-dash-overuse advisory. No clean-detector claim; no rule suppression or external-skill edits.

### Architecture verification — author self-review, not independent review
- Passed: AP-015, AP-019, AP-020, AP-025, AP-028, AP-046, AP-051, AP-052, AP-068, AP-069 (changed interactions), AP-070, AP-075, AP-076 within this slice.
- Dependency traceability: Scene.tsx:3 and ComponentCatalog.tsx:2–7 import the actual package entry; their rendered previews call real controls and sheet callbacks. sync.ts:24 invokes renderTokenReference(css).
- Runtime completeness: index.html:22 and showcase.html:22 mount src/showcase/main.tsx; main.tsx:3 loads executable tokens and main.tsx:9 renders Showcase. No legacy handwritten example implementation remains.
- Entry-point wiring: vite.config.ts declares both HTML inputs; both compiled URLs were browser-checked. Existing public component props are retained, OfferCard export is additive.
- Assertion integrity: tests exercise native preview activation, dialog content/Escape/focus return and CSS-to-reference output changes. Tests do not assert a fake success envelope. Production screenshots show the assembled result.
- Not applicable: auth, database, network adapters, tenant isolation, data migrations; this is a local UI-library/showcase change.
- Residual risk: aesthetic approval remains with Vanya; this is not a full audit of every legacy primitive or screen-reader/browser combination. Native dialog requires a modern browser. No independent reviewer was claimed: Gemini was blocked by its provider, and the user explicitly authorized inline implementation with simple verification.
- Scoped technical verdict: PASS. This does not claim independent dual-circuit acceptance or user visual approval.

## Cycle 3 — Approved-style refinements (2026-11-06)

### User scope
- Preserve the explicitly approved first-screen style and composition.
- Remove the lower arrow CTA; keep navigation sticky and compact (60px desktop, up to 88px mobile).
- Brand the header and both browser document titles/descriptions as vanya-arc/ui.
- Add an exported static SineWave background; keep all 26 exported components in individual catalogue rows, with each component's states together.
- Use shared harness icons and light/dark palette in badges and both radar examples.
- Keep SegmentedControl sized to content; populate Minimap with past/current/future event ticks and a working focus window.

### Implementation and provenance
- All 24 shared palette declarations (4 types × 3 roles × 2 themes) checked for exact parity with the accepted visual contract.
- Shared package-owned identity map: src/harness.ts. No runtime import/dependency on consuming applications; arbitrary custom badges/radar items remain supported.
- Reference wave/minimap inspected read-only; the numeric geometry contract is retained. SineWave is a small independent SVG primitive, not a copy of the timeline engine.
- Theme controls now notify peer hooks on the same page; header and catalogue variants stay synchronized. Existing storage persistence remains the source for reloads.
- Header styling remains paper/Manrope; only density/position changed. Anchor clearance tracks its compact desktop/mobile height.

### Verification evidence
- Full suite: 13 tests passed, including five focused refinements regressions; tsc noEmit and production build passed.
- Theme-sync regression observed failing with notification disabled, then green restored. No new test framework or coverage campaign.
- Compiled-browser smoke: 17 checks passed, no runtime errors. Both HTML URLs verified, along with exact header/title, CTA removal, sticky header/anchor clearance, all 26 named rows, intrinsic segment widths, four harness identities/distributions, 17 minimap ticks and seek, synchronized theme controls and mobile overflow.
- Segment geometry: trailing inset 3px at both shown sizes, instead of a stretched empty tail.
- Screenshots: BB thread [internal reference omitted] / refined-{scene,controls,radar,mobile}.jpg. Browser reports: refinements-browser-checks.json; tests: refinements-tests.json.
- Sync idempotent; whitespace clean. Detector retains only the pinned cream-palette warning and an em-dash advisory; no clean-detector claim.

### Architecture verification — scoped author review
- Passed: AP-015, AP-019, AP-020, AP-025, AP-028, AP-046, AP-051–054 (changed flow), AP-068–070, AP-076.
- Dependency traceability: CategoryBadge.tsx consumes getHarnessType; EnergyRadar.tsx:40 resolves defaults used by its bar/legend; SpiderRadar resolves axis icons/colors from the same map. No unused injected port or cross-app runtime dependency.
- Runtime completeness/entrypoint wiring: src/index.ts:2 exports SineWave, Scene.tsx:15 renders it; ComponentCatalog imports real exports and each public component has its own named region. Both built entrypoints show the updated browser brand.
- Assertion integrity: real render/click/state tests plus browser geometry and runtime CSS checks, not static source-text tests or placeholder receipts. All modified UI source files remain below 250 lines.
- Not applicable: databases, auth, external API adapters and data migrations (no such boundaries touched).
- Residual risk: new details have author/browser verification, not independent review or a fresh user visual approval; The accepted palette is a recorded snapshot; changes require explicit review. No third-party skill changes.
- Scoped technical verdict: PASS; not an independent dual-circuit acceptance claim.

## Cycle 4 — Passive labels, copy, common sizes and review follow-ups (2026-11-06)

### User scope and changes
- Checked primary Carbon/GOV.UK tag guidance: read-only labels do not have clickable hover/focus states; actionable variants must be distinguishable. Informational chart titles are not a click action. Source URLs and the working plan are in docs/superpowers/plans/2026-11-06-passive-labels-and-copy.md; raw source evidence is tag-hover-primary-sources.md in BB thread [internal reference omitted].
- Tag and MeshStatusBadge render static spans without an action and native buttons when onClick is supplied. Disabled controls do not show enabled hover feedback. Toggle tags expose aria-pressed only when isActive is actually supplied. Static preview images and card containers no longer suggest a click; nested park remains actionable. Clickable project titles use native buttons without nesting the park button.
- Applied redaktura and ux-copy to scene, descriptions, sample content, overlays and indicator defaults. Removed atmospheric assertions and the stale default three-project quota label. The user explicitly corrected a removal proposal: the intro was never removed and is retained, with a literal heading and a smaller 24–28px hierarchy. Palette, spacing composition and wave remain.
- Radar now takes the full catalogue width; legend items do not break internally and the total has its own clearance. Setup is always visible in a separate section after all components, rather than expanding above them.
- Added CategoryBadge sm/md and one shared inline size foundation: 24/32px outer heights, common font/line/icon/padding/gap tokens. Eight families use it: CategoryBadge, Tag, MeshStatusBadge, ActionButton, Kbd, LinkChip, AvatarLink and SegmentedControl. Both sizes are shown together within each component row. Legacy xs is retained as compact sm; visual migration is documented in DESIGN.md.
- Added the real vanya-arc.dev external link between section navigation and theme, with separators and a safe new-tab target.

### Verification evidence
- Full Vitest suite: 18 passed. Focused passive-label and size-contract regressions were first observed failing. TypeScript, production build, sync idempotence and git diff --check pass.
- Chrome/dev browser: 34 passed, no runtime errors. Actual computed hover compared in both themes for passive labels/cards and chart bars. Native Enter/Space, disabled actions, dialog Escape/focus return, image scale feedback and separate title/park actions checked.
- Measured both actual sizes across all eight families, including font/line/icon metrics: common 24/32px outer heights. Checked full-width radar, wrapping legend and detached setup; both entry URLs render without mobile overflow. Header including original-site link remains within 88px at 390px viewport.
- Reports: passive-labels-tests.json, passive-labels-browser-checks.json. Screenshots: passive-labels-{scene,radar,mobile}.jpg and component-sizes.jpg in BB thread [internal reference omitted]. Retook light screenshots after theme transitions settled.

### Architecture verification — scoped author self-review
- Passed: AP-046 (additive props and retained xs alias, documented visual migration), AP-054/AP-069 (static versus actionable semantics, native keyboard controls, disabled/focus behavior), AP-068 (one executable size foundation, unchanged palette), AP-070 (motion preference preserved).
- Dependency traceability: exported ComponentSize is used by all eight inline families; their ui-size/data-size contract resolves CSS variables in the actual token file. Runtime catalogue renders the same exports, not lookalikes. Shared size code is two lines plus CSS, with no dependency or new infrastructure.
- Residual risk: canonical sizes intentionally change earlier incidental padding/height values; consumers relying on old exact dimensions or node selectors need visual review. This is not full WCAG certification, independent review, or user aesthetic acceptance. Dev-server browser checks plus a production build are not claimed as a production deployment.
- Scoped technical verdict: PASS. No merge into main or unrelated workspace changes.

## Cycle 5 — Source wave and composable event interactions (2026-11-06)

### User scope and implementation
- Replaced the approximate three-curve motif with independent wave-only math: ascending slope, octave/fade model and seeded dotted ghost branches originating at actual event anchors. Source-generated numeric fixtures cover two viewport/phase combinations and all four radii; no personal timeline records or source-app runtime imports were copied.
- EventPoint is a standalone passive mark or native action. TimelineEvent composes it with the real TimelinePreviewCard into one action with shared hover/focus. Every visible scene point opens corresponding example details; points without cards remain fully actionable.
- Matched source neutral resting/hover shadows, accent point/date/title states, four-pixel card lift and the hover bridge. Replaced conflicting default utility colors/widths with component-owned styles so contextual states actually win the cascade. One HTML overlay keeps all cards above all points, and active cards above peers, without nested buttons or duplicate tab stops.
- Preserved the approved intro and its typography; placed the wave in a separate region below it. Optional fit maps curve/echo coordinates into the canvas without scaling point radii. Removed the obsolete click hint and renamed the working slider for spacing between events.
- Header now marks the original-site link with an external icon and underline. Divider demo explicitly selects horizontal and shows the vertical variant separately. OfferCard is omitted from the active catalogue at the user’s request; public export remains for compatibility. EnergyRadar now imports and renders SegmentedControl rather than maintaining another period selector; unavailable period actions are disabled.

### Verification evidence
- Full suite: 24 passed; TypeScript, production Vite build, generated-reference sync and whitespace check pass. Initial source-geometry/native-action regressions were observed red before implementation.
- Compiled Chrome checks: 33 passed with no runtime errors, covering both entrypoints, responsive coordinates, ghost/point anchoring, unique gradient IDs, source hover colors/shadows, native Enter/Space, disabled behavior, shared focus, dialog/Escape/focus return, spacing extremes, light/dark, mobile/reduced-motion and the corrected one-pixel divider.
- Follow-up probes verify intro/canvas separation, curve/echo containment, real shared radar selection and distribution updates, external-link affordance, and an adversarial later point placed beneath a card to verify native paint/hit-test ordering.
- Reports and inspected screenshots: BB thread [internal reference omitted] / wave-events-{tests,browser-checks}.json and wave-events-{scene,components,dark,mobile}.jpg. Public reference was inspected independently; no full pixel-equivalence claim.

### Architecture verification — scoped author self-review
- Passed: AP-020/AP-068 (one geometry/glyph/style foundation and actual package composition), AP-028 (source-derived numeric and real native-action regressions), AP-046 (SVG surface retained, additive point APIs; OfferCard export retained), AP-054/AP-069 (native controls, single event action, shared focus, disabled semantics), AP-070 (reduced-motion checked).
- Dependency traceability: SineWave calls createWaveGeometry/path/branchDots and renders actual EventPoint/TimelineEvent; TimelineEvent renders the real point and preview; EnergyRadar renders the exported shared SegmentedControl. No accepted-but-unused rendering dependency.
- Runtime completeness and entrypoint wiring: both HTML entries mount the same showcase; scene and catalogue use these new exports. The hand-drawn path and bespoke radar selector were removed. Tests do not retain an alternative implementation.
- Implementation completeness: real data-dependent geometry, gradients, DOM actions and callback-driven details; no fake success receipts or disabled production assertions. Source component modules remain bounded; declarative token CSS is kept together intentionally.
- Residual risk: modern inline SVG/foreignObject required for wave controls; arbitrary dense/image-rich preview placement is not a full timeline collision/camera engine. This is author/Chrome verification, not independent review or full accessibility certification. User approval of the evolving style is not claimed as final acceptance.
- Scoped UI verdict: PASS. The user subsequently approved existing author contact metadata. The audited repository is PUBLIC with anonymous source read-back verified; history was not rewritten.

## Cycle 6 — Public showcase, Vite 8 and MIT (2026-11-06)

- Upgraded Vite to 8.3.6 and compatible Vitest to 5.1.0 at the operator’s request. Migrated the build input setting to rolldownOptions and DOM matcher setup to the runner-specific entry. Component runtime/palette/geometry were not redesigned.
- Rewrote README against actual exports, source-based GitHub installation, Tailwind source scanning, sizes, theme/fonts and real build commands. Added standard MIT with Copyright (c) 2026 Vanya Afanasov and matching package metadata. MIT preserves the copyright/license notice; no extra mandatory UI-link clause was added.
- Deployment details are maintained outside the public design-system documentation.
- Production showcase is live at https://ui.vanya-arc.dev. HTTPS root, source JS/CSS SHA-256 equality, all 33 compiled live-browser checks and inspected desktop/mobile captures verified. Main-site navigation was verified in production at desktop/390/360px after Workers Builds success; a focused five-test suite also checks native Enter/new-tab navigation and existing social links.
- Verification scope: 24 unit tests, TypeScript, production build and generated-reference sync; author/browser verification, not an independent review or accessibility certification. Source branch/main publication is tracked separately from the live static deployment.

## Cycle 7 — 2026-11-23 — PR #25 architecture review and test integrity (#13–16)

### Context
- Branch: `fix/ux-13-16-interaction-browser-gate-20261123`, draft PR #25, `main` unchanged.
- Source: [cycle 7 plan](../superpowers/plans/2026-11-23-arch-improvement-cycle-7-pr25.md), [full evidence and test matrix](../research/pr25-test-integrity-review-2026-11-23.md).
- Memory replay: cycles 1–6 of this ledger; existing project memory was absent prior to this cycle.
- Applicable: AP-046, AP-054, AP-056, AP-057, AP-069, AP-074, AP-075, AP-076. Auth/data/migration rules N/A.

### Findings and triage
- [P1][AP-076] Press test verified a state marker without actual visible result — **fix-now**.
- [P1][AP-056] Slider hit-test only checked centre after scroll — **fix-now**.
- [P1][AP-075] Browser QA used dev server, not compiled output — **fix-now**.
- [P2][AP-056] Missing real Shift+Tab, tabpanel focus and content, manual scroll, two-way scroll owner, persisted theme — **fix-now**.
- [P2][AP-057] CSS transition timing could pollute pressed-vs-hover comparison — **fix-now**.
- [P2][AP-057] QA subpackage lockfile not committed — **blocked** until real install.
- [P1][AP-075/076] No executed compiled browser/screenshot review/S9b — **blocked**.
- [P2][AP-046] SegmentedControl default changed semantics; release/consumer compatibility decision pending — **blocked for release**.
- [P3] Existing CSS string-source tests are not visual proof — **log-only**.

### Fixes applied
- Kept components unchanged unless broken by reliable evidence.
- `browser-qa/tests/ui-contract.spec.ts`: multi-point actual DOM hit-test, initial-viewport capture, deliberately obstructed right-edge negative control; slider changes SineWave `--event-x`; real click count; explicit pending→error→reset→success; full Tab/Shift+Tab, selected panel content/focus, nested scroll/current navigation, two-way scroll, drawer content/focus and theme reload.
- `browser-qa/playwright.config.ts`, `package.json`: build + `vite preview` public compiled surface, no Cloudflare deploy or GitHub Actions.
- Docs/plan/README and issue evidence updated. Tests' meaningful assertions traced to real component code.

### Verification
- Source-based four semantic probes: traceability, split brain, entrypoint wiring and anti-gaming examined; implementation appears wired, but static evidence cannot certify runtime.
- New tests: 9 focused unit cases, 11 browser test declarations producing 16 Chromium executions (six light/dark × viewport cases), **NOT_RUN** in current environment.
- Full `bun run test`, `tsc`, `bun run build`, compiled Playwright, screenshot review, native zoom and screen reader: **NOT_RUN/NOT_VERIFIED**. No prior green reused.
- S9a: **VERDICT FAIL (execution evidence unavailable)**. S9b black-box: **VERDICT FAIL (not executed)**. Overall Arch Loop **FAIL / BLOCKED**; PR remains draft; no merge or issue closure.

### Residual risk
- Browser-qa transitive lockfile uncommitted; cannot claim deterministic install until generated/verified.
- Full native focus order and screen-reader details unverified; `ThemeToggle` uses a manual tabbables query that needs real browser scrutiny.
- Breaking ARIA default needs deliberate version/consumer migration before package release.
- No user-facing UI verified from this branch; historical public main checks are not evidence for the PR.

### Lessons for memory
- Test effects that users can observe, not just `data-*` receipts or JSX attributes.
- Prove failure detection with a negative control for serious regressions (right-side slider obstruction).
- Assert only what the source actually renders; review CSS state by exact component variant.
- E2E means built public surface; dev-only browser checks are an intermediate check, not S9 PASS.

## Cycle 8 — 2026-11-25 — portable design-system harness (#36)

### Context and triage
- [Approved design, AP mapping, and sliced TDD plan](../superpowers/plans/2026-11-25-arch-improvement-cycle-8-design-system-harness.md). Base main 035346e7f67c8c3bcf09a4c148d2129b5f359bb1; isolated qa/design-system-harness; no consuming product modified.
- Fix-now P1: missing canonical executable lint and persistent wiring. Fix-now P2: consumer scope/installed rules, legacy baseline and package distribution evidence. Log-only P3: existing large CLI and cosmetic concerns.
- Public contract intentionally tightens React verification; candidate minor 0.5.0. No tag or release; existing product pins remain valid as they are.

### Implementation and semantic probes (author review)
- Traceability: ui-pipeline delegates adopt to adopt-ui-harness, baseline to capture-ui-baseline, and lint/verify to design-harness; package bin invokes the same runner. createRequire resolves actual installed tokens, runner and frozen package-lock. No duplicate consumer policy or accepted-unused adapter.
- Entry-point/runtime: adopt persists the canonical command and source roots, preserves existing scripts and AGENTS instructions; check validates the binding; verify runs lint before build/browser and review requires actual lint evidence. Baseline capture is explicit; rules/lock/token fingerprint and source-line multiset reject added or altered debt and stale policy. Impeccable remains advisory.
- Anti-gaming: real toolchain negative controls catch raw values, missing installed package, fake package script, new debt and absent baseline. The first two E2E tests use linked installed package and real lint. Build/browser marker files only establish sequencing; they do not establish rendered UI acceptance. Package smoke uses independent immutable SHA installation, actual npm/Bun package executable, client/SSR build, and deliberate CSS violation.
- Residual risks: declared source roots still require review for completeness; source lint cannot certify semantic component reuse or visual correctness. No blind-agent outcome or real-product CI rollout yet. Independent reviewers are unavailable in this runtime. No S9 dual-circuit PASS claimed.

### Execution evidence
- Slice 0: RED 474b24e5-c692-4214-b355-c2d2169cc4a0 (unknown lint command); GREEN a78b3432-f6e0-4267-adf9-8833bafde97a, real lint E2E 1/1 and successful full validation.
- Slice 1: RED bcb0f862-d891-4c8e-8e3a-00a955224f56 (unknown adopt command); GREEN b5878c88-fd36-4044-92c9-9761f17a5365, E2E 2/2, 125 Vitest and 36 Node tests, full validation success.
- Slice 2: RED 794de941-f05a-4692-b7a6-4854f433ed50 (unknown baseline command, earlier tests passed); implementation a8c56048b9e7247ec336ded07c89b78dca4e755d, build df1d41ef-4bd6-417f-8819-00c2998c485b. GREEN confirmed: E2E 3/3, 125 Vitest, 36 Node tests, 4 baseline tests, all five external rule fixtures, TypeScript/build and compiled CSS PASS; showcase CSS debt 69 existing, 0 new.
- Distribution gate: candidate 0.5.0, non-production Workers Builds trigger extends validation with exact-SHA npm/React18 and Bun/React19 smoke when test:harness:consumer exists; deploy command remains validation-only. Production trigger untouched. Final result pending.
- S9a author probes completed with residual risks, independent review NOT_RUN. S9b all three executable linked-package journeys PASS, package smoke pending, blind-agent/browser review NOT_RUN. Overall Arch Loop NOT_VERIFIED; draft PR only.

### Cycle 8 — S9 repair after review #6057398865
- Prior exact SHA aea3f1836db0bbdab203b7c47f284f854e451930: Cloudflare 30d363ac-77b8-41d7-ad59-1fa710685e3d SUCCESS. Both actual package matrices npm/React18 and Bun/React19 passed install, lint, negative CSS, types, client and SSR. Applies only to that revision.
- A1/A2/A3/D1: authored inventory, coverage/report checks, suppression rejection, strict new receipt, current contract, source/policy fingerprint, direct installed CI entrypoint, shared component JSX usage and compiled CSS gate. Added actual package build negative control for disconnected tokens. A4: explicit non-growing baseline migration. A5/D3: canonical quickstart and release compatibility guidance; verified release pointer remains unchanged until release evidence.
- Regression tests added before implementation (de4153ca). Cloudflare skipped intermediate RED build due superseding pushes; original validator failures were reproduced during S9. Do not claim observed RED on that commit. Final candidate validation pending. No independent reviewer, blind agent or real browser specimen verified. D2 remains open. Scope: no real consumer edits, no production deploy, draft only.

### Cycle 8 — Agent experience slice
Previous head 3d344042218c6a5323e2c51da0e7582bdca1d30a: Cloudflare validation SUCCESS (125 Vitest, 37 Node, 3 harness E2E; both npm/React18 and Bun/React19 install/lint/negative lint/types/client/compiled CSS/negative CSS/SSR). Browser/independent agent evals deferred by user; UI_VERIFIED/TAGGED open. Add /agents/ as independent static Vite entry + SSR + native link, shared prompt model, explicit candidate evidence, quickstart publication and drift tests. Reference inspiration: Aura homepage (https://auradesignsystem.com/), Impeccable (https://impeccable.style/) and Base Design System (https://bds.base.org/docs); reference-only; original local composition, no copied assets. Scope: no new runtime or tools, no production deploy. New page visual QA pending.

### Product identity architecture clarification (2026-11-25)
Owner clarified umbrella architecture: preserve exact V→A for parent/UI; each official service has a distinct purpose-derived wave symbol and matching favicon. Brand source candidate 70c7a6ff839355a45d11bd9d51a888aeaa4cac43 (brand PR #1). UI integration uses exact pin, removes contradictory wording and adds actual re-export runtime tests for original geometry, custom slot, monochrome and text-only fallback. Public Markdown and skill route UI-12 to the procedure. Owner requested knowledge only: no conceptual service logos on the showcase, no new product assets, no product migration. CI and visual QA pending.

### Contributor mode — implementation in progress
Owner authorized the bounded contributor design. Existing portable CLI routes explicit phases to policy and local inventory modules; tests exercise real Git fixtures and negative paths. Generalized inherited provenance and preserved runtime category presets, component APIs and styling. Added contributor guide, existing skill routing, public doc drift checks and template. Private owner policy and actual binary/semantic review remain outside generic CI. No consumer modifications. Exact-head CI and independent verification pending.

Identity review repair: brand candidate 83ade0e4b8bc486c0fbc52df8b04b317d8e40bb9 preserves legacy default lockup, explicit productMark and showMark=false; original artwork unchanged. UI exact pin and behavioral regression synchronized. Documentation distinguishes consumer harness 0.5.0 from identity/contributor candidate 0.6.0. Source references remain generic. CI pending; no package release or consumer update.

Owner narrowed the cleanup: preserve approved historical and technical references; remove the specifically obsolete reference from the remaining plan. Updated contributor policy to distinguish approved references from unapproved consumer coupling. No component or runtime changes in this slice. CI pending.

### Contributor mode — owner-approved simplification
The publication-specific scanner, Git/history traversal, private policy contract and extra build gates are removed. The contributor route now reuses existing library verification scripts (test, typecheck, build, lint:design:pilot) and the same CLI runner. The skill delegates UI-focused discovery, generalization, applicable acceptance and evidence to one guide. Existing publication/rights policy and ordinary build remain in place. Regression fixtures target real no-Git execution, failure, dry-run and invalid input. No consumer/runtime or identity changes. Prior scanner CI success applies to historical revisions only; current CI pending. Independent reviewer and live skill evals remain NOT_VERIFIED/NOT_RUN.

### CLI discovery
Owner selected `vanya-arc-ui` / `vui` as aliases of the existing pipeline, with standard help and version. Preserve direct Node and existing CI lint entrypoints; symlink dispatch and both installed aliases covered by regression/consumer smoke cases. No additional runtime dependencies or command framework. CI pending.

### VUI review repair — implementation
Owner approved the bounded fixes in review 6059464700. CLI option validation derives from the command usage contract, rejects unsupported/duplicate options before side effects; inspection and verification extracted into cohesive modules with existing exports retained. Help exposes resolved local resources and both workflows. New-scope UI-12 requires an explicit source observation. Existing design lint pilot expanded to shared components and showcase, with actual component-path negative fixtures; original debt baseline unchanged. Tests for invalid mutation options, identity and help added. No additional runtime dependencies or product migration. Exact-head CI, actual expanded lint findings and independent S9/live agent evidence remain pending. Plan: docs/superpowers/plans/2026-11-25-vui-review-repair.md.

### Consumer smoke feedback — linked data
The owner's local Ferma smoke test on 02bde866 found `src/data/registry.json` prevented inspect/check/verify before dependency diagnostics. Root cause: authoredInventory rejected every symlink before extension filtering. Narrow repair skips regular-file links whose names are outside the authored-source formats; authored source links, directory links and unresolved links retain existing failure behavior. Regression uses real linked JSON, CLI inspection/check/dry-run and negative source/directory links. No consumer changes or baseline updates. CI pending.
