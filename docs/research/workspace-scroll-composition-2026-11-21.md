# Scroll ownership and composition — Vanya UI

Public design-system guidance. This document uses **invented sample content**; it contains no application records, credentials or internal routes.

## One owner for each vertical gesture

On desktop an editorial workspace may have **two adjacent** vertical scroll regions: a selectable collection and a reader. They must be siblings, not nested. The product header and route rail are outside those scroll regions. Keep the filters in the collection's non-scrolling area; the long article heading can scroll away.

On compact viewports, prefer **one vertical scroll owner** for the page. A collection can become a short horizontal chooser with a visible clipping cue. Avoid long vertical list inside long vertical reader. Do not auto-hide the global header on every wheel event: this creates moving targets.

## Which parts persist?

| Part | Desktop | Narrow / short viewport |
| --- | --- | --- |
| Product identity and command entry | Stable compact top bar | Stable, no second header |
| Main workflow | Stable side rail | One horizontally scrollable route |
| Search / filters for list | Above list scroll | Flow with list; not sticky over reader |
| Article title, explanatory hero | Scrolls away | Scrolls away |
| Context action for article | Sticky **within reader only** | Ordinary flow |
| Editor save/status | Flex sibling footer outside textarea | Ordinary flow if height is constrained |
| Detail inspector close / title | Fixed panel header, detail scrolls | Entire panel scrolls below 600px high |
| Secondary details | Disclosure / inspector | Same, never an extra page-fixed layer |

## Implementation building blocks

- `WorkspaceSplit` provides measured grid geometry and guaranteed `min-width:0; min-height:0`; slots are composition only, not automatic scrollers. Use `compact="keep-columns"` only for bounded previews, otherwise default `stack`.
- `ScrollRegion` makes a named, keyboard-reachable vertical or horizontal scroll owner. Give it a **height-constrained parent**. Never nest vertical `ScrollRegion`.
- `SectionToolbar` is an unpinned context heading, count, and controls. Put only persistent search/filter controls outside a scroll region.
- `WorkspaceActionBar` with `placement="footer"` is a flex sibling of an editor scroller; `placement="sticky"` is only for last content in a single scroll context.
- `InspectDrawer` always has a reachable close button. Its inner scroller is focusable and labelled; in short windows the entire sheet scrolls.
- The library styles scrollbars only on intentionally scrollable UI primitives, never globally on `*` (which changes textareas and embedded consumer interfaces).

## Failure cases to test

1. Wide but short browser window (1440×550): no text under fixed action bars.
2. 200% zoom / 320×568: keyboard focus visible in every region; the panel remains dismissible.
3. Long collection, short item: list wheel doesn't change reader position.
4. Item switch after reader scrolled to bottom: new article begins at its heading, but list position is retained.
5. Drawer with hundreds of graph edges: close remains reachable; no background body scroll.
6. RTL and long unbroken headings: columns can shrink without horizontal document overflow.

## Sources

- NN/g, Sticky Headers: https://www.nngroup.com/articles/sticky-headers/
- Atlassian, layout scroll areas: https://atlassian.design/components/navigation-system/layout/usage
- Primer, split-page layout: https://primer.style/product/getting-started/foundations/layout/
- MDN, sticky containing scroller: https://developer.mozilla.org/en-US/docs/Web/CSS/position
- W3C, unfixing headers at 200% zoom: https://www.w3.org/WAI/WCAG22/Techniques/css/C34
- W3C, focus not obscured: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
