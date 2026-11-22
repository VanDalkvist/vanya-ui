# Hover Research Loop 01 — Vanya UI, 22 ноября 2026

## 0. Объект и граница

Репозиторий `VanDalkvist/vanya-ui`, исходники `src/tokens.css`, `src/showcase/showcase.css`, `src/components/*.tsx`. Пользователь заметил слишком крупную GitHub-иконку и разночтения hover на иконках, теме, ссылках и переходах. Цель — системное, переиспользуемое правило, а не косметический патч одной шапки. Не изменять палитру и смысловые анимации сюжетных сцен без отдельного evidence.

## 1. NMT — какую работу должен выполнять hover

**Job:** когда человек впервые наводит курсор или переходит по Tab, он должен за долю секунды понять, *что перед ним*, *можно ли это активировать*, *что выбрано* и *где его фокус*, не теряя текущую композицию. Он не должен запоминать разную грамматику обратной связи для GitHub, темы, навигации и фильтра.

**Failing signals:** лишний визуальный акцент на маленькой утилитарной иконке; hover/selected выглядят одинаково; фокус теряется; disabled «подсвечивается»; контент прыгает от transform/shadow; hover на части ссылки оставляет неоднозначную кликабельную область.

**Что не является работой hover:** показать скрытую важную функцию, указать текущий постоянный выбор, заменить label, компенсировать плохую компоновку или анимировать интерфейс ради самой анимации.

## 2. Текущее состояние (проверено по файлам, не по браузерным скриншотам)

| Компонент/поверхность | Наблюдение до цикла | Риск | Решение |
| --- | --- | --- | --- |
| `ShowcaseHeader`, GitHub | 17px stroke внутри 36px круга; локальный accent и background hover | контур доминирует в шапке; не совпадает с 14px иконкой `vanya-arc.dev` | 14px рисунок / 32px target, общая icon feedback роль |
| `ThemeToggle` | 24px target, icon 16px, только смена цвета на hover; локальный `outline-none`, menuitem без выбора | трудно попасть, focus слабый, selected смешан с hover | target 32px, glyph 14px, role focus/row/selected + keyboard |
| `ActionLink` | hover accent/text/mono/pill по несвязанным Tailwind-правилам, отдельный focus после предыдущей итерации | разночтение между utility / link | один role + variant, 2px focus |
| `ActionButton` | несколько hover схем, `focus-visible:outline-none` | клавиатурный фокус недостаточно явный | роль feedback + variant / ring |
| `NavLinks` | hover accent, selected accent и focus none | hover выдаёт себя за выбранный пункт | hover neutral, selected accent, focus ring |
| `SegmentedControl` | hover background на unselected, selected persistent, outline тонкий | визуальная непоследовательность с theme segmented | сохранить selected, единый нейтральный hover |
| `LinkChip` | hover underline всего якоря, но сам URL hover менял цвет отдельно | hover «разорван» внутри одной ссылки | feedback на всем anchor |
| `AvatarLink` | scale 1.05, accent-border и shadow на любом hover | украшательство, всплеск и шум на сетке | border-only feedback, без роста |
| `FilterSelect` | хорошие keyboard active/selected states, но trigger:hover срабатывал на disabled и touch | sticky hover, ложное действие | оставить ARIA/data-active, сузить pointer hover |
| `MediaCard`, `TimelineEvent` | artwork-shadow / story lift | могли быть намеренной частью выразительной механики | оставить как исключения до UX-доказательств |
| `CraftCard` | `isInteractive` добавляет cursor/hover на div | роль элемента не доказана: возможно ложная кликабельность | открытое последующее решение, без слепой API-ломки |
| `DeskSlotCard` | у outer div есть `onClick` и hover, внутри отдельно кнопка заголовка и `onPark` | pointer/keyboard семантика расходится, возможна вложенная активация | **отдельный аудит API и потребителей**, не менять массово без сценариев |
| `Minimap` | `role=region` и pointer onClick | кликабельный сегмент не равен keyboard-action | пересмотреть интерактивный rail и стрелочную навигацию в отдельной UX задаче |

## 3. Внешние первоисточники и что они действительно говорят

