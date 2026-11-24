# Типографика Vanya Arc / UI

**Нормативный паттерн** для приложений и публичной дизайн-системы. [Живой раздел](https://ui.vanya-arc.dev/#typography).

## Гарнитуры

- **Manrope:** UI, заголовки и длинные тексты.
- **JetBrains Mono:** код, сочетания клавиш, идентификаторы и короткие технические метаданные.
- **Fraunces:** необязательная редакционная гарнитура для латиницы; официальная версия Google Fonts не покрывает кириллицу. Для русских статей и историй пока используй Manrope. Выбор кириллической антиквы открыт.
- Отдельный плотный трекинг допустим в **логотипе**, но не переносится на абзацы.
- Не используем Apple SF Pro как собственный шрифт или шрифт логотипа.

## Общая шкала

Интерфейсные роли живут в `src/tokens.css`, а брендовые гарнитуры и палитра определяются отдельно в [`@vanya/brand`](https://github.com/VanDalkvist/vanya-arc-brand) и импортируются через `@vanya/brand/tokens.css`. Приложения подключают пакет, а не дублируют шкалу.

| Роль | Класс | Размер и применение |
| --- | --- | --- |
| Hero | `ui-type-display` | `--type-display-size`, адаптивно от 2rem до 3.25rem |
| Раздел | `ui-type-heading` | `--type-heading-size`, 1.625–2rem |
| Подзаголовок | `ui-type-subheading` | `--type-subheading-size`, 1.125rem |
| Текст для чтения | `ui-type-body` | `--type-body-size:1rem`, leading 1.65 |
| Плотный рабочий текст | `ui-type-compact` | `--type-compact-size:.875rem`, leading 1.55 |
| Короткая подпись | `ui-type-caption` | `--type-caption-size:.8125rem`, leading 1.5 |
| Код | `ui-type-code` | `--type-code-size:.8125rem`, monospace |

Длинная строка ограничена `--type-reading-measure:66ch`. Основной текст не надо уменьшать до 10–12 px ради компактности. Малые размеры допустимы только для коротких специализированных индикаторов при сохранении доступного имени и контраста. Обозначения шорткатов и технические метки остаются моноширинными.

```tsx
<h2 className="ui-type-heading">События</h2>
<p className="ui-type-body">Нажми на точку, чтобы посмотреть подробности.</p>
<small className="ui-type-caption">Пример данных</small>
```

## Трекинг по назначению

| Роль | Интервал |
| --- | --- |
| Обычное действие, основной текст | normal |
| Mono ActionButton / ActionLink | `--type-tracking-action-mono: .03em` |
| Короткие моноширинные метаданные | `ui-type-metadata`, `--type-tracking-metadata: .06em` |
| Display / heading / subheading | существующие −.035 / −.025 / −.015em |

Моноширинные действия сохраняют существующий верхний регистр. Для длинных названий и основных действий выбирай обычный Manrope. Верхний регистр и разрядка у дат и коротких технических меток допустимы по смыслу. Не переносить трекинг логотипа на интерфейс. Проверить реальные RU/EN образцы, загрузку гарнитуры, fallback, ширину и переносы. Значения — собственные решения Vanya UI, визуальная приёмка обязательна.

## Требования

- Сохраняй смысловую структуру h1 → h2 → h3; размер шрифта не заменяет семантику HTML.
- Проверяй перенос на 320 CSS px, масштаб браузера 200%, пользовательское изменение line-height и межбуквенных интервалов по WCAG 1.4.12.
- Основной текст должен быть 1rem, с достаточным межстрочным расстоянием и измеримой шириной. Не растягивай абзацы на весь широкоформатный монитор.
- Не зажимай строки фиксированной высотой. Для длинных русских слов обеспечь перенос; для кода допустим горизонтальный скролл отдельного блока.
- Сохраняй читаемость в обеих темах и при подмене шрифта системным fallback.
- Не делай полный лонгрид мелким caption-стилем; caption предназначен для короткой вспомогательной информации.

## Основание

Источники: [Carbon typography](https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview), [Apple HIG typography](https://developer.apple.com/design/human-interface-guidelines/typography), [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/), [USWDS typography](https://designsystem.digital.gov/components/typography/), [WCAG Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Text Spacing](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html). Конкретные размеры Vanya UI — собственное дизайн-решение по этим принципам, а не обязательные числа Apple/Carbon.

[Исходный аудит](../research/typography-audit-2026-11-22.md).
