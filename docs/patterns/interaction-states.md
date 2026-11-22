# Interaction states — hover, focus, pressed, selected, disabled

**Статус:** нормативная схема взаимодействия для `@vanya/ui`, не новый theme или набор декоративных эффектов. **Рабочий пример:** [Hover / focus / selected](https://ui.vanya-arc.dev/#interaction-states). Исследование и проверка альтернатив — [Hover Research Loop](../research/hover-research-loop-2026-11-22.md).

## Почему hover — не отдельная «красивая анимация»

Hover означает *наведение доступным указателем* и сообщает, что действие доступно. Focus означает *где сейчас клавиатура*. Pressed означает *непосредственное нажатие*. Selected означает *устойчивый выбор или открытый раздел*, даже когда указатель ушёл. Disabled означает *действие недоступно* и не получает ответных hover/pressed эффектов. Заменять одни состояния другими нельзя.

Состояния проектируются вместе, как у [Carbon](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview), [Atlassian](https://atlassian.design/foundations/color/) и [NN/g](https://www.nngroup.com/articles/button-states-communicate-interaction/), но **визуальные значения ниже — собственное решение Vanya UI**.

| Роль | Обычное состояние | Hover (мышь/трекпад) | Keyboard focus | Pressed | Selected / expanded |
| --- | --- | --- | --- | --- | --- |
| Иконка действия / ссылка | muted glyph, стабильный хитбокс | чуть темнее glyph + слабое заполнение области | явный 2px accent outline | нейтральное заполнение плотнее | отдельное accent-состояние *при открытом меню* |
| Ссылка в навигации | muted текст | текст становится выразительнее, **без изменения размера** | 2px outline | нет смещения | accent + `aria-current` / `aria-pressed`, остаётся видим |
| Текстовая ссылка | понятное название + контекст | изменение цвета + подчёркивание | 2px outline | различимый ответ без layout shift | не применимо к обычной ссылке |
| Пункт меню / списка | читаемая строка | мягкая заливка строки | 2px outline | плотнее заливка | accent и маркер через `aria-checked` |
| Tabs / фильтры | невыбранное на нейтральном фоне | лёгкая заливка | 2px outline | обратная связь нажатия | выбранное фон/акцент сохраняются при hover другого |
| Карточка медиа / сюжетное событие | собственный смысловой образ | допускается *одна* дополнительная глубина или акцент, только если помогает различать действие | должен быть явный фокус | без обязательного движения | данные/статус принадлежат продукту |
| Disabled | менее выразительно, но различимо | **нет** | исключён из tab order для нативных disabled controls | **нет** | не активируется |

### Граница, фон и акцент — подтверждённое решение

**Не существует универсального запрета менять border на hover.** Apple описывает hover/pressed/focus как разные состояния и предлагает выбирать эффект по роли; у [Carbon Button](https://www.carbondesignsystem.com/building-blocks/core/components/button/specifications) и [Atlassian Color](https://atlassian.design/foundations/color/) могут быть разные механики для отдельных типов компонентов. [Atlassian Elevation](https://atlassian.design/foundations/elevation/) показывает **обычную bordered surface со стабильным border и отдельными цветами фона hovered/pressed**.

Для **Vanya UI в dense workspaces**: стандартный `ActionButton variant="outline"` и `FilterSelect` при *mouse hover* меняют **только мягкий фон**, не насыщенность границы. Это локальное дизайн-решение, не требование WCAG или Apple. Граница — структурная: остаётся постоянной; сильная акцентная обводка принадлежит **keyboard focus** и открытому/невалидному состоянию, когда она несёт отдельный смысл. Обратную связь pressed сохраняем. Кнопки иных ролей (особенно без фонового контейнера) могут менять текст/иконку.

**Тот же принцип для меню навигации:** обычный `hover` остаётся нейтральным (`var(--ink)`); `aria-current` или `aria-pressed=true` сохраняет акцент после ухода указателя. Однако это не «никогда не использовать accent при hover»: активное CTA, error/destructive и специальные выразительные interactions могут иметь отдельный смысловой цвет. **Приоритет семантики выше однообразия.** У Apple [Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/) акцентное выделение также зависит от типа списка и активности окна; это подтверждает *контекстность*, а не догму «серый всегда на hover».

### From press to visible result

Hover, focus, press and selected are different; a visible `:active` alone is not enough to acknowledge asynchronous completion. The canonical [action-feedback workflow](action-feedback.md) covers momentary press, caller-controlled pending/success/error and genuine keyboard actions. The [research and critical alternatives](../research/press-feedback-research-loop-2026-11-22.md) explain why automatic success animation and global toasts were rejected.

### Группы утилит в шапке и визуальная иерархия

У иконки нет права становиться визуально важнее соседнего текстового пункта *только потому, что ей присвоили другой токен*. Для дополнительных действий используйте единый приглушённый уровень: `ui-feedback-icon` поддерживает локальную переменную `--ui-feedback-icon-ink`, по умолчанию `var(--ink-soft)`. На витрине группа `showcase-nav` задаёт `color-mix(in oklab,var(--ink-soft) 80%,transparent)` — то же значение, что `text-ink-soft/80` у ссылок. Выбранный/открытый элемент сохраняет акцент, hover — нейтральный контрастный тон.

**Не добавлять аватар автоматически** к ссылке на автора документации. В этой композиции он конкурирует с лого и создаёт ложный намёк на меню личного аккаунта. `AvatarLink` остаётся уместен там, где сама задача состоит в идентификации человека. [Research loop / critique](../research/header-identity-hierarchy-loop-2026-11-22.md).

### Общие интерфейсные роли

Используйте **существующие компоненты**, а не копируйте Tailwind классы в продукты:

- `ActionLink` и `ActionButton` теперь используют `ui-feedback-text` и `data-variant`, сохраняя исходные `text/mono/accent/pill/outline` API. Нейтральные действия меняют цвет, акцентные текстовые ссылки подчёркиваются, pill/outline мягко реагируют фоном.
- `NavLinks` использует `ui-feedback-nav` и семантические `aria-current`/`aria-pressed`. Hover не подменяет выделение активного раздела.
- Для отдельного icon-only действия используйте `ui-feedback-icon`, **но отдельно задайте размер и форму hit target**, семантическую ссылку/кнопку, `aria-label` и destination/action. На витрине `GitHubIcon` — 14px внутри 32px кликабельной окружности; на `pointer:coarse` область можно увеличить до 44px, **не увеличивая сам рисунок**.
- `ThemeToggle` применяет `ui-feedback-icon`, `ui-feedback-row`, `ui-feedback-segment`. Выбранная тема — `role="menuitemradio"`, `aria-checked`; стрелки перемещают фокус, Escape закрывает меню и возвращает фокус.
- `SegmentedControl` использует `ui-feedback-segment` и свою существующую выбранную форму; `FilterSelect` оставляет keyboard-active строку и применяет hover лишь когда устройство умеет наводить.
- `AvatarLink` использует `ui-feedback-avatar`: **без увеличения картинки** и рваной тени. `LinkChip` использует `ui-feedback-source`: вся ссылка реагирует целиком, а не только URL внутри неё.

Семантические переменные в `src/tokens.css`: `--ui-feedback-hover-fill`, `--ui-feedback-pressed-fill`, `--ui-feedback-hover-border`, `--ui-feedback-duration`. Используйте токены, а не отдельные `rgba(0,0,0,0.1)` для каждого экрана. Они рассчитываются от `--ink` и одинаково применимы к светлой и тёмной теме. Вдохновляющий ориентир Material 3 — [state layers](https://m3.material.io/foundations/interaction/states/state-layers); **не копируем их 8% как безусловное правило**, потому что наши поверхности и контраст другие.

### Доступность и ограничения

1. Для pointer hover используйте `@media (hover:hover) and (pointer:fine)` — не делайте полезную информацию доступной только при наведении. На touch hover не требуется и не должен «залипать».
2. Для всех интерактивных элементов оставляйте отдельный `:focus-visible` (у нас 2px accent outline); никогда не используйте `outline-none` без полноценной замены. [WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) требует видимый фокус; [2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) описывает более строгую видимость.
3. Минимальная область касания по [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 24×24 CSS px с оговорёнными исключениями; для мобильных утилит Vanya UI стремится к 44px. Размер SVG **не равен** размеру области нажатия.
4. Если hover или focus показывают *дополнительный контент*, соблюдайте dismissible/hoverable/persistent [WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html); не открывайте важные функции только по наведению.
5. Убирайте необязательные масштабирование, тяжёлый shadow и перемещение у системных controls. Сохраняйте `prefers-reduced-motion` (имеется глобальная защита Vanya UI). Для сюжетных визуализаций допускайте отдельную мотивированную анимацию, а не глобальное правило.
6. Если selected и hovered одновременно, selected **остаётся устойчиво различимым**. Если disabled, не должно быть hover или pressed. Если focus на selected — контур дополняет, но не заменяет selected.

### Неприятные случаи, не скрывать

- `CraftCard isInteractive` пока использует интерактивный hover на `div`; без реального события и keyboard-семантики такой элемент может давать ложную подсказку о кликабельности. Перед массовым рефакторингом требуется аудит потребителей и определение необходимого API.
- `DeskSlotCard` и `Minimap` имеют собственную pointer-модель: часть кликабельных областей реализована через `div`/`region`, а не native button/link. Их не исправляет изменение цвета hover — требуется отдельное исследование keyboard/DOM semantics и проверка потребителей.
- `TimelineEvent` и `MediaCard` используют выразительные hover-сцены. Их сохраняем как **доменные исключения**, до подтверждения UX-провала и визуального сравнения; не ломаем механики единым правилом.
- Не обещайте, что вся галерея визуально проверена, только потому, что unit tests и build успешны.

### Приёмка

На 1440×900, 1024×768, 390×844, в light/dark, при 200% zoom, мыши, касании и keyboard Tab/Enter/Escape проверьте: hover с уходом курсора, focus на выбранном, pressed без layout shift, disabled, выбор темы и сохранение меню, схему иконок 14px/32px, контраст и видимость ссылки, отсутствие перекрытий. **Скриншоты/браузерный прогон = отдельное доказательство**, не подменяемое CI.

