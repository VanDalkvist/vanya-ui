# Workspace UI: что извлечено из «Фермы» и Factory

**Ветка:** feature/workspace-scroll-and-section-primitives. Новые экспорты не меняют API существующих компонентов.
**Статус:** реализация + unit-тесты; визуальная проверка всех брейкпоинтов ещё требуется.

## Новые примитивы

| Компонент | Откуда | Назначение |
| --- | --- | --- |
| ScrollRegion | Factory v3 reader/inbox | Один владелец скролла на каждую длинную область; имя region, Tab, scrollbar gutter и overscroll policy |
| SectionToolbar | Ferma / DeskShelvesZone | Заголовок, «N из M», инструменты и поиск в одной строке |
| WorkspaceActionBar | Ferma bottom metrics + V1 editor footer | Статус редактирования слева, действия справа, режимы flex-footer / sticky |
| WorkspaceEmptyState | Ferma / DeskWorkZone | Короткое объяснение пустого состояния + необязательное действие |

Всё использует --ground, --surface, --ink, --accent и уже существующие типографические токены.
Нет новой палитры, анимационного фреймворка или зависимости от Фермы.

## Правила использования

- **ScrollRegion** требует ограниченную высоту родителя и min-height:0. Не вкладывать два вертикальных ScrollRegion друг в друга: это порождает scroll traps.
- **SectionToolbar** не нужно делать sticky автоматически: у длинного списка закрепляют **фильтры и поиск**, не крупный заголовок и декоративные счётчики.
- **WorkspaceActionBar placement=footer** живёт вне ScrollRegion (как в текстовом редакторе). В небольшом viewport его внутрь прокручиваемого контента не перекрывают.
- **WorkspaceActionBar placement=sticky** используется только как последнее содержимое одного скролла. При max-height:600px и max-width:560px отключается sticky.
- **WorkspaceEmptyState** не должен генерировать fake-content или запускать async fetch при маунте.

## Чего ещё не хватает по результатам аудита

**P1, следующие небольшие API:**
1. Фокусируемая горизонтальная очередь с навигацией, состояниями сохранения selection, scrollIntoView *без* перелистывания страницы.
2. Командная палитра с корректным keyboard-only и configurable bindings.
3. Состояние данных, проверяемое на компонентах: loading/refreshing/stale/error и «данные не полные» (как в Ferma).
4. Reader с выделением цитат и offset mapping (отдельная логика приложения; возможно headless хук).
5. Инспектор (InspectDrawer) с собственным scroll owner и неприкрываемыми фокусами; сейчас есть body overflow lock, но полноценного visual regression покрытия нет.

**P2:**
- В DeskSlotCard внутри кликабельного div находится вложенная кнопка заголовка: двойная семантика и отсутствие общего клавиатурного активационного пути. Перед изменением API нужен отдельный тест карточки.
- Глобальный селектор scrollbar для всех \`*\` в tokens.css вмешивается в другие приложения: в следующей версии область стилизации скроллов стоит сузить до \`.ui-scroll-region\` и \`.inspect-sheet\`, соблюдая обратную совместимость.
- Библиотеке не хватает regression-снимков визуального контракта при 390/768/1440, 200% zoom, light/dark.
- У \`ActionButton\` размер визуального контрола 24/32 px; нужно отдельно проверить WCAG 2.2 2.5.8 (минимум 24x24 или достаточные промежутки), особенно icon-only controls.

## Исследовательская опора

- NN/g Sticky Headers: https://www.nngroup.com/articles/sticky-headers/
- MDN position sticky: https://developer.mozilla.org/en-US/docs/Web/CSS/position
- MDN overscroll behavior: https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
- Chrome modern layout: https://developer.chrome.com/docs/modern-web-guidance/guides/css/css-layout
- W3C WCAG 2.2 focus not obscured: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
- W3C C43 scroll padding: https://www.w3.org/WAI/WCAG22/Techniques/css/C43

См. \`src/showcase/ComponentCatalog.tsx\` для работающего примера двух областей прокрутки и редакторского футера.
