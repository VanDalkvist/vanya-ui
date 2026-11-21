# Vanya Arc / UI

React-компоненты и CSS-токены для интерфейсов [vanya-arc.dev](https://vanya-arc.dev/). Имя пакета — `@vanya/ui`.

**[Живая витрина → ui.vanya-arc.dev](https://ui.vanya-arc.dev/)**

Витрина — один лонгрид: на первом экране можно открыть событие на волне, изменить расстояние между точками и переключить тему. Дальше — айдентика, типографика, тексты, принципы, компоненты и рабочие поверхности.

## Айдентика Vanya Arc

**Vanya Arc** — родительский бренд, а **Vanya Arc / UI** — дизайн-система. Визуальная подпись состоит из исходного асимметричного знака (маленький тёмный гребень перетекает в большой терракотовый) и вордмарка на основе Manrope. Слова `Vanya Arc` цельные, продуктовый суффикс `UI` акцентный. Это разные уровни бренда, а не два независимых логотипа.

[Живой раздел «Айдентика»](https://ui.vanya-arc.dev/#identity) · [Нормативные правила, цвета и применение](docs/identity/brand.md). Из `@vanya/ui` доступны `VanyaArcMark` и `VanyaArcLockup`.

## Типографика

Manrope — для интерфейсов, JetBrains Mono — для кода и клавиш, Fraunces — для отдельных редакционных материалов. Размеры и интервалы задаются ролями в `src/tokens.css`; для длинного чтения используется 16 px и колонка до 66ch.

[Живые образцы](https://ui.vanya-arc.dev/#typography) · [Правила](docs/patterns/typography.md) · [Исследование и аудит](docs/research/typography-audit-2026-11-22.md).

## Тексты

Первый экран называет библиотеку и предлагает действия с настоящими компонентами. Проектная [редполитика](.agents/redpolitika.md) и [правила текстов](docs/patterns/writing-and-editorial.md) опираются на оригинальные скиллы **Людмилы Сарычевой и Никиты Архипова** — [redaktura-skills](https://github.com/N1arko/redaktura-skills), лицензия [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Используем `promo`, `ux-copy`, `redaktura`, `redpolitika`, сохраняя ссылку и авторство.

[Живой раздел «Тексты»](https://ui.vanya-arc.dev/#writing) · [Аудит первого экрана](docs/research/copy-audit-2026-11-22.md).

## Принципы интерфейса

**[Навигация и URL →](https://ui.vanya-arc.dev/#browser-navigation)** — правило для всех приложений на Vanya UI: у каждой страницы и разделяемого представления есть собственный прямой адрес, а Back/Forward, обновление, копирование и открытие ссылки в новой вкладке работают по умолчанию. **Ссылка ведёт на страницу, кнопка выполняет действие.**

Полная спецификация и чек-лист для разработчика или агента: [docs/patterns/browser-navigation.md](docs/patterns/browser-navigation.md). Правило обязательно для приложений, но библиотека не навязывает роутер.

## Горячие клавиши

Клавиши ускоряют частые действия, но не заменяют ссылки и кнопки. В шапке витрины есть кнопка `?` со справкой, а команды переходов работают последовательно: `G` → `I` открывает айдентику, `G` → `C` — компоненты. Буквенные сокращения можно отключить. Системные сочетания и ввод текста не перехватываются.

- [Живые правила и примеры](https://ui.vanya-arc.dev/#keyboard-shortcuts)
- [Нормативный паттерн: клавиши, стиль, доступность, тесты](docs/patterns/keyboard-shortcuts.md)
- Экспортируемые компоненты `Kbd` и `ShortcutKeys` оформляют сочетания по токенам дизайн-системы.

## Публичность и безопасность публикаций

**Весь репозиторий и [ui.vanya-arc.dev](https://ui.vanya-arc.dev/) публичные.** Любой коммит, пример, снимок экрана и собранный JavaScript потенциально доступен всем. Нельзя переносить сюда секреты, закрытые ссылки, данные из приватных репозиториев и подключённых аккаунтов, внутренние конфигурации, пользовательские записи, логи или экспорт аналитики. В примерах — только вымышленные или отдельно согласованные публичные данные.

Перед коммитом и деплоем агент обязан проверить diff и содержимое `dist/`. Секреты Cloudflare — только через защищённые bindings, никогда в клиентском коде. Подробный чек-лист: [docs/patterns/publication-safety.md](docs/patterns/publication-safety.md).

## Подключение

Пакет устанавливается напрямую из основной ветки GitHub:

```sh
bun add github:VanDalkvist/vanya-ui
```

Требуются React 18 или 19, Tailwind CSS 4 и сборщик, который обрабатывает TypeScript/TSX из зависимостей. Публичный `exports` указывает на исходники; отдельного npm-релиза и предварительно собранного JS-пакета нет.

В глобальном CSS приложения, например `src/styles.css`:

```css
@import "@vanya/ui/tokens.css";
@source "../node_modules/@vanya/ui/src";
```

Путь `@source` задаётся относительно CSS-файла. Он нужен Tailwind для классов внутри библиотеки. `tokens.css` уже импортирует Tailwind; второй импорт `tailwindcss` рядом не требуется. Для точной типографики отдельно подключаются Manrope, Fraunces и JetBrains Mono — файлы шрифтов в пакет не входят.

```tsx
import { ActionButton, CategoryBadge, CraftCard } from "@vanya/ui";

export function ProjectCard({ onOpen }: { onOpen: () => void }) {
  return (
    <CraftCard className="space-y-4">
      <CategoryBadge category="Product" size="sm" />
      <h2 className="font-sans text-lg">Мой проект</h2>
      <ActionButton size="md" onClick={onOpen}>Открыть проект</ActionButton>
    </CraftCard>
  );
}
```

## Рабочие поверхности и состав PR #1

Из PR #1 в `main` перенесены `WorkspaceSplit`, `ScrollRegion`, `SectionToolbar`, `WorkspaceActionBar`, `WorkspaceEmptyState`, `StickyContextBar` и `WorkspaceContextHeader` вместе с тестами и исследованиями. Их примеры находятся прямо в разделе [«Рабочие поверхности»](https://ui.vanya-arc.dev/#workspace). Библиотека не навязывает приложению второй sticky header или глобальный скролл.

## Исследование первого экрана и редактура

Не повторяем меню под волной. Сохраняем свободное место и показываем работу компонентов на самом первом экране: событие, инспектор, ползунок и тему. Тексты объясняют действие, а не обещают абстрактные преимущества. [Решение и источники](docs/research/hero-shortcuts-and-copy-2026-11-21.md).

## Что входит

- **Действия:** `ActionButton`, `SegmentedControl`, `RangeSlider`, `ThemeToggle`.
- **Метки:** `CategoryBadge`, `Tag`, `MeshStatusBadge`, `Kbd`.
- **Рабочие поверхности:** `WorkspaceSplit`, `ScrollRegion`, `SectionToolbar`, `WorkspaceContextHeader`, `StickyContextBar`, `WorkspaceActionBar`, `WorkspaceEmptyState`.
- **Карточки и детали:** `CraftCard`, `DeskSlotCard`, `EventCard`, `TimelinePreviewCard`, `InspectDrawer`, `ReceiptDigestModal`.
- **Волна и события:** `SineWave`, `EventPoint`, `TimelineEvent`, `Minimap`.
- **Графики и индикаторы:** `EnergyRadar`, `SpiderRadar`, `VoiceWaveIndicator`, `HearthPulse`.
- **Горячие клавиши:** `Kbd`, `ShortcutKeys`.
- **Айдентика:** `VanyaArcMark`, `VanyaArcLockup`.
- **Навигация и ссылки:** `NavLinks`, `AvatarLink`, `LinkChip`, `DisclosurePill`, `Divider`.
- **Тема:** `useTheme`, `applyTheme`; режимы `light`, `dark`, `system`.

Полный публичный API и типы находятся в [`src/index.ts`](src/index.ts). `OfferCard` сохранён как экспорт для совместимости, но временно убран из каталога.

## Размеры и состояния

У восьми компактных семейств — кнопок, тегов, статусов, категорий, клавиш, ссылок, аватарок и сегментов — общая сетка: `sm` = 24 px, `md` = 32 px. Шрифт, иконки, интервалы и высота согласованы; старый `xs` у `SegmentedControl` остаётся алиасом `sm`.

У событий вес `1–4` задаёт видимый радиус точки, а `size` — область взаимодействия. `TimelineEvent` объединяет точку и карточку в одно нативное действие. Пассивные метки не изображают кнопки; действия поддерживают настоящие hover, focus и disabled-состояния.

Цвета и размеры заданы в [`src/tokens.css`](src/tokens.css). Тёплая светлая и тёмная палитры общие для компонентов. Manrope используется в интерфейсе, Fraunces — в редакционном тексте, JetBrains Mono — в метках и числах. Подробнее о составе и ограничениях — [`DESIGN.md`](DESIGN.md).

## Разработка

```sh
bun install
bun run dev       # интерактивная витрина
bun run test      # Vitest
bunx tsc --noEmit -p tsconfig.build.json  # проверка исходников библиотеки
bun run sync      # справочник токенов и реестр экспортов
bun run build     # production-сборка витрины в dist/
```

Сборщик — Vite 8, тесты — Vitest 5. `/` и `/showcase.html` используют одну React-точку входа. Сайт — **единый лонгрид** с разделами `/#composition`, `/#identity`, `/#principles`, `/#catalog`, `/#workspace`, `/#setup`. Прежний адрес `/guidelines/navigation/` перенаправляет на `/#browser-navigation`. При сборке HTML предварительно рендерится для агентов без JavaScript, а React гидратирует интерактивные примеры. Публичная конфигурация деплоя находится в [`wrangler.jsonc`](wrangler.jsonc), а секреты и токены — только в Cloudflare (никогда не в Git). Сборка и деплой выполняются Cloudflare Workers Builds при push/merge в `main`; см. [`docs/deployment.md`](docs/deployment.md).

Для агентов сайт отдаёт [`llms.txt`](https://ui.vanya-arc.dev/llms.txt) (читаемое оглавление), [`llms-full.txt`](https://ui.vanya-arc.dev/llms-full.txt) (генерируемая справка), [Markdown лонгрида](https://ui.vanya-arc.dev/index.md), [Markdown компонентов](https://ui.vanya-arc.dev/reference/components.md), `robots.txt`, `sitemap.xml`, canonical, JSON-LD и заранее отрендеренный HTML. Исходники документации — `docs/` и `scripts/sync.ts`. `llms.txt` — соглашение для агентов, не гарантия поисковой индексации; [спецификация](docs/agent-discovery.md). `registry.json` собирается из реальных экспортов.

## Публикация витрины

Ветка `main` — источник production для Cloudflare Worker `vanya-ui`, обслуживающего `https://ui.vanya-arc.dev`. Cloudflare Workers Builds собирает проект, запускает тесты, проверяет типы и публикует `dist/` только после успешной сборки. Для конфигурации Worker используется публичный [`wrangler.jsonc`](wrangler.jsonc), а ключи деплоя хранятся в Cloudflare, не в репозитории. Детали и проверка: [`docs/deployment.md`](docs/deployment.md).

## Лицензирование: код, исследования и фирменный знак

- **Код:** MIT (корневой [LICENSE](LICENSE)).
- **Выбранные авторские исследования:** CC BY 4.0, с пофайловой маркировкой. Это не лицензия на чужие цитаты или сторонние материалы.
- **Фирменный знак Vanya Arc:** отдельные [правила бренда](BRAND.md); геометрия и SVG выделены из MIT-сферы для новых версий, насколько права на них принадлежат правообладателю. Ранее выданные права на прежние версии сохраняются.
- **Сторонние материалы:** собственные условия и уведомления.

[Точная таблица областей действия](LICENSING.md) · [Исследование и юридические основания](docs/legal/licensing-implementation-2026-11-22.md). Собственная лицензия MIT в `package.json` относится к коду библиотеки, **не** означает, что каждый файл и чужой материал распространяется под MIT.

## Лицензии сторонних библиотек

Зависимости используют собственные лицензии; MIT этого проекта **не заменяет** их. В частности, Lucide — ISC, а часть иконок наследует MIT-уведомления Feather. Шрифты Manrope, Fraunces и JetBrains Mono — OFL-1.1; они подключаются через Google Fonts и не лежат в репозитории. Скиллы Людмилы Сарычевой и Никиты Архипова распространяются под CC BY 4.0; их исходники здесь не копируются.

- [Полный реестр уведомлений и лицензия Lucide / Feather](THIRD_PARTY_NOTICES.md)
- [Проверка лицензирования и открытые решения](docs/legal/license-audit-2026-11-22.md)
- [Автоматический список лицензий зависимостей, включённых в сайт](https://ui.vanya-arc.dev/licenses.txt) — генерируется Vite на каждом деплое.

При публикации собственных приложений на базе `@vanya/ui` проверяй лицензии **их** зависимостей и при необходимости включай уведомления в дистрибутив. Файл `licenses.txt` относится к собранной витрине Vanya UI, а не ко всем будущим приложениям.

## Лицензия и авторство

[MIT](LICENSE). Copyright © 2026 [Ваня Афанасов](https://vanya-arc.dev/).

При копировании и распространении кода или его существенных частей сохраняются имя автора, copyright и текст лицензии. Отдельная обязательная ссылка в интерфейсе в MIT не добавлена.

**Название и знак:** для новых версий действуют [BRAND.md](BRAND.md) и отдельная область действия в [LICENSING.md](LICENSING.md). Они не отменяют разрешения, полученные с историческими MIT-версиями, и не являются подтверждением регистрации товарного знака.
