# @vanya/ui

> Личная дизайн-система «Hearth & Wave» (Созерцательный крафтовый минимализм) для автономных сервисов и инструментов Вани Афанасова (`salon-presence`, `life-wave-narrative`, `ferma`).

## Стек и Канон
- **CSS-ядро:** Tailwind CSS v4 (`@theme inline`)
- **Дуальная цветовая модель (OKLCH):**
  - **Светлая тема (Warm Paper Archive):** фон `#f6f5f0` (`oklch(0.964)`), чернила `#181816` (`oklch(0.265)`), терракота
  - **Тёмная тема (Warm Dark Charcoal):** фон `#181816` (`oklch(0.185)`), лён `#ece4d6` (`oklch(0.930)`), янтарь `#ffb266`
- **Шрифтовая триада:**
  - `Fraunces` — для аутентичных дат, нарратива и книжных заголовков
  - `Manrope` — для интерфейсных кнопок, списков, карточек и полей
  - `JetBrains Mono` — для телеметрии, портов, метрик (строго `lowercase`)
- **Микро-радиусы:** 2px (`rounded-xs`) для кнопок, тегов и инпутов; 4px (`rounded-sm`) для карточек и панелей.

## Компоненты первого релиза

| Компонент | Назначение | Источник вдохновения |
| :--- | :--- | :--- |
| `CraftCard` | Контейнер карточки с hairline-границей и плавной сменой фона | Ферма (`DeskSlotCard`) |
| `MeshStatusBadge` | Тихая пилюля здоровья служб с микро-точкой статуса | Системный монитор спейса |
| `ActionButton` | Строгая кнопка со скруглением 2px и полными состояниями | Ферма (`button.tsx`) |
| `InspectDrawer` | Правый выдвижной ящик с backdrop-blur и закрытием по Esc | Ферма (`ProjectInspectDialog`) |
| `ReceiptDigestModal` | Модальное окно выжимки дня с книжным набором на Fraunces | Синусоида / журнал |
| `Kbd` | Клавиатурная клавиша с поддержкой активного состояния `lit` | Синусоида (`Shortcuts.tsx`) |
| `CategoryBadge` | Цветные теги категорий (`# Creative`, `# Infra`, `# Life`, `# Product`) | Ферма (`harness-colors.ts`) |
| `SegmentedControl` | Сегментированный переключатель со счетчиками (горизонты, табы) | Ферма (`DeskTopBar`) |
| `RangeSlider` | Минималистичный волосяной слайдер масштаба времени/зума | Синусоида (`ZoomControls.tsx`) |
| `HearthPulse` | Тлеющий янтарный импульс активности очага | Костёр (`hearth-flame.ts`) |
| `ThemeToggle` | Сегментированный микро-свитчер светлой и темной тем | Ферма и Синусоида |
| `useTheme` | Хук синхронизации темы с localStorage и data-theme | Ядро темы |

## Использование

```tsx
import {
  CraftCard,
  Kbd,
  CategoryBadge,
  SegmentedControl,
  ThemeToggle,
  useTheme
} from "@vanya/ui";
import "@vanya/ui/tokens.css";
```
