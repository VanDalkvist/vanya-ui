# Quiet Loop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Use arch-improvement-loop, arch-rules-slice-planning, arch-improvement-fix, Vanya UI contributor mode and TDD. Steps use checkbox syntax.

**Goal:** Establish a consistent, calm, recognizable visual language for Vanya UI controls in workspaces, forms and inspectors, with transparent resting surfaces wherever affordance remains clear.

**Architecture:** Existing React controls and semantic CSS tokens own presentation and interaction. The public showcase uses the actual exported components and synthetic, locally controlled data. Canonical documentation, generated references and existing agent verification remain synchronized.

**Tech stack:** React 18/19, TypeScript, Tailwind 4, Vite, Vitest, Playwright, existing VUI harness.
**Spec:** The design contract below; canonical sources listed in the context map.
**Status:** PLANNED / S7 static plan review; execution and release pending maintainer approval. Date: 2026-11-26.

## S0–S3 — Scope, memory and architecture context

- Repository: VanDalkvist/vanya-ui, main, source package 1.0.0. Remote file inspection only; local worktree status and fresh runtime evidence unknown. Reconfirm exact HEAD before execution.
- Read AGENTS.md, DESIGN.md, skills/vanya-ui/SKILL.md, docs/patterns/contributing.md, docs/patterns/publication-safety.md, docs/versioning.md, docs/arch-improvement/memory.md and ledger.md.
- Memory applied: prove compiled entrypoint; assert actual visible outcome and negative control; inspect live callsite/CSS together; keep lint policy and evidence truthful.
- Stage: prod (public library and documentation). Baseline: https://github.com/ai-meatbags/arch-rules/blob/main/arch-rules.md (inspected blob 20b25e9d8fed1ea27eeb391ffe9e68d9663a7e70). Applicable AP-011, 025, 028, 046, 051, 054, 056, 057, 068, 069, 074, 075 (vertical slice discipline), 076. AP-020 applies to showcase wiring; public barrel is intentional package entrypoint. Database, auth, external transport and domain orchestration are outside this UI-only scope.
- Source path: index.html -> src/showcase/main.tsx -> Showcase -> ComponentCatalog -> exported components and src/tokens.css. Package API: src/index.ts. Browser runner builds dist and serves it over HTTP via preview. Public reference generation: scripts/sync.ts and markdown-publication.mjs.
- Verification: library contribute command, existing browser suite, review of compiled screenshots and actual outcomes, package compatibility checks and versioning policy.
- Approved direction: Quiet by default, transparent controls, Linear as primary visual reference; Apple interaction principles and historical Material input cues as additional references. Concrete component choices below are proposals subject to visual evidence and maintainer acceptance.

## Design contract

### Intent and approaches

1. Change existing defaults with a single semantic appearance contract (selected candidate; lowest ongoing API and maintenance cost).
2. Add quiet variant to every control (reserve for proven compatibility or affordance need; increases decision surface).
3. Introduce a second theme or parallel component family (excluded; duplicates the visual system).

Use flat resting controls, typography, aligned text, whitespace and purposeful dividers. Preserve identity, Manrope, palettes, existing semantic scales and interaction feedback. Three compositions: a compact workspace toolbar, a stacked document form and an aligned property inspector. Use the existing primitives in all three; layout belongs to the composition.

- Rest: transparent background, no visible enclosing border/shadow for quiet search, text input, select and filter trigger; actual hit area stays intact. Use transparent reserved borders only if geometry requires them.
- Hover: existing ink-derived 6% fill for pointer-capable devices, neutral text feedback; pressed 11% where appropriate. Preserve 140ms shared feedback and reduced-motion behavior.
- Focus: visible 2px accent outline, including pointer-driven text entry where a caret alone is insufficient; verify contrast and forced-colors. Preserve stable geometry (no layout shift). Avoid duplicate rings around nested labels/controls.
- Selected: stable accent plus an appropriate non-color cue (e.g. weight/underline, checkmark for listbox); no container shadow. Avoid width changes when weight changes; verify combined hover/focus states.
- Expanded: contextual trigger feedback and visible chevron; selection and keyboard focus remain distinct. Existing portal menu keeps opaque surface, border, appropriate shadow and viewport-safe positioning.
- Empty fields: visible label plus meaningful cue (placeholder and/or editable line); check recognizability before hover, on touch and at first encounter. An underline with compliant contrast is a bounded fallback; outline remains available where evidence requires it. Keep persistent labels; errors use explicit text and accessible associations, not color alone.
- Disabled/read-only: distinguish by semantics and cues; no active hover feedback for disabled; preserve selection/copy behavior for read-only as supported.
- Geometry: keep current toolbar 40px; existing standalone sizes and component API unless specifically approved. Do not turn visual simplification into smaller hit targets. Respect WCAG target size and mobile touch conventions.
- Functional boundaries remain for menus, dialogs, necessary input affordance, range tracks, checkboxes/switches if present, sticky surface separation and focus/error cues. Brand assets and unrelated rich scenes stay unchanged.