- [NN/g — Button States: Communicate Interaction](https://www.nngroup.com/articles/button-states-communicate-interaction/): различать enabled/disabled/hover/focus/pressed; hover показывает возможность действия, focus — местонахождение клавиатуры.
- [Atlassian — Color foundations](https://atlassian.design/foundations/color/) и [design tokens](https://atlassian.design/components/tokens/): interactive tokens имеют разные роли hovered/pressed/selected/focused/disabled; не смешивать выбранность и фокус.
- [Carbon — Color foundations](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview), [Link guidelines](https://www.carbondesignsystem.com/building-blocks/core/components/link/guidelines): ссылка — навигация, меняет text token/underline, не притворяется кнопкой; active/hover и focus оформлены отдельно.
- [Radix Colors — Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale): ступени цветовой шкалы соответствуют поверхностям, hover и границам; используем смысл роли, но не копируем цвета.
- [Material 3 — State layers](https://m3.material.io/foundations/interaction/states/state-layers): overlay через цвет content/компонента (обычный ориентир около 8% hover). Это конкретная M3 модель, не нормативная цифра Vanya UI.
- [Apple HIG — Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices): есть различные highlight/lift/hover эффекты для разных элементов, не одна анимация для всех.
- [NN/g — The role of enhancement](https://www.nngroup.com/articles/enhancement/): hover недоступен всем устройствам/людям; не делать его главным путём к функциям.
- [MDN — Media query fundamentals](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries): `hover` и `pointer` медиапризнаки позволяют отличить мышь от coarse устройств.
- [W3C — WCAG 2.4.7, 2.4.13, 2.5.8, 1.4.13](https://www.w3.org/TR/WCAG22/): фокус заметен; есть минимальные правила размера pointer target, а всплывающий на hover/focus контент должен быть управляем.

Права: все ссылки **reference-only**. Ни текст, ни чужие изображения/готовые схемы не переносились в пакет.

## 4. Шторм альтернатив и критический разбор

**A. «Всегда amber на hover».** За: быстро, заметно. Против: hover визуально неотличим от выбранного раздела, вся шапка слишком акцентная, нет модели для disabled и focus. **Отказ.**

**B. «Всё поднимается и тень растёт».** За: яркая тактильная реакция. Против: одинаково трактует ссылку, кнопку, аватар и событие; отвлекает и расходует motion budget на каждое наведение, не масштабируется на плотные панели. **Отказ для системных controls; допустимо только для смысловых событий.**

**C. «Роли × состояния».** За: последовательная система, поддержка темы, focus и touch; не ломает специфичную композицию. Против: требует дисциплины в стилях, инвентаризации и регрессионной защиты. **Выбрано.** Введены роль-классы `ui-feedback-*` поверх семантических токенов и настоящий интерактивный стенд.

**D. «Ничего не трогать, просто уменьшить GitHub».** За: минимальный риск. Против: оставляет главный пользовательский запрос о несогласованных hovers нерешённым. **Отказ, кроме как размер иконки — немедленный локальный фикс.**

## 5. Имплементация и границы

В Vanya UI источником состояний стал `src/tokens.css`. Обновлены `ActionLink`, `ActionButton`, `NavLinks`, `ThemeToggle`, `SegmentedControl`, `AvatarLink`, `LinkChip`, `FilterSelect`, `ShowcaseHeader`. По умолчанию два разных контекста — обычная ссылка и навигация — **не обязаны иметь одинаковый hover**: первый может подчёркиваться, второй только менять текстовый тон. Selected всегда остаётся отдельным устойчивым состоянием.

Галерея [живых состояний](https://ui.vanya-arc.dev/#interaction-states) собрана из тех же реальных экспортов. Документация является агентским контрактом, а не картинкой.

### Риски / следующий критический проход

1. UI-библиотека импортируется другими продуктами через SHA. Не обновлять их автоматически: новые состояния могут визуально отличаться.
2. `CraftCard isInteractive` требует отдельной проверки его потребителей; div c hover без корректной кнопочной семантики опасен.
3. Для `TimelineEvent`, `MediaCard`, `EventPoint` отдельно оценить движение/глубину в реальных сценариях, без слепой «унификации».
4. `DeskSlotCard` и `Minimap` требуют отдельного аудита именно клавиатурной семантики и структуры событий: hover полирует только визуальную сторону, не исправляет ложное ощущение интерактивности.
5. Позже оценить поведение pointer coarse на iPad с мышью и контраст в обоих цветовых режимах.

## 6. Acceptance и доказательства

Автоматически: статические контракты, component-registry, Jest/Vitest DOM-семантика, keyboard menu, `prefers-reduced-motion`, реальные переходы и наличие публичного документа. Отдельно: Cloudflare build/deploy по точному SHA.

**Визуально:** пройти URL `#interaction-states`, зафиксировать screenshots default / hover / focus / selected / disabled при 1440×900, 390×844, light/dark, zoom 200%, mouse + keyboard + touch; сравнить размеры hit targets и эффекты. Если браузер/скриншоты не были доступны, статус **NOT VISUALLY VERIFIED**, даже при зелёных тестах.

