# Approved showcase refinements — implementation plan

**Goal:** Apply Vanya's seven requested refinements without redesigning the approved first screen or changing its paper/Manrope/spacing character.
**Authority:** Direct feedback in BB thread thr_iqfqpdagcr, 2026-11-06. The previous light composition and style are explicitly approved. Keep implementation simple and checks focused; no third-party skill changes or another Gemini attempt.

## Context and boundaries
- Repo: vanya-ui, clean branch fix/arc-wave-live-showcase at 705ddc7.
- Read-only references: ferma/src/lib/harness-colors.ts, ferma/src/styles.css (both themes), ferma/src/components/desk/HarnessEnergyRadar.tsx; life-wave-narrative/src/components/timeline/{WaveTrajectory,Minimap}.tsx.
- Keep package independently usable: copy the verified harness visual contract into a small package-owned shared definition and CSS tokens, never import sibling application source at runtime.
- Public props stay compatible. SineWave is a new exported SVG background primitive; EnergyRadar keeps arbitrary-item support and gains matching harness defaults.
- SegmentedControl's trailing whitespace is flex-column stretch, not an extra segment. The primitive must size to content even in a stretching parent.
- Canonical AP focus: AP-015, AP-020, AP-025, AP-046, AP-051–054, AP-068–070, AP-076. No new service, storage or protocol boundary.

## Task 1 — focused regressions
- [x] Add small failing tests: canonical harness IDs map to correct labels/icons in CategoryBadge; EnergyRadar inherits same icon/color mapping while respecting generic custom colors; SegmentedControl selects its last item; catalogue has one public component per named row with states grouped.
- [x] Observe RED; use real components, not mocks or source-text assertions. Browser geometry check is the regression for content-sized segments.

## Task 2 — approved UI changes
- [x] Remove only the first-screen arrow CTA (retain keyboard skip link and header navigation).
- [x] Make navigation header sticky with theme-aware paper background; account for its height at anchor destinations on desktop/mobile. Latest user additions: header brand text is exactly `vanya-arc/ui`; update both HTML document titles and descriptions to the same name; reduce header padding to a 60px desktop / 88px two-row mobile header without changing the visual language.
- [x] Export SineWave and place a quiet, noninteractive instance behind the existing first-screen layout; give it its own catalogue row.
- [x] Split grouped catalogue rows into one component each, preserving variants/states together. Include a real ThemeToggle row; all theme controls must remain in sync without duplicate state owners.
- [x] Use Farm's Sparkles/HeartHandshake/Briefcase/Cpu and exact light/dark harness tokens in CategoryBadge and EnergyRadar; radar demo includes all four types. Keep generic items and existing category labels compatible.
- [x] Fix SegmentedControl intrinsic sizing, preserving caller width overrides and normal selection.
- [x] Populate Minimap's own row with clustered past/current/future event ticks and working window selection, like the reference.

## Task 3 — verify and preserve
- [x] Full existing Vitest suite, typecheck, sync idempotence and multi-page build (bounded commands; no extra test framework).
- [x] Browser-check header after scroll/anchor, arrow absence, sine background pointer isolation, catalogue row names, Farm colors/icons, segment geometry, minimap ticks/window, light/dark and 390px overflow.
- [x] Inspect screenshots to preserve the approved style. Save evidence to BB thread storage.
- [x] Update ledger with scoped author-review evidence and remaining limitations; no independent review claim because the user requested inline work after Gemini failure.
- [x] Commit + push to the same branch; verify remote SHA. Do not merge or touch unrelated workspace changes.

## Pre-flight review
No architecture change or creative restyling is needed. One shared harness definition serves badges and radar; tokens are transcribed from the source rather than guessed. Native header sticky avoids JS scroll listeners. The SineWave is static geometry with no motion/performance burden. Browser geometry and actual catalogue interaction are the acceptance checks, not a large snapshot test suite.
