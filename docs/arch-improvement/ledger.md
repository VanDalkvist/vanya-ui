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
