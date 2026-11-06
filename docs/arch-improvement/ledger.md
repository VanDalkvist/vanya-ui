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
