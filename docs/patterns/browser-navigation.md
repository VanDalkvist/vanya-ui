# Browser navigation and addressable views

**Status:** required Vanya UI product pattern, 2026-11-21. **Live reference:** https://ui.vanya-arc.dev/#browser-navigation

## Rule

**Every meaningful page, resource, or shareable view has a stable URL. Native browser navigation works by default.** People must be able to copy and share the address, open it directly or in another tab, reload, and use Back/Forward without losing their place. This is an application-level contract; the UI library does not select or bundle a router.

A “page” is a user-perceived destination (a project, item, detail, settings area, step, or independently useful workspace), even if the app is technically a SPA. Not every click, transient overlay, hover, accordion or form draft needs its own URL.

## Address model

| State | Where | Example |
| --- | --- | --- |
| Resource / page / detail | Path | `/projects/ferma`, `/films/42`, `/settings/tokens` |
| Shareable view (active subpage, filter, sort, search) | Path or query | `/films?list=mine&sort=added`; `/projects/ferma/activity` |
| Anchor within a document | Fragment | `/guidelines/navigation/#acceptance` |
| Uncommitted form edits, hover, temporary popover | Local state | No URL change |
| Dialog showing a shareable resource | Addressable route (may render as modal) | `/films/42`; direct load renders the detail page |
| Temporary confirmation dialog | Local state | No URL change |

Choose a canonical URL for each state. Don't use a meaningless `?view=home` as a substitute for actual paths if navigation structure is available. Avoid routing by hashes (`/#/projects`) when normal paths and server fallback can be provided. Query parameters should be deterministic, readable and restore the same meaningful view.

## Native browser contract (MUST)

1. **Real links for navigation.** Use `<a href="/...">` or a framework `Link` that renders `<a href>`. Browser context menu, Cmd/Ctrl-click, Shift-click, copy link and keyboard activation continue to work. Never use `<div onClick>` or an action button as the primary way to go to another page.
2. **Buttons for actions.** Local state, submission, disclosures and commands use `<button>` (or form controls). Changing a resource, page or shareable view is navigation, even when it visually resembles a tab.
3. **Back and Forward restore the page.** Every meaningful navigation pushes history. Use replace only for canonicalization, correcting invalid URL state or other explicitly non-visit changes. In SPAs, the router must listen to history and reconstruct the view, including the initial entry.
4. **Direct loading and refresh work.** The hosting server resolves all valid paths to the right page/app entry, returns a real 404 for unknown resources, and does not require starting at `/` before following a link. Route params are validated; auth-guarded URLs preserve a return destination through login.
5. **Accessible transitions.** Update `document.title` for the new page and announce/navigate focus to the new main heading on client-side page transitions. Restore scroll position for Back/Forward; scroll to the start or to the URL fragment on new navigation as appropriate. Mark the active link with `aria-current="page"` (or `location` for anchors).
6. **Stable semantics under failures.** Failed fetches, empty states and deleted resources have stable error or 404 states. Do not show a stale page under a newly changed URL. Keep URL, content, history and focus in sync.
7. **No silent history traps.** Don't overwrite history for every keystroke, don't push entries for purely cosmetic toggles and don't break the browser Back button with app-specific handlers.

## Implementation example

Native HTML or React without an SPA router:

```tsx
<a href="/projects/ferma">Ферма</a>
<a href="/films?list=mine">Мои фильмы</a>
<button type="button" onClick={() => setFiltersOpen(true)}>Настроить фильтры</button>
```

Framework routing is welcome **only if it preserves link semantics**:

```tsx
import { Link } from "react-router";
<Link to="/projects/ferma">Ферма</Link>
```

For application routing choose a framework router/server strategy that handles direct requests. Don't implement `pushState` without handling `popstate`, initial state, titles, focus, scroll and server fallback. `NavLinks` from `@vanya/ui` renders native anchors for items with `href`; `onSelect` is reserved for local button-style state where no URL is supplied. `ActionLink` renders a native anchor; `ActionButton` is an action, not navigation.

## New-tab indicator

