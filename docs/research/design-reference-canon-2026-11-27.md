# Design references and composition decisions — 2026-11-27

Status: canonical reference routing; proposed showcase composition repair and select-state refinements await implementation and rendered acceptance. Owner explicitly designated Linear, Apple and shadcn/ui as primary references. These are independent Vanya UI interpretations. All linked works are reference-only; no upstream assets, text, styles or code are copied. Preserve Vanya UI identity, accessibility and existing public contracts.

## Reference hierarchy

| Reference | Role | Primary sources | Application |
| --- | --- | --- | --- |
| Linear | Primary visual/product design reference for dense desktop software | [A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh), Charlie Aufmann and Maxime Heckel, March 12 2026; [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui), Linear, 2024; [Filters](https://linear.app/docs/filters), Linear Docs | Predictable placement, shared alignment, reduced decorative boundaries, visual weight proportional to purpose, compact contextual controls. |
| Apple | Primary interaction, hierarchy, layout and accessibility reference | Apple Human Interface Guidelines: [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles), [Layout](https://developer.apple.com/design/human-interface-guidelines/layout), [Typography](https://developer.apple.com/design/human-interface-guidelines/typography), [Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection), [Menus](https://developer.apple.com/design/human-interface-guidelines/menus), [Pop-up buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons), [Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables), [Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) | Deliberate alignment, logical information hierarchy, visible action affordances, separate focus and selected state, context-sensitive selection indicators. |
| shadcn/ui | Primary design-system engineering and documentation reference | [Introduction](https://ui.shadcn.com/docs), [Select](https://ui.shadcn.com/docs/components/select), [Tabs](https://ui.shadcn.com/docs/components/tabs), [Field](https://ui.shadcn.com/docs/components/field), shadcn/ui authors and contributors | Open inspectable source, consistent component anatomy, predictable composition, registry and CLI distribution, accessible behavior, executable examples. Its default styles are examples; Vanya UI owns its own visual choices. |

For a UI task consult the relevant primary sources; use actual examples where available, identify the interaction role, then compare with the installed Vanya UI API and canonical tokens. Record source URL, observed principle, local decision and verification evidence. Do not claim a reference uses a particular pixel value or screenshot styling unless directly observed. Where references differ, prioritize task clarity, accessibility and the existing Vanya UI visual canon. Offline work may use these recorded decisions with explicit limitations.

## Composition review: documentation showcase

Owner supplied screenshots of Typography, Writing and Principles; screenshots are private review input and are not stored in this public repo. Source review corroborates inconsistent anatomy: Typography shows only 03; Writing shows title + number; catalog/workspace omit the eyebrow; Guide reserves roughly one third of a content row for a two-digit number. CSS has section-specific heading margins and parallel row structures. Hero composition has a distinct H1 role.

Proposed single documentation grammar:
- Main chapter: stable anchor + semantic heading + optional short intro, on a shared leading axis. Use one restrained chapter index above the heading, with a consistent number format (02–09); omit redundant category words. Preserve hero H1 as the introduction, not another H2. A title describes the chapter.
- One common header anatomy in showcase, private to documentation; avoid a new public component until a consuming need is established. One typography/spacing owner. Existing chapter anchors and accessible heading relationships remain stable.
- Inside a chapter: distinguish prose, scan-friendly rule rows, and interactive specimens. Prose uses constrained reading measure. Rule number occupies a small intrinsic/fixed index column, followed by title, description, optional evidence/example/link, all aligned to the same content axis. Remove the oversized empty number gutter. On narrow screens retain meaningful order and avoid horizontal overflow.
- For component specimens a label/description beside a real interactive preview may use a meaningful two-column grid; use a shared row anatomy, with heading and content aligned and intentional mobile stacking. Parallel comparisons share baselines. Avoid surrounding independent examples with extra decorative surfaces; keep functional preview boundaries.
- Use a consistent spacing rhythm from existing tokens; adopt exact values only after checking the actual typography scale and rendered light/dark/mobile examples. Distinguish chapter separation, subsection separation and adjacent items by relative spacing. Preserve stable anchors, scroll behavior and existing demonstrations.

## Selection feedback

A single global selected-fill rule is too coarse. Distinguish menu option, applied facet, segmented choice, navigation row and toggle.

| Context | Persistent state | Momentary feedback |
| --- | --- | --- |
| Single-choice dropdown/listbox option | Checkmark + selected semantic state; accent optional under Quiet; transparent resting row | Soft hover or keyboard-active layer; focus indicator stays visible |
| Closed filter trigger | Current value, chevron, accent for a genuinely applied facet | Hover/expanded/focus feedback as appropriate |
| Closed property trigger | Neutral current value and chevron | Hover/expanded/focus feedback |
| Segmented tabs / filter segments | Clearly distinguish selected segment, e.g. restrained surface, with stable geometry | Hover and pressed remain distinguishable |
| Navigation list | Persistent selected-row highlight when needed for orientation | Separate hover/focus |
| Toggle | Existing aria-pressed plus stable visible state indicator when requested | Separate hover/press/focus |

Apple's menus and list/table guidance supports checkmarks for selection; the menu's active highlight communicates navigation. Linear's refresh supports reducing visual weight and excess decorative treatment. shadcn Select documents trigger/value/content/group/item composition and Tabs offers alternate presentations. The specific Quiet proposal follows these principles; it is not an assertion that all three implement identical visuals.

Current FilterSelect already renders a check and selected semantic state. Its keyboard-active row gets a soft background and initial active index is set to the selected option when opening. Hence a selected option can appear filled immediately on open even when the selected selector itself has no background. Preserve meaningful initial keyboard position. Review whether pointer-open should display a softer active indication until keyboard movement; maintain visual and assistive focus for keyboard-open, selected checkmark when focus moves, disabled handling and keyboard navigation. Do not remove popup surface or keyboard focus to eliminate an apparent duplicate fill. A screenshot alone cannot distinguish selected versus active index.

## Verification before closing an implementation slice

- Compare chapter heading geometry, index column widths, text measures and specimen alignment at 1440, 1024, 390 and 320 widths; both themes, 200% zoom. Verify section URLs, headings and anchor landing.
- Dropdown: selected value and check visible, pointer hover on a different option, ArrowDown/Up, Enter, Escape, search, disabled options, forced colors; assert actual changed value and closed trigger. Separate selected and active cues without relying on color alone. Compare pointer-open and keyboard-open.
- Keep CI, actual compiled browser checks and independent review separate. Increment SemVer when shipping the substantive checkpoint; use existing release process.

## Numbering and functional elements — follow-up

Every visible element needs an orientation, action, state or informational function. Use ordinal numbers for ordered procedures, rankings, stable reference IDs or genuine navigation mappings. Named independent chapters are directly addressable by native fragment links. Linear [Inbox](https://linear.app/docs/inbox) documents G then I and [shortcut help](https://linear.app/changelog/2021-03-25-keyboard-shortcuts-help) exposes discovery; Apple [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards/) preserves familiar shortcut conventions; shadcn [Sidebar](https://ui.shadcn.com/docs/components/radix/sidebar) uses named navigation groups. Reference-only; original synthesis. Current showcase already supports mnemonic G+letter navigation and a persisted off switch. Recommendation: drop decorative chapter/rule numbers unless they serve a confirmed reference or sequence role; avoid redundant numeric shortcuts. Owner decision on removal remains open. Existing numbers retained for now, category repetition removed and gutter compacted.

## Accepted follow-up — functional composition
Owner requested execution of remaining findings. Decorative chapter/rule numbers and global showcase letter navigation are removed; stable named anchors and standard keyboard access remain. All nine named destinations wrap in the existing header, avoiding hidden horizontal overflow. The earlier numeric-gutter proposal is superseded. Public keycap primitives remain reusable. Validate actual rendered geometry before acceptance.