### Global constraints

Public repository and public showcase only. Synthetic examples only. No product-specific references, adoption plans, screenshots, private data, identifiers or integrations. No dependencies, new theme, new form engine, global CSS reset, arbitrary color values, new CLI or automatic workflow by default. Preserve exported props, controlled state, native semantics, refs/IDs and current keyboard behavior. Keep existing component variants that have explicit semantic uses; additional variant/API requires demonstrated need and approval. Document compatibility implications of changed appearance; if a breaking default is established, apply AP-046 and obtain explicit release approval. No tag/deploy during planning. Use existing verification and publication routes.

### Reference research (reference-only, no copied assets)

- Linear, UI refresh: https://linear.app/changelog/2026-03-12-ui-refresh — lightweight working interfaces; visual research should inspect toolbar, filtering and property editing separately.
- Apple, Focus and selection: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/ — focus rings for text/search fields, context-dependent list selection.
- Apple, Toolbars and Text fields: https://developer.apple.com/design/human-interface-guidelines/toolbars and https://developer.apple.com/design/human-interface-guidelines/text-fields — grouping, discoverability, logical focus order.
- MUI, Text Field: https://mui.com/material-ui/react-text-field/ — historical standard variant still supported; current Material guidance does not list it. Underline is an alternative to test.
- W3C, WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast — boundaries required when no other visual identification exists; necessary indicators meet contrast requirements. Also SC 1.4.1, 1.4.3, 2.4.7, 2.4.11, 2.5.8 and labels/ARIA. Research notes must distinguish external observations, local hypotheses and verified outcomes.

## S4–S5 — findings and triage

- Q01 [P2, fix-now, approved design scope]: src/tokens.css search, text, toolbar select and filter trigger rules use permanent border/surface. This directly conflicts with the new proposed visual contract. No existing functional defect claimed solely from appearance.
- Q02 [P2, fix-now]: SegmentedControl.tsx combines shared CSS with unconditional container border, raised fill, backdrop blur and selected shadow. Simplifying only CSS leaves another appearance owner and inconsistent controls. Preserve semantics and count slots.
- Q03 [P2, fix-now]: SelectField.tsx default appearance lives in JSX; toolbar in CSS. Consolidate only appearance rules, maintaining native select behavior and explicit labels.
- Q04 [P2, fix-now]: DESIGN.md, docs/patterns/interaction-states.md and docs/composition/working-surfaces.md currently endorse structural control borders; scripts/sync.ts also repeats composition guidance. Contradictory guidance would propagate inconsistent implementations.
- Q05 [P2, fix-now]: current compact toolbar showcase changes controlled values but displays no filtered result in that section (ComponentCatalog.tsx); behavioral QA must observe actual collection changes and form outcomes. Existing media example offers partial search and title editing only.
- Q06 [P2, verification risk]: empty/filled field affordance, focus and invalid/read-only/disabled states, contrast, touch, long text and narrow viewport require browser proof. No observed failures asserted yet.
- Q07 [P2, conditional]: TextField has input-only API; no exported Textarea. Add a focused multiline primitive only if generic document editing needs it and existing native/shared styling cannot meet contract; avoid a generic form framework. Separate proposal and tests if an API addition is needed.
- Q08 [P3, log-only]: unrelated components, visual polish, density redesign and cleanup without a demonstrated contract issue.

Review Focus: (a) empty label and field discovered without hover (Slice 2); (b) long filter value, no results and disabled option (Slice 1); (c) selected tab while another is hovered, disabled or removed (Slice 3); (d) touch, forced colors, keyboard focus and clipping (all slices, Slice 5); (e) duplicate IDs and stale/cancelled form edits (Slice 2). Add the tests to their owning slices. No open P0/P1 established from static inspection.

## S6 — execution slices

