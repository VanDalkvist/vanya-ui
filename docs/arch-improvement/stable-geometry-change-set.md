# Stable geometry change set — iterative review

Source: PR #26 `99993a041a677ed1f0e41986efbad00839a54885`, main `81cb01abd6088dd1050b3a86eeb5193e58324455`. Direct main updates authorized. Each slice gets a version checkpoint and a separate source/design review. No tags or consumer upgrades before the existing release gate. Browser and full build evidence must be recorded separately; source inspection does not establish UI_VERIFIED.

## Cycle 1 — 0.3.0 — canonical reference
- S0–S5: prior review found incorrect public link; `sync.ts` and publication mapping both associate working-surfaces.md with composition.md. PR #25's already merged semantic breaking change requires the minor bump per pre-1.0 policy.
- S6–S8: integrate existing proposal with both showcase links corrected; raw Markdown link opens the correct document, canonical source link keeps its section anchor. Add a publication mapping regression case. Version and dated changelog updated atomically.
- Design review (source): link placement and existing composition unchanged; correct target serves the user task. No new library primitives or consumer changes.
- Source checks: exact two broken occurrences replaced; canonical heading and both route mappings confirmed; SemVer/changelog match. Regression test added, not executed here. S9 browser/full build NOT_RUN; release UNTAGGED, UI NOT_VERIFIED.
- Next: synchronize obsolete SegmentedControl semantics in composition contract.

## Cycle 2 — 0.3.1 — semantic contract
- S4–S8: replace obsolete tabs default in the composition guide; trace `SegmentedControl.tsx` discriminated union and runtime branch, and cross-check canonical skill. Existing consumer behavior unchanged.
- Design review (source): filters change the current collection; tabs select linked panels and support composite keyboard navigation. Documentation now gives implementable instructions for both.
- Source check PASS: explicit tabs, panel IDs, filter default agree across guide, skill and component. Browser/full build NOT_RUN; UNTAGGED. Next: isolate showcase example.

## Cycle 3 — 0.3.2 — showcase boundary
- S4–S8: extract the exact existing example and its local useState into StableGeometryDemo.tsx, wired once at the original catalog position. No shared exports, new abstractions or CSS changes.
- Design review (source): unchanged DOM, states, IDs, text and styles; interaction and placement remain identical by construction. Catalog remains above the historical line budget; broader decomposition is outside this slice.
- Source check PASS: extracted markup and state byte-equivalent, single callsite, imports from public index. Browser/full build NOT_RUN; UNTAGGED. Next: improve example state coverage.

## Cycle 4 — 0.3.3 — meaningful geometry example
- S4–S8: replace invariant decorative path with deterministic state-driven samples; six states include zero/one/many/loading/partial/error, real changing points and long names. Partial has four known values, missing days omitted; error/loading show no series. Reuse library controls and preserve stable plot slot. Grid controls keep equal columns; list rows wrap; mobile remains document flow. Values are inspectable via labelled chart and native disclosure.
- Design review (source): protected plot, control grid and guide action precede variable results; chart has fixed scale, no stretched SVG; meaningful changes are visible and synthetic. The existing mobile ScrollRegion focus stop remains a browser QA item; disclosure may intentionally expand downstream content.
- Source check PASS: state/sample coverage, known-zero versus missing, stable layout selectors, no new public exports. Browser/full build NOT_RUN; UNTAGGED. Next: copy pass.

## Cycle 5 — 0.3.4 — copy and precise acceptance scope
- Source: project .agents/redpolitika.md and [ux-copy original by Lyudmila Sarycheva and Nikita Arkhipov](https://github.com/N1arko/redaktura-skills/blob/main/ux-copy/SKILL.md), read for this cycle. Original instructions not copied into the project.
- S4–S8: concrete heading, scenario selector labels, next step for empty/error, meaningful count/partial status, one canonical document link before the variable results. Remove redundant caption and link. Name protected elements and intentional reflow in the composition contract.
- Design review (source): one primary example control group and one help action; short labels, calm copy, no fake claims or promises. Source checks PASS: replacements applied, exactly one reference link, guide and demo agree. Browser/full build NOT_RUN; UNTAGGED. Next: add a geometry regression oracle.

## Cycle 6 — 0.3.5 — geometry regression gate
- S4–S8: add isolated Playwright spec to existing testDir, no new runner or dependency. Four widths × two themes; compare document-relative rectangles (1 CSS px), allow mobile list height and intentional disclosure reflow; verify actual series/list data, keyboard selection, empty/error/loading/partial and return to baseline. Deliberate margin mutation must be detected by same oracle. Capture screenshots for manual review.
- Design review (source): equal-weight selector labels and minimum height permit wrapping without changing geometry upon selection; test targets the specific protected controls rather than entire page. No snapshot approval fabricated.
- Source review PASS: test locators checked against actual showcase, negative control uses same geometry function, config builds compiled dist. Browser/full build NOT_RUN; UNTAGGED. Next: run actual gate, record receipts or blocker.
