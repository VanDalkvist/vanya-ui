# Architecture Improvement Ledger: @vanya/ui

## Cycle 1 — 2026-11-01: Showcase States Isolation, ThemeToggle Parity, Fact-Check Cleanup

### Context & Goals
- Target: `~/Projects/vanya-ui`
- Standards: AP-010 ... AP-071, Hearth & Wave Design System.
- Scope:
  1. Fact-check & removal of non-existent `TurnArcBadge`.
  2. Parity with `life-wave-narrative` ThemeToggle (`dropdown` and `segmented` variants; corner switcher controls page with system default; catalog demos are local only).
  3. Presentation of `DeskSlotCard` across isolated, labeled design system states.
  4. Separation of `EventCard` and `TimelinePreviewCard` into independent catalog rows.
  5. Removal of redundant framing borders around preview boxes.
  6. High-craft presentation of code snippets with copy button.

### Slices Executed
1. **Slice 1: Fact-check & removal of TurnArcBadge**
   - Fact-check confirmed `TurnArcBadge` was an ungrounded extrapolation from `TurnArcs.tsx` (an SVG timeline trajectory layer). Removed `src/components/TurnArcBadge.tsx` and updated exports.
2. **Slice 2: ThemeToggle parity with life-wave-narrative**
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
- Implemented the three remaining user-selected findings after the user removed hearth-taste in projects-home. No third-party skills or life-wave-narrative sources changed.
- Replaced both handwritten HTML catalogs with shells mounting one React composition root and real package exports. Kept both URLs in the production build.
- EventCard / TimelinePreviewCard / InspectDrawer headings now use Manrope. Serif remains available for editorial digest prose.
- Added an open-space scene with preview selection, native modal sheet, focus return, context disclosure and a working spacing control; mobile remains a stacked composition.
- Added shared display / metadata / clearance / sheet-elevation roles. Kept the existing paper/ink/accent palette and mapped legacy token names to canonical values.
- Agent token reference is generated from actual CSS; component names come from public exports, not a second set of values. DESIGN.md no longer duplicates a stale palette or the deleted skill's blanket bans.
- Bounded real-component repairs: obsolete OfferCard ActionButton variants; readable metadata; theme-aware category contrast; stable preview borders on hover.

### Verification receipts
- Full Vitest suite: 8/8 passed (four baseline tests plus four focused regressions); report: BB thread thr_iqfqpdagcr / ui-tests.json.
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
- Match Farm's harness icons and light/dark palette in badges and both radar examples.
- Keep SegmentedControl sized to content; populate Minimap with past/current/future event ticks and a working focus window.

### Implementation and provenance
- Farm visual source: ferma cfafd320a77d00e4b29cbb78cca590bcf3ef56b2, src/lib/harness-colors.ts and src/styles.css. All 24 palette declarations (4 types × 3 roles × 2 themes) checked for exact parity.
- Shared package-owned identity map: src/harness.ts. No runtime import/dependency on the Farm application; arbitrary custom badges/radar items remain supported.
- Reference wave/minimap inspected read-only in life-wave-narrative f11918ec32e0a6a40bc4be6132dbbe87d43b6a46. SineWave is a small independent SVG primitive, not a copy of the timeline engine.
- Theme controls now notify peer hooks on the same page; header and catalogue variants stay synchronized. Existing storage persistence remains the source for reloads.
- Header styling remains paper/Manrope; only density/position changed. Anchor clearance tracks its compact desktop/mobile height.

### Verification evidence
- Full suite: 13 tests passed, including five focused refinements regressions; tsc noEmit and production build passed.
- Theme-sync regression observed failing with notification disabled, then green restored. No new test framework or coverage campaign.
- Compiled-browser smoke: 17 checks passed, no runtime errors. Both HTML URLs verified, along with exact header/title, CTA removal, sticky header/anchor clearance, all 26 named rows, intrinsic segment widths, four harness identities/distributions, 17 minimap ticks and seek, synchronized theme controls and mobile overflow.
- Segment geometry: trailing inset 3px at both shown sizes, instead of a stretched empty tail.
- Screenshots: BB thread thr_iqfqpdagcr / refined-{scene,controls,radar,mobile}.jpg. Browser reports: refinements-browser-checks.json; tests: refinements-tests.json.
- Sync idempotent; whitespace clean. Detector retains only the pinned cream-palette warning and an em-dash advisory; no clean-detector claim.

