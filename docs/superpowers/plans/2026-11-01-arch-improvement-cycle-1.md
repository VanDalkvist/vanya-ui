# Arch Improvement Cycle 1 Plan: @vanya/ui Showcase & States Refinement

**Date:** 2026-11-01  
**Target:** `~/Projects/vanya-ui`  
**Standard:** AP-010 ... AP-071, Hearth & Wave Design System

## 1. Goal
Refine the `@vanya/ui` showcase and component architecture:
1. Fact-check and eliminate hallucinated `TurnArcBadge`.
2. Achieve exact parity with `life-wave-narrative` ThemeToggle (`dropdown` and `segmented` variants; corner switcher controls page with system default; catalog demos are local only).
3. Present `DeskSlotCard` across isolated, labeled design system states (Active, Empty, Parked).
4. Separate `EventCard` and `TimelinePreviewCard` into dedicated individual rows.
5. Eliminate visual noise: strip heavy redundant borders around preview boxes.
6. Redesign code snippets into clean, high-craft typography with copy action.

## 2. Selected Fix Slices

- [ ] **Slice 1: Fact-check & removal of TurnArcBadge**
  - Remove `src/components/TurnArcBadge.tsx`.
  - Remove from `src/index.ts`.
  - Run `bun run sync` to update `llms.txt` and `registry.json`.
- [ ] **Slice 2: ThemeToggle parity with life-wave-narrative**
  - Update `src/components/ThemeToggle.tsx` with dropdown menu and segmented variants.
  - Wire header corner toggle as the sole page controller (default: system).
  - Isolate catalog ThemeToggle preview to local state demonstration.
- [ ] **Slice 3: DeskSlotCard state isolation**
  - Present explicit states: `State: Active`, `State: Empty Slot`, `State: Parked`.
- [ ] **Slice 4: Separation of EventCard and TimelinePreviewCard**
  - Split into individual catalog sections.
- [ ] **Slice 5: Strip borders & high-craft code snippets**
  - Remove box-in-box borders from preview containers.
  - Implement clean code snippets with copy button.
- [ ] **Slice 6: Verification & Dual-Circuit Review**
  - Run `vitest run`.
  - Run `impeccable detect http://127.0.0.1:3020`.
  - Take browser automation screenshots.
  - Record cycle in `docs/arch-improvement/ledger.md`.
