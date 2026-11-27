# Vanya Arc / UI

Vanya UI — дизайн-система Vanya Arc: React-компоненты, токены, каноны интерфейсов и переносимый агентский харнесс. Пакет — `@vanya/ui`; текущая версия исходников — **1.0.0** ([package.json](package.json)). Статус выпуска и проверенные SHA — в [versioning](docs/versioning.md).

**[Живая витрина → ui.vanya-arc.dev](https://ui.vanya-arc.dev/)**

На главной — рабочая волна с событиями. Ниже — каталог компонентов, типографика и правила интерфейсов.

## CLI — Vanya Arc / UI

Установленная версия пакета с CLI предоставляет `vui`. В проекте с установленным пакетом используйте локальный бинарник:

~~~sh
./node_modules/.bin/vui --help
./node_modules/.bin/vui inspect --project .
./node_modules/.bin/vui verify --project . --json
~~~

В исходниках библиотеки без установки CLI: `node scripts/ui-pipeline.mjs --help`. Для разработки самой дизайн-системы: `vui contribute --project /path/to/vanya-ui --dry-run`, затем повторить без `--dry-run` при установленном toolchain. Существующий `vanya-ui-lint` остаётся отдельным CI-совместимым entrypoint. Проверяйте доступность CLI в закреплённой версии пакета.

## Агентам: один переносимый UI-пайплайн

[Контрибуция в дизайн-систему](docs/patterns/contributing.md) — отдельный сценарий существующего харнесса. Команда `node scripts/ui-pipeline.mjs contribute --project .` запускает тесты, typecheck, сборку и дизайн-линтеры библиотеки. Для контрибуции достаточно локальной папки исходников и обычного toolchain.

**[Агентам на витрине](https://ui.vanya-arc.dev/#agents)** · [Agent Mode](https://ui.vanya-arc.dev/agents/) · **[Канонический скилл агента](skills/vanya-ui/SKILL.md)** · [полный рабочий цикл](docs/patterns/ui-feature-pipeline.md) · [CLI](scripts/ui-pipeline.mjs).

Скопируй папку Vanya UI на любую машину с Node.js 20+, дай агенту путь к ней и к приложению. Git, GitHub, Actions, учётные данные и интернет **не нужны для самого пайплайна**:

```sh
node /path/to/vanya-ui/scripts/bootstrap-ui-pipeline.mjs --project /path/to/app
node /path/to/vanya-ui/scripts/ui-pipeline.mjs inspect --project /path/to/app
# Once the verified harness-capable @vanya/ui package and source directories exist:
node /path/to/vanya-ui/scripts/ui-pipeline.mjs adopt --project /path/to/app --sources src --css-output dist
node /path/to/vanya-ui/scripts/ui-pipeline.mjs check --project /path/to/app
node /path/to/vanya-ui/scripts/ui-pipeline.mjs verify --project /path/to/app --json > ui-verification.json
```

Для каждой UI-задачи: `plan --project /path/to/app --scope feature --task "Описание задачи" --target "/route" > ui-receipt.json`, затем реализация, `check`, `verify`, браузерная приёмка и `review --project /path/to/app --receipt ui-receipt.json --verification ui-verification.json`. [Протокол приёмки](docs/patterns/ui-feature-pipeline.md#task-acceptance-receipt) задаёт критерии и доказательства; review проверяет структуру отчёта. Для нового приложения используйте `--scope new`, `--mode react` даже в пустом репозитории и [порядок подключения](docs/patterns/ui-feature-pipeline.md#new-product-setup). Сохраняйте реальный `verify --json > ui-verification.json`. Массовая миграция требует явной задачи. Для React-потребителя требуется совместимый установленный харнесс; bootstrap сохраняет пользовательские инструкции. [Единый quickstart](docs/patterns/design-harness-quickstart.md).

Самопроверка переносимого инструмента: `npm run test:agent` либо `node --test scripts/ui-pipeline.test.mjs scripts/bootstrap-ui-pipeline.test.mjs` (работает без GitHub). Bootstrap создаёт локальные указатели. `adopt` закрепляет `vanya-ui.config.json`, `lint:design` и управляемый блок AGENTS.md. Добавьте прямой вызов установленного харнесса в существующий CI до deploy (см. [quickstart](docs/patterns/design-harness-quickstart.md)); `verify` запускает канонический линтер напрямую. Правила поставляются установленным пакетом. Операции `inspect/check/plan` работают без сети; фактический lint/verify может требовать npm registry для изолированного `npm ci`. `verify` вызывает **существующие локальные** build/browser скрипты приложения; предварительная установка зависимостей/браузера — отдельная задача приложения. Вывод `--json` пригоден для агента. Пройти тесты недостаточно: скилл требует визуальную проверку поведения в браузере. GitHub workflow остаётся необязательной ручной обёрткой.

### Ссылки на автора и исходники

В UI есть `ActionLink` для семантических ссылок с видимым focus и отдельный контурный `GitHubIcon` (legacy Lucide/Feather) для ссылок на репозитории. В витрине ссылка **«Ваня Афанасов ↗»** обозначает автора (`rel=author`), а GitHub-иконка обозначает исходники. Это второстепенные утилиты, не пункты основной навигации. [Исследование](docs/research/author-source-utility-link-2026-11-22.md).

### Состояния взаимодействия

Канонический [контракт hover/focus/pressed/selected/disabled](docs/patterns/interaction-states.md) и [исследовательский цикл](docs/research/hover-research-loop-2026-11-22.md) описывают, как `ActionLink`, `ActionButton`, `ThemeToggle`, `NavLinks`, `SegmentedControl` и другие экспортируемые компоненты используют одну систему `ui-feedback-*` ролей и токенов. [Живой стенд](https://ui.vanya-arc.dev/#interaction-states) проверяется через hover и Tab. Богатые сюжетные сцены остаются осознанными исключениями.

### Действие: нажал → выполняется → результат

Визуального `:active` недостаточно, чтобы сообщить об операции после отпускания кнопки. [Правила действий](docs/patterns/action-feedback.md) и [Press Feedback Research Loop](docs/research/press-feedback-research-loop-2026-11-22.md) задают мгновенный pressed-отклик и правдивые состояния `ActionButton.actionState="pending|success|error"`, которые управляются продуктом. [Живой демо-стенд](https://ui.vanya-arc.dev/#action-feedback) не имитирует внешнюю сеть.

### ARIA tabs, theme menu and browser acceptance

`SegmentedControl` defaults to **filters** (native buttons with `aria-pressed`), not pseudo-tabs. For real tab panels use `semantics="tabs"` with `TabSegmentItem.tabId`/`panelId`, matching `role="tabpanel"` and keyboard arrow/Home/End navigation. This changes prior default semantics; consumers relying on `role=tab` must migrate intentionally and review compatibility before upgrading their pinned SHA. The theme menu handles roving focus, Tab/Shift+Tab and Escape; the site header marks the viewport-active section through native URL fragments.

Portable local browser verification: see [browser-qa](browser-qa/README.md), run `npm run test:browser` after installing the isolated pinned Playwright toolchain. It checks actual hit targets and captures screenshots, but only reviewed real-browser evidence can mark `UI_VERIFIED`. [Implementation and alternatives](docs/research/ux-13-16-repair-loop-2026-11-23.md).

## Версии и обновление потребителей

**1.0.0** — первая стабильная major-версия исходников. Production CI прошёл на [`7dad3ad8`](https://github.com/VanDalkvist/vanya-ui/commit/7dad3ad810dcaedbca050b93c1e46e0995b590a8); установочный SHA [`a7c5a863`](https://github.com/VanDalkvist/vanya-ui/commit/a7c5a86356980e3319326d1a98e28f9f0b9a1d8b) прошёл также consumer-smoke для npm/React 18 и Bun/React 19. На момент проверки 26.11.2026 тег `v1.0.0` и GitHub Release ещё отсутствуют. Дополнительная визуальная приёмка и live-agent eval отложены владельцем. Продукты закрепляют полный SHA и lockfile. См. [статус и SemVer](docs/versioning.md), [историю изменений](CHANGELOG.md) и [проверку опубликованных релизов](https://github.com/VanDalkvist/vanya-ui/releases).

## Айдентика Vanya Arc

**Vanya Arc** — зонтичный бренд с индивидуальными знаками сервисов. Исходный асимметричный V→A принадлежит родителю и UI. Синусоида задаёт генеративный принцип: каждый другой официальный сервис получает собственную утверждённую форму и favicon. Для квадратной аватарки сервиса рекомендуется использовать тот же знак. Родство держится на пластике, цветовых ролях, Manrope и структуре Vanya Arc / Product. [vanya-arc-brand](https://github.com/VanDalkvist/vanya-arc-brand) владеет общим контрактом; продукт владеет собственными утверждёнными активами. Используй `VanyaArcLockup productMark` для индивидуального знака.

[Живой раздел «Айдентика»](https://ui.vanya-arc.dev/#identity) · [Официальный брендбук](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/docs/brand-guidelines.md) · [как бренд подключён к UI](docs/identity/brand.md). Из `@vanya/ui` доступны `VanyaArcMark` и `VanyaArcLockup`.

## Типографика

Manrope — для интерфейсов, JetBrains Mono — для кода и клавиш, Spectral — для отдельных редакционных материалов. Размеры и интервалы задаются ролями в `src/tokens.css`; для длинного чтения используется 16 px и колонка до 66ch.

[Живые образцы](https://ui.vanya-arc.dev/#typography) · [Правила](docs/patterns/typography.md) · [Исследование и аудит](docs/research/typography-audit-2026-11-22.md).

## Тексты

Первый экран показывает рабочий пример и ссылку в каталог. Проектная [редполитика](.agents/redpolitika.md) и [правила текстов](docs/patterns/writing-and-editorial.md) опираются на оригинальные скиллы **Людмилы Сарычевой и Никиты Архипова** — [redaktura-skills](https://github.com/N1arko/redaktura-skills), лицензия [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Используем `promo`, `ux-copy`, `redaktura`, `redpolitika`, сохраняя ссылку и авторство.

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

Для локальной разработки можно использовать соседнюю копию библиотеки (`file:../vanya-ui`) — это не требует GitHub как точки входа в агентный пайплайн. Для удалённой установки закрепи **конкретный проверенный коммит**, а не плавающий `main`:

```sh
bun add 'https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/a7c5a86356980e3319326d1a98e28f9f0b9a1d8b'
```

Этот SHA содержит версию 1.0.0 и проверен в двух consumer-smoke окружениях. Сохраните lockfile. Установка зависимостей требует доступного registry/GitHub; `inspect`, `check` и `plan` работают локально. Исполняемый lint/verify может установить изолированный набор линтеров через npm ci.

Требуются React 18 или 19, Tailwind CSS 4 и сборщик, который обрабатывает TypeScript/TSX из зависимостей. Контракт поставки — ESM source package: `exports`, `main`, `module` и `types` указывают на `src/index.ts`. Потребитель компилирует TS/TSX и обрабатывает CSS. `dist/` содержит витрину сайта. Поддержка CommonJS, Node без TSX-трансформации и npm-релиз пока не заявлена. Для установки и проверки совместимости см. [правила поставки](docs/versioning.md#контракт-поставки).

В глобальном CSS приложения, например `src/styles.css`:

```css
@import "@vanya/ui/tokens.css";
@source "../node_modules/@vanya/ui/src";
```

Путь `@source` задаётся относительно CSS-файла. Он нужен Tailwind для классов внутри библиотеки. `tokens.css` уже импортирует Tailwind; второй импорт `tailwindcss` рядом не требуется. Для точной типографики отдельно подключаются Manrope, Spectral и JetBrains Mono — файлы шрифтов в пакет не входят.

```tsx
import { ActionButton, Badge, CraftCard } from "@vanya/ui";

export function ProjectCard({ onOpen }: { onOpen: () => void }) {
  return (
    <CraftCard className="space-y-4">
      <Badge label="Product" size="sm" />
      <h2 className="font-sans text-lg">Мой проект</h2>
      <ActionButton size="md" onClick={onOpen}>Открыть проект</ActionButton>
    </CraftCard>
  );
}
```

## Рабочие поверхности

В библиотеку входят `WorkspaceSplit`, `ScrollRegion`, `SectionToolbar`, `WorkspaceActionBar`, `WorkspaceEmptyState`, `StickyContextBar` и `WorkspaceContextHeader` вместе с тестами и исследованиями. Их примеры находятся прямо в разделе [«Рабочие поверхности»](https://ui.vanya-arc.dev/#workspace). Библиотека не навязывает приложению второй sticky header или глобальный скролл.

## Редактура первого экрана

На первом экране нет инструкции о том, как нажимать на волну и ползунок. Заголовок называет продукт; работающие примеры и ссылка в каталог показывают остальное. [Фактчек принципов Ильяхова и Сарычевой](docs/research/ilyakhov-copy-audit-2026-11-22.md).

## Исследование первого экрана и редактура

Не повторяем меню под волной. Сохраняем свободное место и показываем работу компонентов на самом первом экране: событие, инспектор, ползунок и тему. Тексты объясняют действие, а не обещают абстрактные преимущества. [Решение и источники](docs/research/hero-shortcuts-and-copy-2026-11-21.md).

## Что входит

- **Действия:** `ActionButton`, `SegmentedControl`, `RangeSlider`, `ThemeToggle`.
- **Метки:** `Tag` для тем, `Badge` для категорий и статусов, `Kbd` для клавиш. У `Badge` видимая подпись обязательна; приложение задаёт иконку и цвет категории или семантический `tone` статуса. Для выбора используются `SegmentedControl` и `ActionButton` с `aria-pressed`.
- **Рабочие поверхности:** `WorkspaceSplit`, `ScrollRegion`, `SectionToolbar`, `WorkspaceContextHeader`, `StickyContextBar`, `WorkspaceActionBar`, `WorkspaceEmptyState`.
- **Карточки и детали:** `CraftCard`, `EventCard`, `TimelinePreviewCard`, `InspectDrawer`, `ReceiptDigestModal`.
- **Волна и события:** `SineWave`, `EventPoint`, `TimelineEvent`, `Minimap`.
- **Графики и индикаторы:** `EnergyRadar`, `SpiderRadar`, `VoiceWaveIndicator`, `HearthPulse`.
- **Горячие клавиши:** `Kbd`, `ShortcutKeys`.
- **Айдентика:** `VanyaArcMark`, `VanyaArcLockup`.
- **Навигация и ссылки:** `NavLinks`, `AvatarLink`, `LinkChip`, `Divider`.
- **Раскрытие подробностей:** `Disclosure` с `summary`, содержимым и нативными `open` / `onToggle`.
- **Тема:** `useTheme`, `applyTheme`; режимы `light`, `dark`, `system`.

Полный публичный API и типы находятся в [`src/index.ts`](src/index.ts). Карточки проектов и мотивационные блоки собираются из общих примитивов; приложение владеет данными и действиями. Цвета и иконки категорий передаются явно в Badge и радары.

## Размеры и состояния

У компактных кнопок, бейджей, клавиш, ссылок, аватарок и сегментов общая сетка: `sm` = 24 px, `md` = 32 px. Плоский `Tag` использует соответствующий текстовый размер без фиксированной высоты. Шрифт, иконки, интервалы и высота согласованы. `SegmentedControl` использует общие `sm` и `md`.

У событий вес `1–4` задаёт видимый радиус точки, а `size` — область взаимодействия. `TimelineEvent` объединяет точку и карточку в одно нативное действие. Пассивные метки не изображают кнопки; действия поддерживают настоящие hover, focus и disabled-состояния.

Цвета и размеры заданы в [`src/tokens.css`](src/tokens.css). Основные роли: `ground`, `surface`, `ink`, `accent`, `border`, `border-strong`. Тёплая светлая и тёмная палитры общие для компонентов. Manrope используется в интерфейсе, Spectral — в редакционном тексте, JetBrains Mono — в метках и числах. Подробнее о составе и ограничениях — [`DESIGN.md`](DESIGN.md).

## Разработка

```sh
bun install
bun run dev       # интерактивная витрина
bun run test      # Vitest + Node + release metadata + harness tests
bunx tsc --noEmit -p tsconfig.build.json  # проверка исходников библиотеки
bun run sync      # справочник токенов и реестр экспортов
bun run build     # production-сборка витрины в dist/
bun run lint:design:pilot # source lint и отрицательные fixtures
```

Сборщик — Vite 8, тесты — Vitest 5. `/` и `/showcase.html` используют одну React-точку входа. Сайт — **единый лонгрид** с разделами `/#composition`, `/#identity`, `/#principles`, `/#catalog`, `/#workspace`, `/#setup`. Прежний адрес `/guidelines/navigation/` перенаправляет на `/#browser-navigation`. При сборке HTML предварительно рендерится для агентов без JavaScript, а React гидратирует интерактивные примеры. Публичная конфигурация деплоя находится в [`wrangler.jsonc`](wrangler.jsonc), а секреты и токены — только в Cloudflare (никогда не в Git). Сборка и деплой выполняются Cloudflare Workers Builds при push/merge в `main`; см. [`docs/deployment.md`](docs/deployment.md).

Для агентов сайт отдаёт [`llms.txt`](https://ui.vanya-arc.dev/llms.txt) (читаемое оглавление), [`llms-full.txt`](https://ui.vanya-arc.dev/llms-full.txt) (генерируемая справка), [Markdown лонгрида](https://ui.vanya-arc.dev/index.md), [Markdown компонентов](https://ui.vanya-arc.dev/reference/components.md), `robots.txt`, `sitemap.xml`, canonical, JSON-LD и заранее отрендеренный HTML. Исходники документации — `docs/` и `scripts/sync.ts`. `llms.txt` — соглашение для агентов, не гарантия поисковой индексации; [спецификация](docs/agent-discovery.md). `registry.json` собирается из реальных экспортов.

## Публикация витрины

Ветка `main` — источник production для Cloudflare Worker `vanya-ui`, обслуживающего `https://ui.vanya-arc.dev`. Cloudflare Workers Builds собирает проект, запускает тесты, проверяет типы и публикует `dist/` только после успешной сборки. Для конфигурации Worker используется публичный [`wrangler.jsonc`](wrangler.jsonc), а ключи деплоя хранятся в Cloudflare, не в репозитории. Детали и проверка: [`docs/deployment.md`](docs/deployment.md).

## Лицензирование: код, исследования и фирменный знак

- **Код:** MIT (корневой [LICENSE](LICENSE)); метаданные смешанного пакета указывают `SEE LICENSE IN LICENSING.md`, так как в репозитории также есть авторские исследования под CC BY.
- **Выбранные авторские исследования:** CC BY 4.0, с пофайловой маркировкой. Это не лицензия на чужие цитаты или сторонние материалы.
- **Фирменный знак Vanya Arc:** исходники и условия использования находятся в [бренд-репозитории](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/LICENSING.md). Ранее выданные MIT-права на исторические копии сохраняются.
- **Сторонние материалы:** собственные условия и уведомления.

[Точная таблица областей действия](LICENSING.md) · [Исследование и юридические основания](docs/legal/licensing-implementation-2026-11-22.md). В `package.json` указано `SEE LICENSE IN LICENSING.md`: код MIT, отдельные исследования CC BY 4.0, сторонние материалы — по их лицензиям.

## Цитирование и атрибуция

Ссылки на чужие методики, книги и спецификации — источники для собственных выводов, **не разрешение перепечатывать материал**. Для копирования лицензированного фрагмента нужны его условия атрибуции, а для защищённой цитаты — законное основание и обоснованный объём. [Правила для авторов и агентов](docs/patterns/sources-and-attribution.md) · [аудит источников](docs/research/sources-and-licenses-audit-2026-11-22.md).

## Лицензии сторонних библиотек

Зависимости используют собственные лицензии; MIT этого проекта **не заменяет** их. В частности, Lucide — ISC, а часть иконок наследует MIT-уведомления Feather. Шрифты Manrope, Spectral и JetBrains Mono — OFL-1.1; они подключаются через Google Fonts и не лежат в репозитории. Скиллы Людмилы Сарычевой и Никиты Архипова распространяются под CC BY 4.0; их исходники здесь не копируются.

- [Полный реестр уведомлений и лицензия Lucide / Feather](THIRD_PARTY_NOTICES.md)
- [Проверка лицензирования и открытые решения](docs/legal/license-audit-2026-11-22.md)
- [Автоматический список лицензий зависимостей, включённых в сайт](https://ui.vanya-arc.dev/licenses.txt) — генерируется Vite на каждом деплое.

При публикации собственных приложений на базе `@vanya/ui` проверяй лицензии **их** зависимостей и при необходимости включай уведомления в дистрибутив. Файл `licenses.txt` относится к собранной витрине Vanya UI, а не ко всем будущим приложениям.

## Лицензия и авторство

Авторский программный код и обычные авторские руководства — [MIT](LICENSE). Полный состав смешанных лицензий: [LICENSING.md](LICENSING.md). Copyright © 2026 [Ваня Афанасов](https://vanya-arc.dev/).

При копировании и распространении кода или его существенных частей сохраняются имя автора, copyright и текст лицензии. Отдельная обязательная ссылка в интерфейсе в MIT не добавлена.

**Название и знак:** для новых версий действуют [правила официального бренда](https://github.com/VanDalkvist/vanya-arc-brand/blob/83ade0e4b8bc486c0fbc52df8b04b317d8e40bb9/BRAND.md) и отдельная область действия в [LICENSING.md](LICENSING.md). Они не отменяют разрешения, полученные с историческими MIT-версиями, и не являются подтверждением регистрации товарного знака.

### Media catalogues

`MediaCard` and `SearchField` are reusable presentation primitives for readable film, book and media collections. `MediaCard` accepts native-link `href`, artwork slot, headline, metadata and an optional footer; its layout may be `poster` (grid) or `row` (compact shelf). `SearchField` is fully controlled with an accessible label and a clear action; the app owns the search algorithm. Pair with `SectionToolbar variant="section"`, `SelectField`, `SegmentedControl semantics="filters"` and labeled `ScrollRegion` rather than inventing local lookalikes. [Composition rules](docs/composition/working-surfaces.md#8-media-catalogues-and-searchable-collections).

### Загрузка и skeleton

Новые переиспользуемые компоненты: `Skeleton` (`text`, `block`, `circle`), `SkeletonText`, `MediaCardSkeleton` (`poster` / `row`) и `LoadingRegion`. Их геометрия повторяет реальные компоненты, а цвета и анимация — `@vanya/ui/tokens.css`. `LoadingRegion` сообщает о загрузке один раз, вложенные формы не участвуют в клавиатурной навигации. Ошибки и запросы остаются в логике приложения. [Правила и примеры](docs/patterns/loading-states.md) · [демо](https://ui.vanya-arc.dev/#loading-states).

### Compact filter toolbar

`SearchField` and `SegmentedControl` accept `density="toolbar"`, while `FilterSelect` provides an aligned 40px branded dropdown listbox rendered through a portal with optional search, Escape/arrow-key navigation and viewport-aware placement. `SelectField` remains a native select for regular forms. Sticky placement and adaptive overflow belong to the consuming app. The <https://ui.vanya-arc.dev/#compact-filter-toolbar> specimen and [working-surfaces guide](docs/composition/working-surfaces.md#10-single-row-sticky-catalogue-filters) show how to keep the filter row compact and accessible.


## Назначение (уточнение владельца, 24.11.2026)

Vanya UI — внутренняя дизайн-система для разработки собственных продуктов Vanya Arc. Публичная витрина помогает владельцу видеть компоненты и проверять их, а агентам — использовать библиотеку в его проектах. Коммерциализация дизайн-системы, привлечение сторонних разработчиков и внешняя adoption-метрика владельцем не заявлены. Не предлагать эти направления по умолчанию.

### Миграция существующего продукта
После `adopt` сначала выполните строгий lint. При явно согласованной миграции с накопленным долгом выполните `node /path/to/vanya-ui/scripts/ui-pipeline.mjs baseline --project /path/to/app` один раз и проверьте реальные записи `vanya-ui.baseline.json`. Команда фиксирует CSS и JSX долг и включает режим baseline в конфигурации. Повторный автоматический захват запрещён; изменение исходной строки или добавление нарушения блокирует lint. Храните baseline в самом продукте, учитывайте приватность исходников. Новые продукты остаются strict.
