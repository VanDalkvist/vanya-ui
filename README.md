# vanya-arc/ui

React-компоненты и CSS-токены для интерфейсов [vanya-arc.dev](https://vanya-arc.dev/). Имя пакета — `@vanya/ui`.

**[Живая витрина → ui.vanya-arc.dev](https://ui.vanya-arc.dev/)**

Витрина показывает настоящие компоненты: собранную сцену с волной и событиями, каталог, светлую и тёмную темы, разные размеры и состояния. Примеры открывают детали и реагируют на клавиатуру — это не отдельные HTML-копии компонентов.

## Подключение

Пакет устанавливается напрямую из GitHub. Текущая версия находится в ветке `fix/arc-wave-live-showcase`:

```sh
bun add github:VanDalkvist/vanya-ui#fix/arc-wave-live-showcase
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

## Что входит

- **Действия:** `ActionButton`, `SegmentedControl`, `RangeSlider`, `ThemeToggle`.
- **Метки:** `CategoryBadge`, `Tag`, `MeshStatusBadge`, `Kbd`.
- **Карточки и детали:** `CraftCard`, `DeskSlotCard`, `EventCard`, `TimelinePreviewCard`, `InspectDrawer`, `ReceiptDigestModal`.
- **Волна и события:** `SineWave`, `EventPoint`, `TimelineEvent`, `Minimap`.
- **Графики и индикаторы:** `EnergyRadar`, `SpiderRadar`, `VoiceWaveIndicator`, `HearthPulse`.
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
bunx tsc --noEmit  # проверка типов
bun run sync      # справочник токенов и реестр экспортов
bun run build     # production-сборка витрины в dist/
```

Сборщик — Vite 8, тесты — Vitest 5. `/` и `/showcase.html` используют одну React-точку входа. `bun run build` собирает обе HTML-страницы, а не дистрибутив библиотеки. Cloudflare-конфигурация хранится отдельно, в приватном репозитории деплоя.

Для работы с агентами есть [`llms.txt`](llms.txt) и [`registry.json`](registry.json); они генерируются из реальных токенов и экспортов.

## Лицензия и авторство

[MIT](LICENSE). Copyright © 2026 [Ваня Афанасов](https://vanya-arc.dev/).

При копировании и распространении кода или его существенных частей сохраняются имя автора, copyright и текст лицензии. Отдельная обязательная ссылка в интерфейсе в MIT не добавлена.
