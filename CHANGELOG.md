# Changelog — @vanya/ui

Следуем SemVer. Наличие версии в package.json не доказывает, что Git-тег или GitHub Release опубликован. [Процесс](docs/versioning.md).

## [Unreleased]

## [1.0.0] - 2026-11-25

First stable major version of Vanya Arc / UI, including the source component library, design canon, individual product identity extension, and portable agent harness. Includes the 0.5.0 and 0.6.0 capabilities below.

### Fixed
- Validate CLI options before side effects and expose canonical guides in help.
- Ignore regular-file data symlinks outside authored UI sources while rejecting authored source and directory links.
- Normalize shared component tokens and enforce design lint on the component library without expanding the legacy baseline.

### Compatibility and release scope
- React 18/19 and Tailwind 4 source-package contract; existing `@vanya/brand` immutable dependency remains unchanged. Consumer applications retain their pins until explicitly upgraded.
- Owner approved promotion after successful 0.6.0 exact-head CI; independent follow-up reviews, visual regression and live agent eval deferred. Verify 1.0.0 build and tag separately.

## [0.6.0] - 2026-11-25

### Added
- CLI entrypoints `vanya-arc-ui` and `vui` alias the same portable pipeline; standard help, per-command help and version output. Existing lint and direct script entrypoints retained.
- Contributor operation in the portable UI pipeline: discover and generalize reusable UI knowledge, run existing library test/typecheck/build/design-lint scripts, and record applicable UI review. Portable folders supported; no Git or new publication scanner.

### Changed
- Brand architecture: individual wave-based marks and matching favicons for official services. Parent and UI retain the original V→A. Re-export `productMark`; existing calls retain their default, and temporary wordmarks are explicitly requested with `showMark={false}`. Candidate until verification; existing consumer pins remain unchanged.

## [0.5.0] - 2026-11-25

### Added
- Consumer design-system harness: adopt, canonical package lint, required verification, explicit legacy baseline. Strict project-bound checks require the new harness-capable pin; existing pins are unchanged. Candidate until release verification.

## [0.4.7] - 2026-11-25

### Added
- Mandatory literal token stylesheet hookup for React consumer checks; report matching paths and warn on absent explicit Tailwind source registration. Compiled showcase CSS smoke gate, with negative fixtures.
- Browserless external lint pilot for Impeccable, shadcn/oxlint and Stylelint; source diagnostics only. No skill installation or product dependency changes.

## [0.4.6] - 2026-11-25

### Fixed
- Reserve the hero wave space and reveal the first measured SVG after fonts and header geometry settle. Prevent a visible prerender fallback frame while preserving no-script markup, public SineWave API and responsive behavior. Add delayed-hydration browser regression.

## [0.4.5] - 2026-11-25

### Fixed
- Use the supported md density of ActionButton and ActionLink in the agent section; preserve the scoped 44px copy hit target. Resolve TypeScript deployment failure in 0.4.4.

## [0.4.4] - 2026-11-25

### Added
- Agent-facing longread section and native menu anchor: copyable new-product prompt, canonical skill/CLI/components/tokens/LLM references, verified release reference and honest evaluation limits. Existing first screen and routes remain intact.

### Fixed
- Update the stale bootstrap assertion for project-bound acceptance introduced in 0.4.3.

## [0.4.3] - 2026-11-25

### Changed — agent skill and acceptance
- Compact skill with precise trigger/compatibility, explicit new-product mode and conditional canonical reference routing. Existing commands and detached receipt format preserved.
- Project-bound receipts re-inspect the target and require actual successful verify JSON for executable projects. New/migration have mandatory layout, typography, interaction and execution gates. Bootstrap pointers preserve existing policy. No product UI/API changes or automatic upgrades.

## [0.4.2] - 2026-11-25

### Added — portable task acceptance
- Scope UI work to a feature, screen or explicit migration; plan stable UI criteria with canonical references and review structured evidence. Existing CLI commands remain compatible; review validates declared evidence structure only.
- Inspect reports local guide version, dependency spec, installed version and CSS wiring warnings; explicit package selection supports nested paths. Agent skill, bootstrap and documentation use the scoped acceptance loop.

## [0.4.1] - 2026-11-25

