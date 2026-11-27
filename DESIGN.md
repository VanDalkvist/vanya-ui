# Vanya Arc / UI

## Visual authority

The light theme of Vanya's Arc Wave / Синусоида is the reference. The transferable character is open space, quiet peripheral controls, clear type hierarchy and details revealed on request — not a mandatory wave graphic or a checklist of decorative prohibitions.

## Source of truth

- `src/tokens.css`: UI tokens and composition, importing `@vanya/brand/tokens.css` as the authoritative palette and font-family source.
- `src/components`: actual reusable primitives, exported through `src/index.ts`.
- `@vanya/brand`: the [separate canonical brand repository](https://github.com/VanDalkvist/vanya-arc-brand) supplies the mark, React logo components, brand colors and assets; UI re-exports them via `src/index.ts`.
- `src/showcase`: working composition and live examples; both `/` and legacy `/showcase.html` mount the same React entrypoint; the canonical longread is `/`.
- `llms.txt`, `public/llms.txt`: generated CSS declarations and public component names (`bun run sync`), not a separate palette or a claim to infer all component signatures.

## Typography — required

Use `src/tokens.css` semantic classes `ui-type-display`, `ui-type-heading`, `ui-type-subheading`, `ui-type-body`, `ui-type-compact`, `ui-type-caption`, `ui-type-code`, `ui-type-metadata`, `ui-type-editorial-heading`, `ui-type-editorial-body`. Manrope for UI text, JetBrains Mono for code/shortcuts, Spectral optionally for Russian and English editorial prose, quotes and headings. Body: 1rem/1.65, measure 66ch; review mobile, zoom and text spacing. Logo tracking is not body typography. [Typography guide](docs/patterns/typography.md), [audit](docs/research/typography-audit-2026-11-22.md), [live examples](https://ui.vanya-arc.dev/#typography).

## First-screen meaning — required

On a visual showcase, describe the product and link to the relevant next step, **not** the mechanics of obvious demo controls. Explain unfamiliar or consequential actions near the control or in its inspector. Avoid multi-sentence hero walkthroughs. Rules and sources: [Ilyakhov/Sarycheva audit](docs/research/ilyakhov-copy-audit-2026-11-22.md).

## Text and editorial — required

Write from the reader's next action and verified component behavior; avoid generic claims and fabricated metrics. Use original Agent Skills `redpolitika`, `promo`, `ux-copy`, `redaktura` by **Ludmila Sarycheva and Nikita Arkhipov** ([original repository](https://github.com/N1arko/redaktura-skills), CC BY 4.0). Local policy: [`.agents/redpolitika.md`](.agents/redpolitika.md); [text guide](docs/patterns/writing-and-editorial.md); [copy audit](docs/research/copy-audit-2026-11-22.md); [live chapter](https://ui.vanya-arc.dev/#writing). Always attribute the authors; the skills are not Vanya UI's work.

## Keyboard accessibility — required; optional accelerators

Standard keyboard accessibility is mandatory. Introduce optional accelerators for observed frequent tasks with a justified benefit; all tasks retain an ordinary interaction path. Preserve browser and OS keyboard behavior; do not intercept common system combos. Show keycaps with shared `Kbd` and `ShortcutKeys` (mono label, semantic colors, flat 2px radius, no fake clickable key). Provide a visible help panel and a way to disable unmodified letter/symbol shortcuts (WCAG 2.1.4). Never trigger in inputs, contenteditable areas, IME composition or an unrelated dialog. Screen reader naming, focus, two-key sequences and test acceptance are specified in [docs/patterns/keyboard-shortcuts.md](docs/patterns/keyboard-shortcuts.md). The showcase uses named native links and standard keyboard access. Keycap notation is illustrated in [/#shortcut-keys](https://ui.vanya-arc.dev/#shortcut-keys). Number visible elements only for a functional sequence, rank, stable citation or actual navigation mapping. Independent chapters and rules use their names and stable anchors.

## Browser navigation — required
Every meaningful page and shareable view has a stable, directly openable URL. Browser Back/Forward, reload, copy/open-in-new-tab and restored route state are baseline behavior, not optional SPA enhancements. Navigation uses real links (native `<a href>` or framework links rendering anchors); local actions use buttons. URL path names the resource/page, query parameters capture shareable filters/tabs, fragments target sections. Transient UI does not need a new address. A router belongs to the consuming app, not this component package.

**Normative pattern, anti-patterns and acceptance checklist:** [docs/patterns/browser-navigation.md](docs/patterns/browser-navigation.md). **Live example:** [ui.vanya-arc.dev/#browser-navigation](https://ui.vanya-arc.dev/#browser-navigation). `NavLinks` with `href` preserves default browser link behavior; `onSelect` is for local button-like state only.

## Mixed-license scopes — required

MIT covers original program code and ordinary guides; the research documents explicitly marked in REUSE.toml are licensed under CC BY 4.0 within their stated scope. Official artwork and renderers are supplied by the external `@vanya/brand` package and follow its [separate rights map](https://github.com/VanDalkvist/vanya-arc-brand/blob/83ade0e4b8bc486c0fbc52df8b04b317d8e40bb9/LICENSING.md). Historical MIT grants are not revoked. See [LICENSING.md](LICENSING.md) and [primary-source validation](docs/legal/licensing-implementation-2026-11-22.md). Do not present trademark use rules as evidence of a registration.

## Licensing and third-party rights — required

The project's root `LICENSE` is MIT (Copyright 2026 Vanya Afanasov). Third-party work retains **its own** license: bundled packages and icons, fonts loaded from Google Fonts, and referenced external Agent Skills. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [license audit](docs/legal/license-audit-2026-11-22.md). Generate complete bundled dependency licenses at `/licenses.txt` via Vite `build.license`. The Lucide source includes ISC and the Feather-derived subset includes MIT; do not lose either notice. Third-party original skill files are linked, not vendored. Do not relicense `@vanya/brand` artwork as UI MIT; neither repository claims that historical MIT permissions have been revoked.

## Sources and citations — mandatory

A hyperlink is not a copyright license. Citations must identify the author/organization, the work, a direct verified source, what it supports, and the applicable rights for any copied material. A few quotes can still be infringing when they are not justified by a lawful quotation exception or permission. CC BY adaptations need original creator, title, URL, CC BY 4.0 link, and change notice. Project-rephrased guidelines are **not** author quotes. [Source policy](docs/patterns/sources-and-attribution.md), [audit](docs/research/sources-and-licenses-audit-2026-11-22.md), [public reference](https://ui.vanya-arc.dev/reference/sources.md).

## Public repository and website — mandatory safety boundary

This repository and `https://ui.vanya-arc.dev` are **public**. All committed files, generated static assets, documentation, previews, source maps, images, test fixtures and website text must be safe to disclose to anyone. Do not copy data from private conversations, connected accounts, private repositories, internal research or production infrastructure into this project by default.

**Before committing or deploying:** review the *complete diff* and built `dist/` for credentials, tokens, cookies, private keys, `.env` files, internal endpoints, non-public URLs, real user records, analytics exports, logs, screenshots and private project details. Only publish intentionally public, independently approved examples; use fabricated examples for code or demos. Never rely on GitHub repository visibility or Cloudflare Access as a substitute for this review. Cloudflare secrets stay in environment bindings, never in Vite frontend code or `VITE_*` variables. If in doubt, exclude the data, do not sanitize-and-guess.

The library's contracts are independent of consuming-service identities and data. Explicitly approved public technical references and historical attribution may remain. Reusable extracted components and generic examples remain valid. Follow the [contributor workflow](docs/patterns/contributing.md). This requirement applies to humans and agents, including automated updates and deployment workflows; see [docs/patterns/publication-safety.md](docs/patterns/publication-safety.md).

## Identity — required

- **Parent brand:** `Vanya Arc`. Keep the owner's precise asymmetric double-crest V → A sign: dark small left crest seamlessly transitions to warm large right crest.
- **Design-system product:** `Vanya Arc / UI`. Only `UI` is accented; the slash is subordinate and the parent wordmark stays ink-colored.
- **Product family:** the wave/sinusoid is the generative identity principle. Every other official service has an individually approved wave-derived symbol expressing its purpose and matching favicon. Shared stroke character, palette, Manrope and `Vanya Arc / Product` naming bind the family.
- Use `VanyaArcMark` for the parent and UI. For other services use `VanyaArcLockup productMark={ProductMark}` with their own approved symbol; use explicit `showMark={false}` for a temporary text-only lockup. Preserve the existing default for compatibility; new identities select their mark explicitly. Preserve existing approved artwork. Follow the [brand product identity procedure](https://github.com/VanDalkvist/vanya-arc-brand/blob/83ade0e4b8bc486c0fbc52df8b04b317d8e40bb9/docs/product-identity.md).
- Manrope-based wordmark lettering may have tailored tracking/weight; do not change functional UI typography or include proprietary font files.
- Follow [the brand identity guide](docs/identity/brand.md). Published section: [/#identity](https://ui.vanya-arc.dev/#identity).

## Editorial voice and first screen

Prefer direct explanations of what the person can **do**, not abstract product praise. Following the information-style approach of Ilyakhov and Sarycheva: lead with the task, use concrete verbs, remove duplication and unsupported promises, and keep details discoverable on demand. The hero is one interactive SineWave (clickable points, inspector, RangeSlider, theme) plus a quiet link to the catalog. Do not recreate a duplicate chapter navigation after the hero or fill its whitespace with feature cards. See [the public research](docs/research/hero-shortcuts-and-copy-2026-11-21.md).

## One longread and agent-readable HTML

The public UI reference is one document (`/`) with an accessible table of contents and stable fragment URLs: `/#composition`, `/#identity`, `/#principles`, `/#browser-navigation`, `/#catalog`, `/#workspace`, `/#setup`. The former /guidelines/navigation/ is an explicit redirect. The app-level rule for separate page URLs remains mandatory; sections of one document naturally share a base URL.

Public HTML is pre-rendered at build time and hydrated by React. The curated `llms.txt` links to public Markdown source documents, while `llms-full.txt` and registry are generated from actual component files. Never generate or publish private connected-source content.

## Workspace composition

**Mandatory for UI changes in all owned repositories:** the [portable agent skill](skills/vanya-ui/SKILL.md) and [local feature pipeline](docs/patterns/ui-feature-pipeline.md). Start with `node scripts/ui-pipeline.mjs inspect --project <local-project>`; scope the requested task with `plan` (new, feature, screen or explicit migration), follow `check`, `verify`, real browser acceptance and `review` of the [task receipt](docs/patterns/ui-feature-pipeline.md#task-acceptance-receipt) on the current machine. No Git/GitHub/CI dependency. Existing Actions are optional manual-only wrappers, never push/PR/schedule. A build alone cannot certify layout or scrolling.

**List–detail / master–detail:** [нормативная схема композиции](docs/patterns/list-detail-composition.md) и [исследование источников](docs/research/list-detail-composition-2026-11-22.md). Не делите навигационный список и длинную инструкцию поровну по ширине; короткие метки не должны сжимать длинный вопрос в несколько строк. Выбор, контекст, прокрутка, типографика и адаптация составляют один паттерн, а не набор произвольных отступов.

The merged workspace primitives are `WorkspaceSplit`, `ScrollRegion`, `SectionToolbar`, `WorkspaceActionBar`, `WorkspaceEmptyState`, `StickyContextBar`, and `WorkspaceContextHeader`. Use one compact global header, not a second sticky header for each reader. Scope scrollbar styles to owned regions. Use real hrefs for navigable breadcrumbs. All routes share the same global header geometry. A compact persistent project identity *above* a module reader is allowed only when its shared context is useful across multiple modules; it must be the reader's flex sibling, not another sticky toolbar. Use `WorkspaceContextHeader breadcrumbSize="large"` for a larger breadcrumb scale without app CSS overrides. [Normative details](docs/patterns/list-detail-composition.md#продолжительная-идентичность-fixed-context--masterdetail). Research: [workspace scroll composition](docs/research/workspace-scroll-composition-2026-11-21.md).

## Typography and hierarchy

Manrope is the normal interface and display face, including EventCard, TimelinePreviewCard and InspectDrawer headings. Use size, weight, measure and spacing to separate content from controls. Spectral remains available for intentionally editorial content, such as ReceiptDigestModal narrative prose. JetBrains Mono is for code, measurements and short metadata, not every heading.

## Composition recipes

- Open field: content first, navigation near the edge, no permanent secondary panel. The approved intro is retained; the wave gets its own area below it, so neither lines nor preview controls intersect the heading.
- Preview: short title and context, with a real button when interactive.
- Detail: a right-hand sheet retaining the page as a subdued backdrop. A directional shadow communicates separation; the edge may also have a hairline.
- Reference: one named row per active component, with its states and variants together; never a second set of HTML lookalikes. OfferCard is temporarily omitted at the operator’s request; its public export is retained for compatibility.
- Harness identity: CategoryBadge and both radar examples use the shared Sparkles / HeartHandshake / Briefcase / Cpu icons and light/dark harness palette. The package owns the reusable definition and supports caller-provided category data where documented.
- Dense working views can use rows and compact spacing; spaciousness does not require hiding primary actions or making text faint.

`--spacing-scene` controls outer clearance; `--spacing-focus` separates focus areas. Use existing warm paper, ink and accent colors rather than introducing a new skin. Borders remain stable on hover; use surface change and subtle elevation where helpful.

## Inline size grid

`ComponentSize` is `sm | md`. CategoryBadge, interactive Tag, MeshStatusBadge, ActionButton, Kbd, LinkChip, AvatarLink and SegmentedControl share the `.ui-size` foundation in `src/tokens.css`. Its `--size-{sm,md}-*` tokens control outer height, font, line height, inline padding, gap and icon size; avatars use the outer height as their width. Segmented controls fit their buttons inside the same outer height rather than adding a second size scale. Text-only actions keep their unboxed horizontal spacing.

Canonical heights are 24px and 32px. SegmentedControl still accepts `xs` as a legacy alias for canonical `sm`; callers wanting its larger appearance should use `md`. Size names, not old incidental padding values, are the stable convention. Explicit consumer classes/styles may override the foundation.

## Wave and event composition

SineWave uses wave-only math, dotted branches and optical styling. Numeric fixtures verify the independent geometry; no personal event records or camera/router engine are imported. Events use normalized horizontal positions, source weight 1–4, optional previews and callbacks. The optional `fit` renderer maps the wave and echoes into the canvas while keeping event radii pixel-sized.

EventPoint is passive unless it receives an action; its sm/md hit areas use the common grid while weight controls the visible source-derived radius. TimelineEvent composes the same point and real TimelinePreviewCard into one native button, sharing accent hover/focus, source shadow and a hover bridge. The wave uses one HTML overlay for predictable stacking: previews are above all points, active previews above their peers. Modern inline SVG/foreignObject support is required for interactive wave events.

EnergyRadar uses the actual SegmentedControl for period selection, with the same compact sizing and disabled semantics rather than a parallel button implementation.

## Interaction

Controls must work in the demonstrated composition. Detail sheets and centered modal dialogs share the native modal lifecycle for focus containment, Escape dismissal and focus return; each owns its visual layout and content. The page theme controls share persistent theme selection, synchronized between the sticky header and their own catalogue row; other demo state is local. Reduced-motion preferences disable nonessential movement. Small visual controls still need adequate hit areas and visible keyboard focus.

## Modes

The opening scene is Experience: the composition is the example. The component reference is Read. Tools consuming the package are Operate: keep task interactions quick, with no decorative page-load sequence. A reference site's longer spatial transitions are not a default for all tools.

## Verification limits

A passing build, detector or unit test does not establish aesthetic acceptance. Inspect the assembled light/dark and narrow-screen views. User approval of the visual result remains separate from technical checks.

## Media catalog primitives

For posters, covers and other image-led catalogues, use the newly exported `MediaCard` (`layout="poster"` or `layout="row"`) and controlled `SearchField`. `MediaCard` owns semantic anchors, artwork geometry, readable Manrope hierarchy and footer slots; an app supplies its own images, domain ratings, state and actions. Filter row composition uses existing `SegmentedControl semantics="filters"`, `SelectField`, `SectionToolbar variant="section"` and `ScrollRegion orientation="horizontal"` for short responsive shelves. Keep providers and watchlist logic out of the component package. See [composition guide](docs/composition/working-surfaces.md#8-media-catalogues-and-searchable-collections).

## Loading states and skeletons — required

Known page content (header, page title, navigation) stays real while unknown data is shown with shared `Skeleton`, `SkeletonText`, or `MediaCardSkeleton`. Use `LoadingRegion` for one polite accessible status per loading area, never one per placeholder. Placeholder blocks are non-interactive and visually match the eventual geometry; no fake progress or arbitrary shimmer. On error, replace them with a meaningful recovery action; on success, remove skeleton and `aria-busy`. CSS uses shared Vanya tokens and a low-key pulse that is static for `prefers-reduced-motion` and distinguishable in forced colors. Copy: no full-screen «Открываем…»; brief status «Загружаем фильмы» is for screen readers and visual error «Не удалось загрузить фильмы» offers «Повторить». See [normative loading guide](docs/patterns/loading-states.md), [research with sources](docs/research/loading-states-2026-11-22.md) and [live examples](https://ui.vanya-arc.dev/#loading-states).

## Compact, sticky filter docks

For long data catalogues, keep one compact filter row below the app header on desktop, not a tall multirow form. Use Vanya UI `FilterSelect` (custom portal dropdown with optional searchable listbox), `SearchField density="toolbar"` and `SegmentedControl density="toolbar"` (40px aligned controls, visible inline labels and semantic tokens). Use native `SelectField` only in normal forms, not as a styled catalogue dropdown: macOS and other OSes paint `<select>` menus outside the app theme. Move overflowing or rare facets to a dismissible disclosure; do not silently drop filters. The app decides header offset, breakpoints and filter semantics; the package owns control presentation and accessibility. On mobile prioritize a compact search + filters action. See [composition rule](docs/composition/working-surfaces.md#10-single-row-sticky-catalogue-filters) and [interactive specimen](https://ui.vanya-arc.dev/#compact-filter-toolbar).


## Primary design references

Linear and Apple HIG are primary references for visual hierarchy, composition, interaction, and accessibility. shadcn/ui is the primary reference for component anatomy, engineering, registry/CLI distribution and documentation. See [reference canon](docs/research/design-reference-canon-2026-11-27.md) for direct source links and application rules. Vanya UI retains its own design tokens and brand; assess the interaction role before selecting a treatment.

## Quiet — visual language of controls

Quiet is the single Vanya UI visual canon. Search, inputs, select triggers, segments and ordinary commands use transparent resting surfaces. Typography, spacing, alignment and functional dividers define composition. Hover and press use the shared feedback tokens; focus, selection, errors and expanded state remain explicit.

Prefer direct manipulation of properties and contextual actions. Neutral commands use text, Accent uses semantic accent text, and Prominent (`ActionButton variant="prominent"`) uses a high-contrast ink/ground surface for rare explicit commitments. ActionButton has exactly three visual variants: text, accent and prominent. ActionLink has text, prose and accent. Mono, pill and outline action variants are removed. Interface commands use Manrope; monospace remains for technical metadata and code. Buttons retain native semantics and real hit targets. Use a visible label and stable bottom line for editable text and native selects in forms; selected tabs and toggles use accent and a soft state layer, without text underline. A prominent primary command is appropriate when the next step needs explicit visual prominence. Persistent selected surfaces are distinct from hover and momentary press. For visible toggle labels pass localized `pressedLabels={{on,off}}` to ActionButton with caller-owned `aria-pressed`. Use `FilterSelect purpose="property"` in inspectors to retain neutral values; applied facets retain accent. Form owners can opt into `TextField reserveNote` for one stable validation line and disable no-op save/cancel in pristine state. Passive tags use category-marked metadata; keep functional boundaries for popovers, dialogs and accessibility.

`VersionLabel version={version}` displays caller-owned SemVer in the header utility group; it is passive metadata, not a status or verified deployment receipt. The documentation showcase reads the package version at build time.

[Interaction states](docs/patterns/interaction-states.md) · [Composition](docs/composition/working-surfaces.md) · [Research](docs/research/quiet-actions-2026-11-26.md).

## Interaction feedback contract

For new/modified UI **do not independently invent hovers** for each button, link and icon. Read [canonical state roles](docs/patterns/interaction-states.md): distinguish hover, keyboard focus, pressed, selected/expanded and disabled. Use existing semantic variables and `ui-feedback-*` classes in exports, pointer hover only when supported, reduced motion, visible keyboard focus and accessible labels. The live `#interaction-states` catalogue is a real component testbed. Rich narrative interactions need their own explicit justification, not uniform lift/shadow. [Research and criticism](docs/research/hover-research-loop-2026-11-22.md).


## Press and result feedback — mandatory

Any new or changed local action must have immediate **pressed** feedback, then expose true pending/result state when appropriate. Do not confuse `hover`, `:active`, keyboard focus, persistent `aria-pressed` or successful completion. [Canonical press-result contract](docs/patterns/action-feedback.md), [research/criticism](docs/research/press-feedback-research-loop-2026-11-22.md), [interactive demo](https://ui.vanya-arc.dev/#action-feedback). Use native buttons where possible; no click-only wrappers, no arbitrary timers, no success before a confirmed result.


**Dividers:** use spacing and headings for content grouping; assign each visible boundary one owner. Repeated scan rows may use internal separators; keep functional surface/control/focus borders. See [divider ownership](docs/composition/working-surfaces.md#divider-ownership-and-visual-grouping).

### Textual destinations and edit feedback

Use ActionLink for textual destinations: prose for neutral underlined reading links, text for quiet utilities, accent for a deliberate primary destination. LinkChip composes ActionLink. New-tab arrows are derived from target, close to their own label, with larger spacing between adjacent links. Every link has distinct hover and keyboard focus. Keep resting form boundaries restrained and strengthen them on interaction; align simple form controls, action group and result on one leading axis. See [browser navigation](docs/patterns/browser-navigation.md) and [interaction states](docs/patterns/interaction-states.md).
