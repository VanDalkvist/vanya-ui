# Changelog — @vanya/ui

Следуем SemVer. Наличие версии в package.json не доказывает, что Git-тег или GitHub Release опубликован. [Процесс](docs/versioning.md).

## [Unreleased]

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