### Architecture verification — scoped author review
- Passed: AP-015, AP-019, AP-020, AP-025, AP-028, AP-046, AP-051–054 (changed flow), AP-068–070, AP-076.
- Dependency traceability: CategoryBadge.tsx consumes getHarnessType; EnergyRadar.tsx:40 resolves defaults used by its bar/legend; SpiderRadar resolves axis icons/colors from the same map. No unused injected port or cross-app runtime dependency.
- Runtime completeness/entrypoint wiring: src/index.ts:2 exports SineWave, Scene.tsx:15 renders it; ComponentCatalog imports real exports and each public component has its own named region. Both built entrypoints show the updated browser brand.
- Assertion integrity: real render/click/state tests plus browser geometry and runtime CSS checks, not static source-text tests or placeholder receipts. All modified UI source files remain below 250 lines.
- Not applicable: databases, auth, external API adapters and data migrations (no such boundaries touched).
- Residual risk: new details have author/browser verification, not independent review or a fresh user visual approval; Farm parity is a recorded snapshot and future upstream palette changes must be intentionally synchronized. No third-party skill changes.
- Scoped technical verdict: PASS; not an independent dual-circuit acceptance claim.

## Cycle 4 — Passive labels, copy, common sizes and review follow-ups (2026-11-06)

### User scope and changes
- Checked primary Carbon/GOV.UK tag guidance: read-only labels do not have clickable hover/focus states; actionable variants must be distinguishable. Informational chart titles are not a click action. Source URLs and the working plan are in docs/superpowers/plans/2026-11-06-passive-labels-and-copy.md; raw source evidence is tag-hover-primary-sources.md in BB thread thr_iqfqpdagcr.
- Tag and MeshStatusBadge render static spans without an action and native buttons when onClick is supplied. Disabled controls do not show enabled hover feedback. Toggle tags expose aria-pressed only when isActive is actually supplied. Static preview images and card containers no longer suggest a click; nested park remains actionable. Clickable project titles use native buttons without nesting the park button.
- Applied redaktura and ux-copy to scene, descriptions, sample content, overlays and indicator defaults. Removed atmospheric assertions and the stale default three-project quota label. The user explicitly corrected a removal proposal: the intro was never removed and is retained, with a literal heading and a smaller 24–28px hierarchy. Palette, spacing composition and wave remain.
- Radar now takes the full catalogue width; legend items do not break internally and the total has its own clearance. Setup is always visible in a separate section after all components, rather than expanding above them.
- Added CategoryBadge sm/md and one shared inline size foundation: 24/32px outer heights, common font/line/icon/padding/gap tokens. Eight families use it: CategoryBadge, Tag, MeshStatusBadge, ActionButton, Kbd, LinkChip, AvatarLink and SegmentedControl. Both sizes are shown together within each component row. Legacy xs is retained as compact sm; visual migration is documented in DESIGN.md.
- Added the real vanya-arc.dev external link between section navigation and theme, with separators and a safe new-tab target.

### Verification evidence
- Full Vitest suite: 18 passed. Focused passive-label and size-contract regressions were first observed failing. TypeScript, production build, sync idempotence and git diff --check pass.
- Chrome/dev browser: 34 passed, no runtime errors. Actual computed hover compared in both themes for passive labels/cards and chart bars. Native Enter/Space, disabled actions, dialog Escape/focus return, image scale feedback and separate title/park actions checked.
- Measured both actual sizes across all eight families, including font/line/icon metrics: common 24/32px outer heights. Checked full-width radar, wrapping legend and detached setup; both entry URLs render without mobile overflow. Header including original-site link remains within 88px at 390px viewport.
- Reports: passive-labels-tests.json, passive-labels-browser-checks.json. Screenshots: passive-labels-{scene,radar,mobile}.jpg and component-sizes.jpg in BB thread thr_iqfqpdagcr. Retook light screenshots after theme transitions settled.