### Slice 0 — Walking skeleton: real search in the compiled catalogue
Boundary: public package -> rendered showcase -> visible collection; AP-075/076, 068/069.
Files: src/components/SearchField.tsx, src/tokens.css, src/showcase/ComponentCatalog.tsx, src/showcase/showcase.css only if necessary for layout, browser-qa/tests/ui-contract.spec.ts.
Interfaces: existing SearchFieldProps (value, onValueChange, label, onClear, density); retain 40px toolbar and 44px standalone.
- [ ] Capture exact HEAD, inventory existing tests and current screenshots in both themes; run existing baseline gates; document preexisting failures.
- [ ] Red: compiled toolbar uses deterministic synthetic items; typing an exact query must reduce visible items from multiple to one; impossible query shows useful empty state; clear restores all. Assert computed resting surface transparent and no visible border, actual hit target and focus ring. Introduce a deliberate broken search or hit overlay in the test fixture and show same oracle rejects it; remove mutation.
- [ ] Make search styling use existing interaction tokens and focus; keep aria label, clear semantics, input type and controlled state. Wire real filtering into existing compact-filter example with synthetic rows; no faux output.
- [ ] Green: targeted Vitest and Playwright compiled journey, screenshot/geometry comparison in light/dark; verify no focus loss when clearing.
- [ ] Commit slice after verification; any failed end-to-end gate blocks subsequent slices.

### Slice 1 — Select and filter interactions
Boundary: FilterSelect and SelectField public APIs, native/portal ownership; AP-046, 054, 069, 076.
Files: src/components/FilterSelect.tsx, src/components/SelectField.tsx, src/tokens.css, src/showcase/ComponentCatalog.tsx, browser-qa/tests/ui-contract.spec.ts.
- [ ] Red: trigger resting transparent; selected facet changes actual visible list and reset restores it; search inside listbox filters options; disabled option cannot select; Escape returns focus; long label truncation retains accessible full text; no-results state and viewport collision check. Native SelectField label associates with actual select; selecting option changes form value; disabled native select remains inert.
- [ ] Remove permanent trigger background/border and redundant JSX appearance; reuse common semantic CSS. Keep native form select and existing portal implementation; retain search, positioning, arrows, listbox semantics, option markers and scroll. Verify visible active-facet cue and no layout shift.
- [ ] Green: targeted behavioral and browser tests in both themes and narrow/long-value cases. Commit.

### Slice 2 — Editable document and property inspector
Boundary: TextField and form composition; AP-051, 054, 069, 076.
Files: src/components/TextField.tsx, src/tokens.css, src/showcase/ComponentCatalog.tsx, src/showcase/showcase.css, browser-qa/tests/ui-contract.spec.ts.
- [ ] Red: empty required field is visibly identifiable before hover; label click focuses actual input; invalid submit displays associated error and retains draft; valid submit updates actual displayed synthetic record; Cancel restores saved values; read-only copy remains possible; disabled input ignores edit. Verify two instances have unique IDs/associations; long values, hint/error and multiline behavior where applicable.
- [ ] Apply quiet text field styling and current geometry; preserve native props and merge/retain valid aria-describedby and aria-invalid associations if necessary. Use one local synthetic record state plus draft in showcase (no network/storage claims). Add stacked form and aligned inspector within existing catalog; composition owns layout.
- [ ] Test a flat empty field against an underline alternative. Choose flat when discoverable in actual browser review; if insufficient, use the smallest persistent cue that meets WCAG and document exception. Multiline API remains conditional Q07; identify exact interface and approval before adding new export.
- [ ] Green: field validity, real save/cancel outcome, focus order, visual review in light/dark, mobile and zoom. Commit.

### Slice 3 — Segments and action hierarchy
Boundary: SegmentedControl existing filters/tabs modes and ActionButton; AP-046, 068, 069.
Files: src/components/SegmentedControl.tsx, src/tokens.css, src/showcase/ComponentCatalog.tsx, browser-qa/tests/ui-contract.spec.ts.
- [ ] Red: verify actual filtered rows, real tabpanel changes via arrows/Home/End, disabled skip, selected persistence under neighboring hover, invalid controlled tab recovery, stable count slots/geometry. Existing action pending/success/error test remains green.
- [ ] Remove quiet segment container fill/border/blur and selected elevation; use stable selected marker. Preserve size/density, count, icons, group/tab semantics, recovery and disabled behavior. Review ActionButton text/accent/outline, ThemeToggle, NavLinks, RangeSlider, DisclosurePill, icon actions and focus; only modify directly conflicting verified cases, with tests and bounded triage. Explicit outline remains meaningful.
- [ ] Green: targeted tests, browser input and visual state matrix; no unrelated scene changes. Commit.