### Fixed — browser QA
- Verify horizontal zero-value plots using the SVG stroke and marker geometry, with a hidden-series negative control; include CraftCard in scoped axe checks.
- Derive FilterSelect's accessible name from its visible label and value; focus its searchable popup only after the portal becomes visible.
- Preserve selected menu highlighting with sufficient dark-theme text contrast, including hover.
- Give SectionToolbar's labelled result counter explicit status semantics; use the system text color for SVG labels in forced-colors mode.
- Pin the browser QA dependency tree; cover native Chromium 200% zoom, forced-colors focus, SVG text contrast and real React tab disable/remove transitions. No dependent application is updated.

## [0.4.0] - 2026-11-25

### Breaking
- CraftCard honors explicit isInteractive=false even with an onClick handler. Omitted/true with a real handler retains card activation. Independent nested controls no longer trigger the parent card action through bubbled clicks.

### Added
- Live passive/actionable/opt-out card examples and pointer/keyboard regression scenarios; migration notes.

## [0.3.29] - 2026-11-25

### Fixed
- Reduce competing decorative dividers in typography, writing and interaction specimens. Use spacing for prose groups, one shared writing group boundary, and internal scan-row separators. Publish a composition and agent rule for single-owner boundaries.

## [0.3.28] - 2026-11-25

### Fixed
- Scope navigation regression to the unique showcase header; preserve independent labels, exact destinations and section heading assertions.

## [0.3.27] - 2026-11-25

### Fixed
- Align navigation regression with the renamed typography section; assert the eight actual header links and stable fragment targets, including the matching typography heading.

## [0.3.26] - 2026-11-25

### Fixed
- Replace brittle specimen-count regression with role-specific and interactive assertions; enforce canonical typography publication and add a painted-font fallback negative control. Clarify simulated action feedback.

## [0.3.25] - 2026-11-25

### Changed
- Align typography guide, brand rights references, notices, agent skill and LLM publication inputs with Spectral and bilingual editorial roles. Record semantic editorial and architecture reviews.

## [0.3.24] - 2026-11-25

### Changed
- Adopt Spectral for optional Russian/English editorial content through pinned @vanya/brand 0.1.1; preserve Manrope and JetBrains Mono. Rename typography section/navigation and add bilingual editorial specimens and actual glyph-rendering QA.

## [0.3.23] - 2026-11-25

### Added — typography showcase and QA
- Live bilingual specimens for normal/mono actions, metadata, headings and body. Browser contract checks computed tracking, actual action/fragment navigation, containment and old-tracking negative control.

## [0.3.22] - 2026-11-25

### Fixed
- Reduce mono action tracking from .16em to .03em through a shared semantic token; retain heading values and define a separate metadata role. Clarify Cyrillic editorial fallback and agent instructions.

## [0.3.21] - 2026-11-25

### Fixed — agent discovery
- Derive the public named export index from the explicit source barrel, distinguish types and runtime exports, add stable geometry and privacy entrypoints, align installation and token references with source distribution, and verify generated export coverage.

## [0.3.20] - 2026-11-25

### Fixed — test integrity
- Review semantic test coverage; assert visible timeline movement, actual filter totals, linked dynamic tab panels, exact plot data, loading/error outcomes, anchor clearance, and meaningful axe negative control.

## [0.3.19] - 2026-11-25

### Fixed — QA integrity
- Validate the direct consumer lock resolution and installed package identity; document transitive browser toolchain pinning and private receipt handling.

## [0.3.18] - 2026-11-25

### Fixed — licensing documentation
- Align mixed-license scope and marked research, record isolated browser QA dependencies and pin brand rights references to the installed source commit.

## [0.3.17] - 2026-11-25

### Changed
- Clarify guide and control copy, add chart units and day labels, simplify theme accessible name. Keep tests aligned with visible copy.

## [0.3.16] - 2026-11-25

### Fixed
- Give showcase navigation and utilities explicit layout areas; measure sticky-header height for fragment clearance and active-section tracking. Remove absolute-positioned mobile utilities.

## [0.3.15] - 2026-11-25

### Fixed
- Request controlled tab selection recovery when an enabled tablist loses its selected option. Preserve owner-controlled panels and avoid duplicate recovery callbacks; filters stay unchanged.

## [0.3.14] - 2026-11-25

### Fixed
- Delegate theme-menu Tab and Shift+Tab traversal to the browser after restoring focus to the trigger; remove the document-wide hand-built tabbable list.

## [0.3.13] - 2026-11-25

### Fixed — publication hygiene
- Minimize internal verification metadata in public documentation and clarify safe evidence reporting.

## [0.3.12] - 2026-11-25

### Fixed — manual QA
- Validate emitted brand token and shared CSS rather than an inline Tailwind theme alias; preserve per-command logs and runtime versions in isolated consumer smoke receipts. Add positive and negative checks for the CSS oracle.