### Architecture verification — scoped author self-review
- Passed: AP-046 (additive props and retained xs alias, documented visual migration), AP-054/AP-069 (static versus actionable semantics, native keyboard controls, disabled/focus behavior), AP-068 (one executable size foundation, unchanged palette), AP-070 (motion preference preserved).
- Dependency traceability: exported ComponentSize is used by all eight inline families; their ui-size/data-size contract resolves CSS variables in the actual token file. Runtime catalogue renders the same exports, not lookalikes. Shared size code is two lines plus CSS, with no dependency or new infrastructure.
- Residual risk: canonical sizes intentionally change earlier incidental padding/height values; consumers relying on old exact dimensions or node selectors need visual review. This is not full WCAG certification, independent review, or user aesthetic acceptance. Dev-server browser checks plus a production build are not claimed as a production deployment.
- Scoped technical verdict: PASS. No merge into main or unrelated workspace changes.

## Cycle 5 — Source wave and composable event interactions (2026-11-06)

### User scope and implementation
- Replaced the approximate three-curve motif with wave-only math from life-wave-narrative f11918ec32e0a6a40bc4be6132dbbe87d43b6a46: ascending slope, octave/fade model and seeded dotted ghost branches originating at actual event anchors. Source-generated numeric fixtures cover two viewport/phase combinations and all four radii; no personal timeline records or source-app runtime imports were copied.
- EventPoint is a standalone passive mark or native action. TimelineEvent composes it with the real TimelinePreviewCard into one action with shared hover/focus. Every visible scene point opens corresponding example details; points without cards remain fully actionable.
- Matched source neutral resting/hover shadows, accent point/date/title states, four-pixel card lift and the hover bridge. Replaced conflicting default utility colors/widths with component-owned styles so contextual states actually win the cascade. One HTML overlay keeps all cards above all points, and active cards above peers, without nested buttons or duplicate tab stops.
- Preserved the approved intro and its typography; placed the wave in a separate region below it. Optional fit maps curve/echo coordinates into the canvas without scaling point radii. Removed the obsolete click hint and renamed the working slider for spacing between events.
- Header now marks the original-site link with an external icon and underline. Divider demo explicitly selects horizontal and shows the vertical variant separately. OfferCard is omitted from the active catalogue at the user’s request; public export remains for compatibility. EnergyRadar now imports and renders SegmentedControl rather than maintaining another period selector; unavailable period actions are disabled.

### Verification evidence
- Full suite: 24 passed; TypeScript, production Vite build, generated-reference sync and whitespace check pass. Initial source-geometry/native-action regressions were observed red before implementation.
- Compiled Chrome checks: 33 passed with no runtime errors, covering both entrypoints, responsive coordinates, ghost/point anchoring, unique gradient IDs, source hover colors/shadows, native Enter/Space, disabled behavior, shared focus, dialog/Escape/focus return, spacing extremes, light/dark, mobile/reduced-motion and the corrected one-pixel divider.
- Follow-up probes verify intro/canvas separation, curve/echo containment, real shared radar selection and distribution updates, external-link affordance, and an adversarial later point placed beneath a card to verify native paint/hit-test ordering.
- Reports and inspected screenshots: BB thread thr_iqfqpdagcr / wave-events-{tests,browser-checks}.json and wave-events-{scene,components,dark,mobile}.jpg. Public reference was inspected independently; no full pixel-equivalence claim.

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
- Public current tree contains no Cloudflare tooling/configuration. Deployment is owned by the separate private repository, following the operator’s explicit separation policy. An early non-secret WIP config remains in historical commits; no credential or account ID was in that file and shared history was not rewritten.
- Production showcase is live at https://ui.vanya-arc.dev. HTTPS root, source JS/CSS SHA-256 equality, all 33 compiled live-browser checks and inspected desktop/mobile captures verified. Main-site navigation was verified in production at desktop/390/360px after Workers Builds success; a focused five-test suite also checks native Enter/new-tab navigation and existing social links.
- Verification scope: 24 unit tests, TypeScript, production build and generated-reference sync; author/browser verification, not an independent review or accessibility certification. Source branch/main publication is tracked separately from the live static deployment.
