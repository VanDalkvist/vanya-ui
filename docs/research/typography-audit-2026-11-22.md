<!-- SPDX-FileCopyrightText: 2026 Vanya Afanasov
SPDX-License-Identifier: CC-BY-4.0
Only original contributions are licensed. Third-party works retain their own rights.
This and later revisions are CC BY 4.0; historical MIT grants remain. -->

# Типографика Vanya Arc / UI — ресёрч и аудит

Дата: 22 ноября 2026. Метод: аудит исходников Vanya UI + сравнение с публичными дизайн-системами. Не подменять обзор кода заявлением о полном визуальном или WCAG-аудите.

## Проблемы до правок

| Что обнаружено | Доказательство в коде | Последствие |
| --- | --- | --- |
| Мелкий длинный текст | `.scene-intro p` и `.catalog-intro` 14px, описания секций 13px, guide paragraphs 14px | Длинный лонгрид читается как набор вспомогательных подписей |
| Чрезмерно мелкие подписи | `.identity-panel-label` 11px, `.guide-eyebrow` 11px, breadcrumbs 10px, `--size-sm-font` 11px | На узком экране и при масштабировании трудно разбирать |
| Нет ролей | Шрифты заданы множеством отдельных CSS-правил в showcase.css | Ритм зависит от экрана; агентам нечего переиспользовать |
| Сложно проверить системность | Есть Manrope/Fraunces/JetBrains Mono, но нет видимых образцов их назначений | Неясно, какой шрифт и размер использовать в новом приложении |

## Исследование

- [Carbon typography](https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview): ролевая шкала, различие продуктивных/редакционных применений.
- [Apple HIG typography](https://developer.apple.com/design/human-interface-guidelines/typography): иерархия, последовательность, осторожность со смешением гарнитур.
- [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/): мобильные размеры пересматриваются ради чтения.
- [USWDS typography](https://designsystem.digital.gov/components/typography/): назначение размеров, ритм и ширина строки.
- [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Text Spacing](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html): браузерный zoom, перенос текста, изменяемые интервалы.

## Решение Vanya UI

Оставить три действующие гарнитуры. Добавить в `src/tokens.css` роли `ui-type-display/heading/subheading/body/compact/caption/code`, размер текста 1rem/1.65, компактный .875rem, подпись .8125rem и меру 66ch. Заменить локальные размеры длинного текста витрины общими токенами. Немного увеличить `--size-sm-font` 11→12px и `--size-md-font` 12→13px, сохранив два размера компонентов. Раздел `/#typography` демонстрирует реальные классы. Публичный нормативный файл — [docs/patterns/typography.md](../patterns/typography.md).

## Риски и проверки

Рост подписей затрагивает другие продукты при обновлении пакета — проверить узкие кнопки, таблицы, мобильную шапку, 200% zoom, 320 CSS px, dark/light. Для структурированной типографики хедеров и страниц отдельно проверить русский текст и перенос. Визуальная приёмка на устройствах и настоящий аудит контраста остаются отдельными задачами. Упоминание WCAG — критерий проверки, не заявление о формальной сертификации.
