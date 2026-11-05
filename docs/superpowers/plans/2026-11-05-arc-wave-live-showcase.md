# Arc Wave live showcase — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Execute the user-approved remaining three findings inline; no new agents without user authorization.

**Goal:** Replace the handwritten catalog with real package components, restore Manrope UI hierarchy, and demonstrate open-space composition with contextual detail.
**Architecture:** Both existing HTML URLs mount the same React showcase. `src/showcase` owns demo state/content/layout; exported primitives remain domain-independent. CSS tokens own shared spacing, readable colors and overlay elevation. Agent documentation reads actual CSS values rather than a parallel palette.
**Tech Stack:** Existing React 19, Vite 6, Tailwind 4, Vitest/testing-library; no new runtime dependencies.
**Spec:** User's three remaining findings in BB thread thr_iqfqpdagcr; research artifact and light reference captures in that thread. hearth-taste was deleted at user's request and must not be recreated. Third-party skills are read-only.

## Architecture context / constraints
- Existing `src/index.ts` exports are the public contract; preserve props and both catalog URLs.
- Mode: Experience for the open demonstration, Read for the component reference; no decorative loading animation.
- Keep existing paper/ink/accent colors; improve spatial and typographic roles instead of reducing text contrast.
- No application migrations or changes to life-wave-narrative.
- Plain UI uses Manrope; serif remains for explicitly editorial content such as digest prose.
- Shared checkout clean at baseline 997a299; own branch fix/arc-wave-live-showcase. Parent workspace has unrelated WIP: never stage it.
- Applicable rules: AP-015, AP-019, AP-020, AP-025, AP-028, AP-046, AP-051–054, AP-068–070, AP-075–076. No storage/auth/backend boundary is introduced.
- Independent subthreads not authorized; report self-review and browser verification honestly, not independent acceptance.

## Review focus
- Preview must open detail, close on Escape and return focus to its trigger.
- Keyboard interaction and narrow viewport must not be sacrificed for visual quietness.
- Theme preview state must not accidentally control the whole page; the actual page controller must persist selection.
- Every catalog export stays discoverable and uses actual component code, including overlays and non-default states.
- Baseline tsc already fails in OfferCard: obsolete ActionButton variants amber/default; repair bounded wiring while exposing real exports.

## Task 1 — walking vertical slice and accessible detail
**Files:** tests/showcase.test.tsx, src/showcase/{Showcase,Scene}.tsx, src/components/{EventCard,TimelinePreviewCard,InspectDrawer}.tsx; index.html, showcase.html, vite.config.ts.
**Interfaces:** Showcase mounts through main.tsx; Scene owns selected demo item; existing InspectDrawer accepts isOpen/title/onClose/children unchanged.
- [ ] Write tests using real exports: preview opens a named dialog; content is selected; Escape closes and restores focus; closed dialog is absent.
- [ ] Observe RED before implementation.
- [ ] Implement a native button preview and modal dialog-backed InspectDrawer with focus containment/return; render Manrope event/preview titles and explicit focus states.
- [ ] Mount both HTML entrypoints on one real React tree; run tests GREEN.

## Task 2 — complete catalog, composition and token authority
**Files:** src/showcase/{ComponentCatalog,CatalogSection,showcase.css,main}.tsx/css; src/tokens.css; scripts/{sync,token-reference}.ts; tests/token-reference.test.ts; DESIGN.md, README.md.
**Interfaces:** Catalog imports exclusively src/index exports; renderTokenReference(css:string):string derives root/theme/font/spacing values and fails on missing required blocks.
- [ ] Write RED behavioral tests for generated documentation changing with input CSS, and invalid CSS failing explicitly.
- [ ] Implement token-derived reference generation; remove redundant hard-coded color specification and obsolete taste rules.
- [ ] Demonstrate all existing exports with local demo controls; preserve separate EventCard/TimelinePreviewCard examples and explicit DeskSlotCard states.
- [ ] Add shared scene spacing, display typography, overlay shadow and reduced-motion tokens/styles without duplicating the palette.
- [ ] Fix baseline OfferCard variants and undefined legacy utility-token wiring needed by rendered exports.
- [ ] Verify GREEN, sync twice with no drift, typecheck and production multi-page build.

## Task 3 — visual verification and persistence
- [ ] Inspect desktop light, detail open, dark and narrow viewport; test theme, selection, disclosure, controls and browser errors.
- [ ] Run full Vitest, tsc and build with bounded timeouts; save reports under BB thread storage.
- [ ] Run Impeccable detector once after visual work; record genuine limitations, not silent rule suppression.
- [ ] Self-review AP boundaries / entrypoint wiring / runtime completeness / assertion integrity; update architecture ledger with evidence and residual risks.
- [ ] Commit and push scoped changes; verify remote SHA and clean scoped worktree.

## Plan review / rulings
Coverage: all three remaining findings have implementation and verification paths. No new public composition API is needed: demonstrate recipes first. Existing catalog exports are preserved rather than replaced by a single static mock. User explicitly asked to continue fixes; proceed inline rather than requesting another approval. Tests and browser receipts do not constitute independent review.
