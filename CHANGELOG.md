# Changelog — @vanya/ui

Следуем SemVer. Наличие версии в package.json не доказывает, что Git-тег или GitHub Release опубликован. [Процесс](docs/versioning.md).

## [Unreleased]

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
