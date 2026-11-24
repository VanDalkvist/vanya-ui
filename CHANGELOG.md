# Changelog — @vanya/ui

Следуем SemVer. Наличие версии в package.json не доказывает, что Git-тег или GitHub Release опубликован. [Процесс](docs/versioning.md).

## [Unreleased]

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
