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

## Контекст статьи после прокрутки (21 ноября, второй проход)

Появился общий `StickyContextBar`: компактный заголовок текущего документа, маленький provenance/раздел, статус прогресса и переданные приложением действия.

- Компонент сам **не наблюдает** `window.scrollY`, не навязывает CSS приложению и не создаёт собственный scroll owner. Приложение определяет `visible` по **реальному** ближайшему scroll owner.
- Пока `visible=false`, интерактивные элементы отсутствуют в DOM; скрытых кнопок в tab order нет.
- `position:sticky` находится на нулевой по высоте обёртке, которая не сдвигает длинный текст при появлении компактной строки.
- Типографика, цвета и состояния из Vanya UI. Продукт передаёт `ActionButton`, свою метку и название; в публичном коде нет данных Factory.
- В полноразмерном заголовке можно оставить контекст и объяснение, а при скролле показывать **только** название текущего объекта, положение в выборке и первичное действие. Глобальная верхняя строка не должна разворачиваться/сжиматься в ответ на прокрутку статьи.
- Для вложенных или мобильных поверхностей приложение обязано следить за правильным scroller и перепривязывать слушатель при смене breakpoint, иначе состояние будет неверным. На ширине 320px длинный title обрезается, а не вытесняет CTA.

Демо: `src/showcase/ComponentCatalog.tsx#sticky-context`; тесты: `tests/workspace-primitives.test.tsx`.

## Context in the global app shell — preferred over double sticky bars

For complex readers that already have a persistent product header, use `WorkspaceContextHeader` as a slot inside that existing topbar. The component provides named, clickable ancestor crumbs, full document title (with overflow-safe tooltip and accessible label), optional position, and one context action.

Unlike `StickyContextBar`, the contextual shell slot never inserts a second fixed surface, has no scroll listener, and does not hide the selected item title until the user scrolls. On narrow viewports prefer the closest useful ancestor and keep the main action; hide status, not the current item's accessible title. The reading page can still contain its semantic `h1` in normal flow, but it must not repeat a page-wide onboarding hero before every item.

Breadcrumbs are navigation, not a copy of app steps: only render ancestors with real destinations; do not duplicate all stage tabs. Use `onSelect` callbacks for actionable crumbs; passive labels are not fake links.

References: [Atlassian Page Header](https://atlassian.design/components/page-header/usage), [Carbon Breadcrumbs](https://www.carbondesignsystem.com/building-blocks/core/components/breadcrumb/guidelines), [Material top app bars](https://developer.android.com/develop/ui/compose/components/app-bars), and [NN/g breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/). `StickyContextBar` remains available for standalone documents **without** persistent shell context; do not stack both by default.

### Preventing duplicate titles

The `WorkspaceContextHeader.showTitle` flag is driven by the **visibility of the document's own h1 in its scroll owner**. While that heading is in view the shell shows only the real ancestor crumbs, count and actions. Once the in-document heading is no longer visible, the shell shows the title. The same title is never visible twice. Observe the document heading using `IntersectionObserver` rooted in the correct reader/viewport, not `window.scrollY`; reset when the selected document changes. A fixed global shell is not an excuse to repeat section-sized onboarding text above every article.

### Original-page access in contextual navigation

Use `WorkspaceContextHeader.breadcrumbAccessory` for a **contextual source action next to the breadcrumb trail**. It is intentionally not an `ol > li` ancestor: opening an original document is not a parent route. A regular button with `aria-haspopup="dialog"` opens the caller's `InspectDrawer`; the ancestor breadcrumbs remain real navigation. Do not give the action a fake URL or automatically open a new tab.

`InspectDrawer size="wide"` is available for external full-page previews, retaining the existing Escape, backdrop, focus return and accessible title/body region. Third-party pages may block iframe embedding using `X-Frame-Options` or `Content-Security-Policy frame-ancestors`. Keep a visible original URL + explicit new-tab fallback, and do not claim the page has loaded based solely on iframe load events. The library does not proxy copyrighted sites or remove their embedding policy.

This enhancement is generic; no Factory URLs or private project data are included.


See also [Composition: reader inspectors](../composition/reading-inspectors.md) for consolidated layer, spacing, scroll and disclosure rules.