## [0.3.11] - 2026-11-25

### Added — manual QA
- Isolated pinned-SHA consumer smoke matrix for npm/React 18 and Bun/React 19, with type, client/CSS and SSR checks; document manual release and migration. Fixture generation is covered by offline tests; consumer execution pending.

## [0.3.10] - 2026-11-25

### Fixed
- Align package entrypoint metadata with the existing ESM source distribution; resolve types first and document bundler/SSR requirements. Add an offline source-contract regression test. Public exports and component APIs unchanged.

## [0.3.9] - 2026-11-25

### Added — browser QA only
- Pinned axe-core WCAG A/AA smoke for component specimens and open menu/drawer, evidence attachments for incomplete checks, and missing-name negative control.

## [0.3.8] - 2026-11-25

### Fixed
- Give the mobile primary navigation the full width of its row, reveal the current link without moving vertical page scroll, and keep utilities accessible on narrow touch screens.

## [0.3.7] - 2026-11-25

### Fixed
- Active showcase navigation follows the native target's scroll margin and handles the last visible section at the document's scroll limit. Add unit and real-browser regression scenarios at four widths.

## [0.3.6] - 2026-11-25

### Fixed
- Let the two-row showcase selector grow with its actual content, preserving one enclosing surface. Browser regression now detects children outside their group's geometry, including a negative control reproducing the original fixed height.

## [0.3.5] - 2026-11-25

### Added
- Geometry regression scenarios in existing Playwright gate: six states, four widths, both themes, real data changes, disclosure, keyboard and negative-control layout mutation. Example selector allows label reflow and stable font weight.

## [0.3.4] - 2026-11-25

### Changed — documentation and showcase
- Simplify geometry example copy, give empty/error states a next step, keep one canonical reference link, and require named protected elements per transition.

## [0.3.3] - 2026-11-25

### Changed — showcase only
- Demonstrate changing chart values, long names, zero, loading, partial and error results, with a fixed plot slot and responsive list. Expose actual sample values through a disclosure.

## [0.3.2] - 2026-11-25

### Changed — showcase only
- Isolate the stable geometry example and its local state in a dedicated showcase component; preserve markup, IDs and styles.

## [0.3.1] - 2026-11-25

### Fixed
- Align the workspace composition guide with the filter default and explicit linked tabs contract from PR #25.

## [0.3.0] - 2026-11-25

### Added — stable geometry (cycle 1)
- Integrated the workspace geometry proposal from PR #26; public showcase links open the canonical composition reference. Source Markdown retains the section anchor.
- Version checkpoint on main; browser QA, consumer smoke and release tag are pending. Breaking filter/tab semantics from the previously merged PR #25 are included below.

### Changed (breaking semantics; pre-1.0, needs intentional release)
- `SegmentedControl` default semantics changed from pseudo-tabs to true **filters** (`role=group`, buttons with `aria-pressed`). Explicit `semantics="tabs"` now takes linked `TabSegmentItem.tabId/panelId` and implements roving focus, arrows, Home/End and automatic selection. Existing consumers expecting implicit `role=tab` must review their usage before updating the SHA.
- `ThemeToggle` menu now uses one composite keyboard model (menuitemradio `tabIndex=-1`, Tab/Shift+Tab exits, arrows/Home/End, Escape/focus-out).
- Showcase header reports the genuinely active in-page section, preserving native hash and Back/Forward navigation.

### Added — browser verification (#16)
- Manual-only portable Playwright gate (`npm run test:browser`), 390/1024/1440 px × light/dark, real pointer hit-test of the distance control, keyboard tabs/theme, navigation/history, drawers, independent scroll, hover/press and reduced motion; screenshot/trace artifacts require manual sign-off before `UI_VERIFIED`.


### Changed — keyboard help
- Убрана плавающая плашка «Клавиши / ?», перекрывавшая регулировку расстояния; удалены стили, мобильный вариант и лишний отступ футера.
- Справка осталась доступной по `?` и внутри «Принципы → Клавиши» без постоянной кнопки в шапке или над сценой.


### Refined — showcase header hierarchy
- Уравнена нейтральная насыщенность GitHub/Theme и ссылок разделов: `ui-feedback-icon` теперь поддерживает локальный `--ui-feedback-icon-ink` при прежнем значении по умолчанию, шапка выбирает `text-ink-soft/80`.
- По критическому исследованию решено **не добавлять портрет** к авторской ссылке: связь с личным сайтом не является контролом аккаунта, а фотография создала бы конкуренцию логотипу. [Полный цикл](docs/research/header-identity-hierarchy-loop-2026-11-22.md).