### Slice 4 — Canon, publication and design harness
Boundary: library rules -> generated public docs -> agent workflow; AP-068/076.
Files: DESIGN.md, docs/patterns/interaction-states.md, docs/composition/working-surfaces.md, skills/vanya-ui/SKILL.md only if routing gap, scripts/sync.ts, scripts/markdown-publication.mjs only if mapping gap, existing docs/publication tests, existing design-lint fixtures as needed.
- [ ] Record research and decisions in docs/research/quiet-loop-2026-11-26.md, including evidence for exceptions, public source/title/author/rights, and visual acceptance. Keep normative guidance in existing canonical files.
- [ ] Red: existing publication/drift checks plus targeted test that actual public generated reference exposes the new canonical rule and no conflicting old rule; build checks published output.
- [ ] Update canon and reference generation; do not create duplicate skill or command. Verify shared token feedback; note lint policy fingerprint change because tokens.css is hashed. No blanket border/background ban, no lint bypass, no baseline recapture to hide new debt. Add deterministic lint rule only for clearly detectable harmful duplication and only with positive/negative fixtures.
- [ ] Green: bun run sync; relevant Node publication tests; npm run lint:design:pilot; build; inspect generated docs and source links. Commit.

### Slice 5 — Full review, acceptance and release candidate
Boundary: compiled public showcase, package exports and contributor harness; AP-028, 046, 056, 057, 068, 069, 075, 076.
- [ ] Run node scripts/ui-pipeline.mjs contribute --project . --dry-run then node scripts/ui-pipeline.mjs contribute --project . --json; preserve actual result (test, typecheck, build, design lint). Run npm run test:browser; existing Playwright runs build + preview. Run package smoke on exact verified SHA per versioning.
- [ ] Browser: 1440x900, 1024x768, 390x844, both themes, keyboard, touch, 200% native zoom where available, reduced motion, forced colors, accessible labels, contrast and focus visibility. Record actual observations and before/after screenshots; if native zoom or browser inaccessible mark NOT_VERIFIED. Automated accessibility tooling supplements manual review.
- [ ] Architecture circuit: actual diff; dependency traceability, runtime completeness/no parallel CSS ownership, entrypoint wiring, anti-hollow assertions; AP gates and public API comparison. Independent product circuit: interact only with compiled showcase and public package; happy search/filter/edit/save, zero-result/empty form, invalid/disabled/cancel recovery. Both must PASS; unresolved P0–P2 or missing evidence block release; triage back into bounded slices.
- [ ] Orchestrator checks full diff against initial baseline SHA (main work may use direct commits), public bundle and publication safety; retain reviewed screenshots/receipts in approved public-safe form. No private identifiers or assets.
- [ ] S10 append outcome to docs/arch-improvement/ledger.md with scope, findings, checks, residual risks and actual SHAs. S11 update docs/arch-improvement/memory.md only for durable lessons. Close cycle only with dual verification or explicit blocked status.
- [ ] Release decision: propose version from compatibility review (minor if additive/compatible appearance evolution; major if breaking contract approved; no version chosen yet). Follow docs/versioning.md, changelog, release:check, exact SHA verification, and intentional release marker policy after maintainer approval. Verify actual public site and tag separately. No deployment implied by this plan.

## S7 — critical plan review

Coverage: Q01 -> 0/1/2; Q02 -> 3; Q03 -> 1; Q04 -> 4; Q05 -> 0/1/2; Q06 -> all + 5; Q07 -> conditional decision 2; Q08 excluded. No new subsystem; walking skeleton chosen to establish public behavior before broader CSS changes.
Risks: CSS cascade across Tailwind utilities/component layer; selected-state weight layout shift; empty affordance; native select OS differences; focus clipping in sticky/overflow areas; changed policy fingerprint. Tests and visual comparisons address each. Actual exact filenames for additional tests must be confirmed from current inventory; existing browser suite path verified. Do not assume a source-only review proves rendering.
**Stop:** plan saved; S8 not started. Execution requires owner acceptance of scope/default appearance and a runnable verification environment. Local runtime, browser, release and independent reviewer evidence are NOT_RUN. No code changes or release marker in this planning step.
