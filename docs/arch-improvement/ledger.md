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
