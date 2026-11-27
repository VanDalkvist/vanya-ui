# Типографика Vanya Arc / UI

**Нормативный паттерн** для приложений и публичной дизайн-системы. [Живой раздел](https://ui.vanya-arc.dev/#typography).

## Гарнитуры

- **Manrope:** рабочий интерфейс, заголовки и пояснения.
- **JetBrains Mono:** код, сочетания клавиш, идентификаторы и короткие технические метаданные.
- **Spectral:** опциональная антиква для статей, историй, цитат и режима чтения на русском и английском. Production Type; кириллица CSTM Fonts (Илья Рудерман и Юрий Остроменцкий). [Образцы](https://type.today/ru/spectral), [OFL 1.1](https://github.com/productiontype/Spectral).
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
| Редакционный заголовок | `ui-type-editorial-heading` | Spectral 600, общая шкала заголовка |
| Редакционный текст | `ui-type-editorial-body` | Spectral 400, 1rem/1.65, до 66ch; курсив 400 |
| Метаданные | `ui-type-metadata` | JetBrains Mono 500, интервал .06em |
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
| Короткие моноширинные метаданные | `ui-type-metadata`, `--type-tracking-metadata: .06em` |
| Display / heading / subheading | существующие −.035 / −.025 / −.015em |

Названия действий и ссылок используют Manrope. Моноширинный шрифт применяется к коду и техническим метаданным. Верхний регистр и разрядка у дат и коротких технических меток допустимы по смыслу. Не переносить трекинг логотипа на интерфейс. Проверить реальные RU/EN образцы, загрузку гарнитуры, fallback, ширину и переносы. Значения — собственные решения Vanya UI, визуальная приёмка обязательна.

## Сочетания и подключение

Manrope + JetBrains Mono — рабочие кабинеты, формы, таблицы, аналитика. Manrope + Spectral — интерфейс с длинными авторскими материалами; JetBrains Mono при необходимости обозначает даты, код и числа. Применяй гарнитуры по смысловым ролям. Spectral в кнопках, меню и плотных таблицах не предусмотрен.

Бренд задаёт семейство через `--vanya-brand-font-serif`; UI предоставляет `--font-serif` и два редакционных класса. Приложение загружает нужные начертания. Витрина использует Google Fonts: regular 400/500/600 и italic 400. При самостоятельном размещении файлов сохраняй OFL и copyright notice. Без веб-шрифта действует serif fallback.

~~~tsx
<article lang="ru">
  <h2 className="ui-type-editorial-heading">История проекта</h2>
  <p className="ui-type-editorial-body">Здесь начинается рассказ.</p>
</article>
~~~

Проверь реально отрисованные кириллические и латинские глифы, включая курсив, на 320/390/1024/1440 px, в обеих темах. CSS font-family и document.fonts.check отдельно не подтверждают использование нужной гарнитуры. Chromium CDP CSS.getPlatformFontsForNode позволяет проверить фактические глифы. Проверь переносы, масштаб и пользовательские интервалы WCAG 1.4.12.

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
