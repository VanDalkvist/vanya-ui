# Composition patterns: workspaces, filters, and compact headers

A reusable UI assembly guide for applications that users revisit and operate, rather than promotional landing pages. These are composition principles on top of existing Vanya UI tokens and primitives, **not** a new visual theme.

## Contents

- [1. Put the job before the introduction](#1-put-the-job-before-the-introduction)
- [2. Separate navigation from filtering](#2-separate-navigation-from-filtering)
- [3. Sticky elements must earn their pixels](#3-sticky-elements-must-earn-their-pixels)
- [4. Keep actions next to the thing they affect](#4-keep-actions-next-to-the-thing-they-affect)
- [5. Maintain one source of visual truth](#5-maintain-one-source-of-visual-truth)
- [Divider ownership and visual grouping](#divider-ownership-and-visual-grouping)
- [Persistent context without competing headers](#persistent-context-without-competing-headers)
- [Interaction feedback across workspaces](#interaction-feedback-across-workspaces)
- [Acceptance checklist](#acceptance-checklist)
- [6. Navigation is a URL, not a button pretending to be one](#6-navigation-is-a-url-not-a-button-pretending-to-be-one)
- [External author and source utilities](#external-author-and-source-utilities)
- [7. Separate utility/admin navigation from daily tasks](#7-separate-utilityadmin-navigation-from-daily-tasks)
- [8. Media catalogues and searchable collections](#8-media-catalogues-and-searchable-collections)
- [9. Loading the workspace without blanking it out](#9-loading-the-workspace-without-blanking-it-out)
- [10. Single-row sticky catalogue filters](#10-single-row-sticky-catalogue-filters)
- [11. Stable geometry during ordinary workspace interaction](#11-stable-geometry-during-ordinary-workspace-interaction)
- [Quiet document editing and contextual commands](#quiet-document-editing-and-contextual-commands)

## 1. Put the job before the introduction

Use a compact **workspace header**: 1 short title and, optionally, a small contextual count. The first actionable result or form control should begin near the top of the page.

Avoid oversized, repeated titles, hero paragraphs, and duplicate section headings in frequently used tools. A landing-page hero does not become a good dashboard header simply because it uses the right typeface.

## 2. Separate navigation from filtering

- `NavLinks` names **primary destinations**, not every available capability. Aim for few stable destinations.
- `SegmentedControl semantics="filters"` changes the **subset** within the current context, e.g., All / Mine / Shared. As a filter, it exposes a labeled `group` of pressed buttons to assistive technology.
- `SegmentedControl` defaults to filters; specify `semantics="tabs"` for actual tab navigation. Supply `tabId` and `panelId` for each tab and render the associated `tabpanel`. Tabs use arrow keys, Home/End and roving focus. Keep the controlled value and visible panel aligned when changing items. If a selected tab is removed or individually disabled, the enabled tablist requests the first available tab through `onChange` once per invalid value/fallback pair. The owner must update value and panel together. If all tabs or the group are disabled, no recovery is requested. Filters never auto-select.
- `Tag` and `Badge` display passive metadata. Use `Tag` for an inline topic, `Badge` for a compact category or readable status. Use `SegmentedControl` for a group of selectable categories, or `ActionButton` with `aria-pressed` for an independent toggle; convey selection and result count.
- Prefer one common search input that searches the whole underlying collection, not a silently narrower derived subset.

If a user must change sections just to complete an ordinary `find → select → compare` loop, the composition likely needs to change.

## 3. Sticky elements must earn their pixels

- Desktop: one compact persistent main header; optionally a **single contextual filter row** directly below, only if it truly helps in long lists.
- Mobile: avoid stacking sticky global chrome and sticky filters when they compete with the content. Let the task filter strip scroll away if necessary.
- Use a single document scroll; avoid nested vertical scroll areas by default. For a stacked `WorkspaceSplit`, release the parent height and the vertical `ScrollRegion` height/overflow at the compact breakpoint (850px in the current primitive). The caller owns this layout decision; stacking the columns alone does not release an explicitly bounded child. Preserve independent scroll ownership in wide, bounded workspaces. Give a list/detail specimen the full available width when the split documentation column would squeeze its reader.
- Avoid hiding the first actionable item under sticky surfaces when using focus navigation or anchored links.
- Use semantic DOM reading order matching visual order.

References: [NN/g Sticky Headers](https://www.nngroup.com/articles/sticky-headers/), [NN/g Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/).

## 4. Keep actions next to the thing they affect

- Use `ActionButton` for quick, frequent decisions beside the item.
- Use `InspectDrawer` for rich details and optional advanced editing; don't force the drawer open for the primary one-click action.
- Inside an entity inspector, **show the overview first and move rarely used edits into an explicit disclosure**. Use [entity inspector guidance](../patterns/entity-inspectors.md) to separate evidence, actions and form fields.
- Use `CraftCard` for meaningful task surfaces/settings, not to wrap every line of text.
- Keep owner/administrator tools secondary unless administration itself is the current task.
- An empty result should suggest the nearest useful action, not blindly navigate to another page.
- Provide alternate candidate content if the primary filter yields no hits, when safe and meaningful.

References: [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [NN/g User Intent Affects Filter Design](https://www.nngroup.com/articles/applying-filters/).

## 5. Maintain one source of visual truth

Use Vanya UI's own `tokens.css` and real exported React components. Local app CSS should define *layout and domain composition*, not duplicate the components and colors from the design system.

`--ground`, `--surface`, `--ink`, `--ink-soft`, `--ink-faint`, `--accent`, and `--border` are semantic tokens; avoid hardcoding theme palettes.

## Divider ownership and visual grouping

Use spacing and headings to establish the hierarchy of content. Give a visible boundary exactly one owner (container or adjacent row). A divider needs a clear role: separate adjacent scan rows, mark a functional boundary between surfaces, or preserve the outline of an interactive element.

- Narrative prose, editorial comparisons and parallel explanatory blocks: use whitespace, aligned baselines and headings; omit decorative outer lines around each block.
- Flat repeated rows: use one 1px semantic border between adjacent rows, for example `.row + .row { border-top: 1px solid var(--border); }`. The first and last exterior edges are open unless the list itself needs a functional boundary.
- If an entire group needs a line, place one on its shared boundary. Avoid combining a container edge with near-parallel edges of its children. For a two-column grid, divide at row boundaries only when helpful; review the single-column arrangement separately.
- Keep functional boundaries for input affordance where needed, focus, pane ownership, sticky chrome, table structure and real contained surfaces. Quiet controls use transparent resting surfaces; editable form fields retain a stable bottom line at all values. Respect accessibility and contrast requirements; do not globally lower border opacity to compensate for excess lines.
- Review adjacent groups together in light/dark and at 320/390/1024/1440 CSS px. Count redundant visible boundaries and confirm information groups are still apparent through spacing and alignment. Browser evidence is required for visual acceptance.

Showcase examples: [Typography](https://ui.vanya-arc.dev/#typography), [Writing](https://ui.vanya-arc.dev/#writing).

## Persistent context without competing headers

The shared app topbar is **one stable surface on every route**: same size, alignment, border and page gutter whether the user is on a dashboard or a bounded master–detail workspace. Use `WorkspaceContextHeader` inside it for real breadcrumbs; `breadcrumbSize="large"` is the reusable 16px/14px reading scale, while the compact default stays backward compatible. Do not adjust a topbar through view-specific CSS as a shortcut for page padding. Dashboard content and workspace content may follow different scroll policies *beneath* that shared chrome.

For a product workspace with many modules, the **project identity can persist directly above a changing reader**. Treat it as a flex/grid sibling to one `ScrollRegion`, not another floating sticky topbar. Keep common identity/status and the next important action compact; move long stage history and full link lists into the overview. No extra fixed identity for unrelated one-page readers. Reference: [fixed context master–detail contract](../patterns/list-detail-composition.md#продолжительная-идентичность-fixed-context--masterdetail).

## Interaction feedback across workspaces

Hover — feedback, not selection. Use [the canonical interaction state contract](../patterns/interaction-states.md) for icon utilities, links, navigation, menus and selection controls. Keep selected/expanded state visible after pointer exit, visible 2px focus rings for keyboard access, and no hover-only content or sticky touch hover. A neutral utility link and an expressive narrative scene need **different** treatments; do not apply lift/shadow to every surface.

## Acceptance checklist

- Can a first-time user identify the primary task without reading a long description?
- Does the first screen contain an actionable item or primary input on common laptop/mobile viewports?
- Can the user complete the most frequent loop without page round-trips?
- Are all filters labeled, visually selected, keyboard accessible and announced correctly (group vs. tabs)?
- Does search work across the expected collection with clear scope?
- Is there a useful path out of empty and no-match states?
- Are touch targets comfortable, focus visible and reduced-motion respected?
- Is there one document scroll and no stuck content beneath the header?

These are guidance and design QA checks, not a universal pixel-perfect template.


## 6. Navigation is a URL, not a button pretending to be one

- `NavLinks` with `href` renders real `<a>` elements. Same-origin SPA navigation may intercept ordinary clicks, but must not interfere with Ctrl/Cmd-click, browser context menu, middle-click, keyboard navigation or copying the address.
- Use `ActionLink` for link-looking actions and `ActionButton` only for **mutating actions**. A link to another resource must have a valid `href`.
- Expose stable, directly-openable URLs for primary views, important detail entities and help/documentation. Browser back/forward should restore the selected view.
- Externally opening links use a clear outbound cue, `target="_blank"` when appropriate, and `rel="noopener noreferrer"`. Avoid `javascript:` or other non-web URL schemes from imported data.
- A secret one-use invitation URL is different from a normal help link. Warn that visiting it will consume the invitation; offer a copy action. Never add its token to analytics or navigation destinations.
- Test opening a film/item in a new tab, copying its URL to another browser, using Back/Forward, and following a source link without first navigating a drawer.

This pattern is shared across all React apps built with Vanya UI.

## External author and source utilities

A topbar can have three levels: product identity, primary internal navigation and small utility links. Don't style the author's personal homepage as another in-app section or show a bare domain without its purpose. Use the library's `ActionLink` in the utility group for the **author's name** with a subtle outbound arrow and `rel="author"`. Reserve the standalone `GitHubIcon` for a recognisable GitHub source link with accessible text and visible focus. No extra brand palette, underlined raw hostname or second hero. On small screens shorten “Ваня Афанасов” to “Автор” *without hiding the link*. The app determines the actual author; the library owns link appearance.

[Research and acceptance](../research/author-source-utility-link-2026-11-22.md).

## 7. Separate utility/admin navigation from daily tasks

- Primary navigation names stable, frequently used destinations. In a compact app, keep three meaningful destinations rather than creating a tab for every technical operation.
- Put owner-only integrations, API keys, permissions, import sources and account configuration under a **labeled, persistent Management link** in the top-right utility area. It must be accessible from every working view, not buried behind a rarely used upload form.
- Put actual import/upload actions next to the collection they affect. API credential lifecycle belongs in Management, not inside the import wizard.
- Use real `NavLinks` anchors and `ActionLink` from Vanya UI, so keyboard navigation, Cmd/Ctrl-click, copy-link, and back/forward remain browser-native.
- When one action can affect multiple members, name the recipient explicitly and default it to the signed-in owner. Use `SelectField` with `allowEmpty={false}` to avoid an ambiguous "All" recipient.
- Preserve mobile header composition: place daily destinations together and owner utilities separately; do not rely on unlabeled gear icons.

References: [NN/g utility navigation](https://www.nngroup.com/articles/utility-navigation/), [NN/g information architecture](https://www.nngroup.com/articles/ia-study-guide/), [Material primary navigation](https://m1.material.io/components/bottom-navigation.html).

## 8. Media catalogues and searchable collections

Use the exported `MediaCard`, `SearchField`, `TextField`, `SectionToolbar variant="section"`, `SegmentedControl semantics="filters"`, `SelectField` and `ScrollRegion orientation="horizontal"` rather than duplicating their HTML and control styles inside each app. They are presentation primitives, not film-specific objects.

- `MediaCard` supports `layout="poster"|"row"`: native artwork and title anchors, optional `eyebrow`, `subtitle`, `meta`, `overlay`, `footer` and `onNavigate`. Pass complete semantic media data and app-specific decisions through slots. **Don't** put provider logic, watchlist state, hardcoded themes or icon sets in the shared component.
- `SearchField` is controlled by `value`/`onValueChange`, has an explicit accessible label and a clear button. Search/filter behavior remains in the application.
- `TextField` supplies a real visible label, 40px keyboard-friendly control, optional hint/error and reserveNote for expected validation, and semantic focus states. Use it for account, invite, token and other form inputs instead of local `.text-input` imitations. Validation and submission remain with the consumer.
- `SectionToolbar variant="section"` displays a meaningful subheading using the shared Manrope scale. The default `compact` variant preserves existing dense toolbars.
- Keep search and selected scope in the first row, a handful of common filters immediately available, and rarer filters in a clearly labeled disclosure. Preserve all existing filter capabilities and a visible reset affordance when active.
- Poster imagery needs a proper aspect ratio, descriptive alternative and enough resolution. Source retrieval and fallback strategy belong to the **domain app**, not the generic `MediaCard`.
- A large grid should not repeat every available field beneath every poster. Prioritise a visible title, one informative subtitle, one correctly attributed score, and the main state/action. Further details belong in the existing `InspectDrawer`.
- Do not shrink functional text to 9–11px to fit more columns. Use `ui-type-heading`, `ui-type-subheading`, `ui-type-compact` and `ui-type-caption`, adjusting column count before reducing typography.
- On narrow widths, wrap the controls naturally. For a short horizontal media collection, use one labeled `ScrollRegion`; the main catalogue should use normal document scrolling.

```tsx
<SectionToolbar title="Коллекция" variant="section" count={filtered.length} total={items.length}/>
<SearchField label="Поиск по коллекции" placeholder="Название" value={query} onValueChange={setQuery}/>
<SegmentedControl semantics="filters" aria-label="Чья коллекция" value={scope} onChange={setScope}
  items={[{id:"all",label:"Все"},{id:"mine",label:"Мои"}]}/>
<MediaCard title={item.title} href={item.href} artwork={<img src={item.image} alt={item.title}/>}
  subtitle={item.year} meta={item.author} footer={item.actions}/>
```

This pattern is intended for films, books, games, playlists, courses and other artwork-led collections. Reference: [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [Baymard product list scanning and essential attributes](https://baymard.com/research-articles/product-listing-information).

## 9. Loading the workspace without blanking it out

Use Vanya UI's `LoadingRegion` with `Skeleton`, `SkeletonText`, and `MediaCardSkeleton`. Real stable chrome and known headings remain visible. Unknown rows and covers adopt the eventual layout's geometry; error handling replaces skeletons with a recovery affordance, not indefinite animation. Announce one loading state per area; decorative blocks are unfocusable, reduce motion disables pulsing. [Full loading pattern](../patterns/loading-states.md), [public demo](https://ui.vanya-arc.dev/#loading-states).

## 10. Single-row sticky catalogue filters

For long catalogues on desktop, use a **single compact sticky filter row** below the persistent app header. Keep the title and result count above the row. Its job is search + current scope + a few frequent selectors + a clearly labeled entry into the remaining facets; it is not another form screen.

- Use `SearchField density="toolbar"`, `SegmentedControl density="toolbar" semantics="filters"` and **`FilterSelect`**. Their **40px shared control height**, transparent resting surfaces and contextual feedback come from Vanya UI. `FilterSelect` renders a styled, searchable listbox through a portal (with keyboard support), so browser/OS-native menus cannot escape the brand or get clipped by the sticky toolbar. Keep `SelectField` for ordinary forms where native select behavior is desirable.
- Put rare and overflowing selectors inside one accessible, dismissible filter disclosure. It should overlay the content (with an appropriate max-height and scroll of its own) instead of pushing poster cards down. Keep selections synchronized with visible controls and show a filter count when active.
- Make the app-specific **filter dock** sticky at exactly the real header height. It needs a solid enough background, a modest separation line, a z-index below the header and visible keyboard focus. Do not use `position:fixed` to remove it from the document flow. Test scrolled positions and direct-linked cards; sticky elements must not obscure focused content.
- At widths below what the complete row can hold, move secondary selectors into the disclosure instead of wrapping the dock into a large second row. On small phones, retain search + the filter action in one line; current scope selection stays available inside the filter disclosure.
- Match the page gutter to the actual viewport without hardcoding a narrow `max-width` on the data catalogue. Typographic reading columns may remain narrower, but a grid of posters benefits from the available viewport.
- The component package owns appearance and control semantics, while the consuming app owns sticky offset, which facets matter, their domain values, breakpoints, and filtering logic. Do not introduce a shared component that assumes movie-specific names or fields.

```tsx
<div className="my-app-filter-dock">
  <SearchField density="toolbar" label="Поиск" value={query} onValueChange={setQuery}/>
  <SegmentedControl density="toolbar" semantics="filters" aria-label="Чьи записи" value={scope} onChange={setScope}
    items={[{id:"all",label:"Все"},{id:"mine",label:"Мои"}]}/>
  <FilterSelect label="Жанр" value={genre} onValueChange={setGenre} searchable options={genres}/>
  <ActionButton onClick={()=>setMoreFilters(open=>!open)}>Фильтры</ActionButton>
</div>
```

See [NN/g — Sticky Headers](https://www.nngroup.com/articles/sticky-headers/) and [NN/g — Applying Filters](https://www.nngroup.com/articles/applying-filters/). The 40px value and responsive composition are **our own implementation choices**, not attributed to those external authors.


## 11. Stable geometry during ordinary workspace interaction

**Goal:** preserve the user's spatial anchors while the data, selection and state change. For an unchanged viewport, zoom and page, frequently used controls, primary navigation, chart viewport, and nearby independent task surfaces should remain at the same coordinates during filtering, selecting, loading and background refresh. A responsive breakpoint, deliberate document expansion, text zoom, or navigation may legitimately change the layout. Preserve access to all content.

Before implementation, name the protected elements for each task (e.g. the period selector, chart plot and refresh button), the transitions under test and the variable-size regions. Record which downstream elements may intentionally reflow. Do not treat every element on the page as a protected anchor. Compare at least empty, one item, many items, long names, loading, partial results, error, and successful refresh. A list or legend with unknown length must not accidentally determine the height or width of unrelated controls.

- **Separate spatial ownership.** Put persistent controls and related results in a stable grid. Give an independently changing desktop list a bounded, keyboard-accessible `ScrollRegion` with stable gutter when this preserves the primary interaction. Use document flow on narrow screens; place variable-length results after independent actions when practical. Do not introduce nested scrolling for an ordinary document.
- **Reserve the appropriate space.** Keep the chart/preview viewport, axis label gutter, control hitbox, and loading geometry consistent; use responsive dimensions, not content-dependent SVG aspect ratios. Retain known data during revalidation when authorized, with truthful snapshot/loading/error state. Replace skeletons inside the same result slot. A missing observation is not a zero.
- **Constrain by role.** Multi-line prose and actionable rows need intrinsic height and text reflow. Short labels may have stable slots, tabular numerals, consistent font metrics and an accessible full label when visually abbreviated. Avoid changing font weight or border width if that moves neighboring controls. A fixed-height `ActionButton` is for compact actions, not multi-line result rows.
- **Keep disclosure local.** Technical detail may live in an accessible overlay or after the primary task surface. Opening a status detail should not move an unrelated filter, graph, or input. Reserve scrollbar space on scroll owners where classic scrollbars would otherwise change geometry. Do not globally disable scrolling or hide necessary warnings.
- **Charts:** preserve the plot rectangle while filters change. Keep series identity/colors stable where the comparison refers to the same series; label a changed scale. Distinguish zero, missing, and partial data. Keep the active date/filter stable when still valid. A smoothing method is a visualization decision; the actual values must remain inspectable.

### Acceptance and evidence

At the same viewport size, capture anchor bounding rectangles before/after: first load → ready; period A → B → A; selected result 0 → 1 → many; toggled series; open/close disclosure; pending → success/error; scrollbar absent → present. Check keyboard focus and actual hit targets. Use `getBoundingClientRect()` or Playwright `boundingBox()` with an explicitly chosen small tolerance (e.g. 1 CSS px in a controlled test), plus visual review. Test 1440, 1024, 390, 320 CSS px and zoom/text spacing as applicable. Allow intentional reflow for changed viewport, accessible text enlargement, or explicitly expanded content; test stability of unaffected anchors. Never enforce this by clipping content or shrinking typography.

CLS is a useful complementary signal for unexpected page shifts. It excludes some shifts immediately following user input, so a low CLS alone cannot verify an interactive workspace. This anchor-based acceptance is a local Vanya UI design decision. Do not promise a global zero-CLS score based on one test.

References (independent sources; no copied method or layout):
- Google web.dev, [Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls/) and [Cumulative Layout Shift](https://web.dev/articles/cls/): reserved geometry, async content, and recent-input exclusions.
- MDN, [scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter): reserving space for classic scrollbars.
- W3C, [Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow): accessibility constraints on constrained geometry.
- Existing local contracts: [loading states](../patterns/loading-states.md), [interaction states](../patterns/interaction-states.md), [typography](../patterns/typography.md), and the scroll-owner rules above.

## Quiet document editing and contextual commands

Expose editable properties directly where safe. For a multi-field draft use visible labels, validation, an explicit save and recoverable cancel. Use ActionButton for commands, ActionLink for navigation, and aria-pressed for a persistent toggle with a readable state cue. Neutral and accent text actions share the same transparent plane. Reserve prominent confirmation for meaningful decisions. Show VersionLabel with the actual caller-provided SemVer as passive header metadata, aligned to the right in the utilities group; keep it visible across responsive layouts.

### Documentation chapter composition

Use a consistent chapter header (heading and short description on one leading axis), optional meaningful metadata, and a bounded reading measure. Keep the first screen's H1 distinct. Rule rows use compact metadata gutters and aligned title/body/examples; passive key/value examples can use scan-row separators. Interactive specimens retain meaningful preview space. Assign visible numbers only to ordered steps, ranks, stable citations or actual shortcuts. For independent destinations use named links and native keyboard navigation. Introduce additional accelerators only after observing a repeated task. The showcase uses no decorative numbering or global letter-navigation layer. Reference routing: [design canon](../research/design-reference-canon-2026-11-27.md).

### Shared documentation rows

All eight showcase chapters use the same private CatalogSection shell with one heading, optional explanatory text and actual content. Split rows share a 1:2 axis and stack at narrow widths. Wide rows use the full content width for substantive specimens and meaningful comparisons (brand marks, typography scales, bilingual reading, energy visualization). Nested typography samples reuse the same column definition. Reading content retains a bounded measure; independent links keep their own spacing and feedback. Related controls, results and explanatory notes are grouped as a single specimen. Chapter shell stays private to the documentation until a real consumer scenario justifies a public primitive.

### Header role boundaries

Use SectionToolbar for an in-flow list title, result count and tools; SurfaceHeader for an in-flow document title with optional inspector collapse anchor; WorkspaceContextHeader for navigation and promoted context inside the existing application shell; StickyContextBar for an autonomous reader without a persistent context slot. Keep the footer action bar separate. Share typography and feedback through existing tokens. At compact widths allow ancestors, context title and necessary commands to wrap; preserve each actual link, its focus and native history. The application owns the shell's available height and layout. Use a wide documentation specimen for a complete application header, with demonstration controls outside the simulated shell.