### Added — press feedback research loop
- Мгновенный отличимый `:active` для ссылок, обычных кнопок, меню, фильтров, тулбаров, иконок и сюжетных контролов; отдельная обратная связь при нажатии не подменяет выбранность.
- Управляемый `ActionButton.actionState` (`idle/pending/success/error`) и `statusLabel`: pending подавляет повторное нажатие без потери фокуса, а success/error показываются только по сигналу приложения.
- Живой `#action-feedback` с настоящим проверяемым сценарием, локальные тесты, правила агентов и отдельный исследовательский цикл с критикой.

### Fixed
- `CraftCard` не обещает кликабельность без действия и поддерживает Enter/Space, когда обработчик задан; `DeskSlotCard` использует нативную кнопку карточки и независимую кнопку «запарковать».
- `Minimap` доступен как клавиатурный seek-slider; закрытие дроверов/модалов, поиск и timeline имеют собственную pressed-реакцию.


### Refined — interaction semantics
- Нейтральный outline-button и FilterSelect при hover меняют только поверхность, без подсветки структурной границы; keyboard focus и opened states остаются самостоятельными.
- Apple HIG, Atlassian, Carbon и NN/g перепроверены: нет универсального запрета border-hover, но Vanya UI осознанно выбирает спокойную схему. Навигация использует нейтральный hover, accent зарезервирован для выбранности и смысловых приоритетов.


### Added (interaction-state research loop)
- Нормативные `ui-feedback-*` роли в токенах: hover по типу компонента, отдельные focus/pressed/selected/disabled, поддержка pointer и forced colors.
- Живой стенд `#interaction-states`, документ для агентов и исследовательский NMT/critical loop с внешними референсами.

### Changed
- GitHub-глиф уменьшен с 17 до 14 px; область нажатия остаётся 32 px на desktop и увеличивается до 44 px на coarse pointer.
- `ActionLink`, `ActionButton`, `NavLinks`, `ThemeToggle`, `SegmentedControl`, `AvatarLink`, `LinkChip` согласованы по состояниям, без изменения публичных prop API.
- Dropdown темы получил читаемый фокус, `menuitemradio`-семантику, навигацию стрелками и Escape с возвратом фокуса.
- `FilterSelect` сохранил active/selected, но hover не включается на disabled или coarse-pointer.
- `DisclosurePill`, `EventCard` и утилитарные ссылки/помощь витрины приведены к спокойным pointer-aware hover/focus состояниям.


### Added
- `GitHubIcon` — отдельная переиспользуемая контурная SVG-иконка legacy Lucide/Feather, совпадающая с личным сайтом; знак и ссылка остаются разными компонентами.

### Fixed
- Ссылка на основной сайт автора стала семантической (`rel=author`, понятное имя вместо домена), следует общей типографике `ActionLink` и остаётся доступной на мобильных.
- `ActionLink` теперь имеет видимую `focus-visible`-обводку для клавиатурной навигации.
- GitHub-ссылка на витрине использует экспортированный `GitHubIcon` вместо отдельного залитого SVG.


### Changed (showcase only)
- GitHub-репозиторий доступен через лаконичную иконку в правой части шапки сайта.
- Помощь по шорткатам вынесена из шапки в нижний правый угол (компактная кнопка, удобная для правой руки); рабочие `?`, `InspectDrawer` и настройка отключения сохранены.
- Размещение справки описано по референсам Figma, Linear, Notion, GitHub.

### Planned
- Следующие подтверждённые изменения размещаются здесь.

## [0.2.0] - 2026-11-22

### Added
- Совместимый вариант `WorkspaceContextHeader.breadcrumbSize="large"` (16px desktop / 14px compact); `default` остаётся прежним.
- Нормативная композиция: единая геометрия глобальной шапки на всех маршрутах, компактная persistent entity identity и независимый reader scroll.
- Переносимая проверка исходной версии, changelog и воспроизводимый процесс ручного релиза.

### Clarified
- Уже существующих `WorkspaceSplit`, `ScrollRegion`, `WorkspaceContextHeader` достаточно — новый доменно-специфичный компонент `ProjectHeader` не нужен.
- Деплой документации и тег релиза пакета — разные действия. Установки в продуктах закреплены immutable SHA.

### Migration
- Нет обязательной миграции: крупные крошки включаются явно. Потребители меняют SHA и lockfile по отдельному решению.