The diagonal arrow ↗ (ArrowUpRight) announces that ordinary activation opens a new browser tab/window. Every anchor bearing it must have `target="_blank"` and `rel="noopener noreferrer"` (preserve any other relation tokens). This applies to internal documentation and external destinations alike. Use ordinary links or a horizontal arrow for same-tab navigation; do not add a diagonal arrow as decoration. Use `ActionLink target="_blank"` for textual commands that navigate: it renders its own arrow from target (omit manually supplied arrows). LinkChip also derives its arrow from its actual target. Independent reference documents open in a new tab with the visible marker. Use ActionLink variant="prose" for reading links; it inherits surrounding typography, underlines the link, and owns the same marker. Plain-text final word stays with the marker on wrapping. LinkChip delegates to ActionLink. Separate adjacent standalone links by a wrapping layout gap; do not implement local marker, color or hover rules. Neutral utility links use text, ordinary reading links use prose, accent is reserved for a deliberate primary destination; active primary navigation uses aria-current. Hover visibly changes ink or decoration; focus remains separately visible. Recognizable icon-only utility links are exempt. Keep the accessible link name meaningful, and announce a new tab when needed. No JavaScript window-opening handler is needed.

## Current section in a longread

When the primary navigation links to real in-page sections (`/#identity`, `/#catalog`, `/#workspace`), mark the **currently visible** section with `aria-current="location"`. This is neither an accent hover nor the section last clicked. In the showcase, `useActiveShowcaseSection` observes the viewport relative to the real sticky-header bottom; `hashchange`/`popstate` support deep links and browser history, and scroll does not rewrite history. Avoid additional sticky navigation. Verify reload, Back/Forward and nested fragment targets in a browser.

## Links to authors and repository source

A design-system site is a **product**, not its author's personal homepage. Keep the product logo and internal sections in primary navigation. In a compact *utility* group, label a personal-site link by **the person** (`Ваня Афанасов ↗`, collapsing to `Автор ↗` when necessary), not by a bare URL whose role is unclear. Use a real `ActionLink variant="text"` anchor with `rel="author"` and a descriptive accessible label; the personal site is not a breadcrumb ancestor or a main app section. Do **not** hide the only visible author route on small screens.

A GitHub repository/source link may be icon-only because the GitHub silhouette is a recognisable destination symbol. Use the exported `GitHubIcon`, but still give the **link** a descriptive accessible name (e.g. “GitHub — исходники Vanya UI, новая вкладка”), safe `rel` and visible focus. Keep outline and filled brand icons distinct; do not reuse a rendered SVG copied from another app's inline markup. `ActionLink` owns textual link styling and focus; a product may supply layout classes, not recreate the link component. For other third-party sites with ambiguous icons, use a text label.

This is a role- and destination-based recommendation, **not** a mandate to add author/social links to every app. [Source-backed audit](../research/author-source-utility-link-2026-11-22.md).

## Definition of done / agent acceptance checklist

- [ ] Every destination has a documented canonical path, including settings, details, admin areas and meaningful subviews.
- [ ] Copy link → new tab / private window loads the same destination (or the correct login/permission state).
- [ ] Refresh at a nested route works; unknown URL gives not found rather than silently rendering home.
- [ ] Browser Back and Forward across 3+ destinations restore content and route; query-state and fragments work.
- [ ] Click, keyboard Enter, middle click, context-menu Open in new tab, Cmd/Ctrl-click preserve browser behavior.
- [ ] Links render as `<a href>`; local actions render as `<button>`; active page is indicated.
- [ ] After SPA navigation, page title, focus, announced heading and scroll are appropriate.
- [ ] No shadow navigation via `setState` without URL, or `preventDefault` without a complete router implementation.
- [ ] URL routing and navigation are tested in an actual browser (not only jsdom unit tests).
- [ ] Cloudflare/static hosting is configured to resolve nested paths; no accidental redirect to `/`.

## Sources and interpretation

- [Atlassian Design — Link](https://atlassian.design/components/button/button-legacy/usage): links navigate; buttons perform actions.
- [Carbon Design System — Link](https://www.carbondesignsystem.com/building-blocks/core/components/link/guidelines): links change location and browser URL.
- [GOV.UK Design System — Tabs](https://design-system.service.gov.uk/components/tabs/): tabs in a document update the fragment, and Back returns to the prior tab; tabs are not a replacement for page navigation.
- [React Router — Progressive Enhancement](https://reactrouter.com/explanation/progressive-enhancement): framework `Link` renders an HTML anchor and can work before JS loads.
- [MDN — Working with the History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API): `pushState`, `replaceState` and `popstate` are necessary for SPA history behavior.

**Vanya UI decision:** no custom router is added to the component library; URL/history compliance is an explicit product pattern, documented, demonstrated by the showcase, and must be checked in consuming applications.

**Distinction:** this public reference is one longread, so sections use `/#...` anchors. Actual separate pages in consuming applications must still use their own routes.
