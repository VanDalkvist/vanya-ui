# Загрузка, skeleton и восстановление

Нормативный паттерн Vanya Arc / UI. [Исследование и источники](../research/loading-states-2026-11-22.md) · [Живые примеры](https://ui.vanya-arc.dev/#loading-states).

## Когда что показывать

| Событие | Представление |
| --- | --- |
| Первое открытие страницы с известной структурой | Настоящая шапка + `LoadingRegion` и skeleton области результатов |
| Загрузка нового блока в открытом экране | Только skeleton этого блока, существующий контент не прячется |
| Короткая локальная операция | Доступное состояние действия (disabled/pending), а не полный skeleton |
| Результатов нет | `WorkspaceEmptyState`, не skeleton |
| Ошибка API / истёк таймаут | Сообщение об ошибке и действие восстановления; skeleton удаляется |
| Контент известен | Настоящий контент, без оставшихся placeholder |

## API компонентов

```tsx
import {Skeleton, SkeletonText, LoadingRegion, MediaCardSkeleton} from "@vanya/ui";

<LoadingRegion label="Загружаем каталог" aria-label="Каталог">
  <div className="catalogue-grid">
    {Array.from({length:5},(_,i)=><MediaCardSkeleton key={i}/>)}
  </div>
</LoadingRegion>

// Строка с обложкой/аватаром, без знаний о фильмах:
<MediaCardSkeleton layout="row"/>

// Адаптация к любой композиции:
<Skeleton shape="block" width="100%" height={180}/>
<Skeleton shape="circle" width={36} height={36}/>
<SkeletonText lines={3} widths={["95%","80%","55%"]}/>
```

`Skeleton` имеет `shape="text" | "block" | "circle"`, размеры `width` / `height`, `motion="pulse" | "none"`. Размеры по умолчанию — приблизительные; в производственном интерфейсе указывайте геометрию, соответствующую итоговому компоненту. `MediaCardSkeleton` соответствует `MediaCard` в режимах `poster` / `row`. `LoadingRegion` — только владелец доступного статуса; он не загружает данные и не управляет ошибками.

## Доступность, анимация и фокус

В `LoadingRegion` есть единственный короткий `role="status"` для скринридера и `aria-busy="true"` для обновляемой области. Прямоугольники помечены `aria-hidden`, неактивны и не участвуют в tab-order. После получения данных компонент должен **исчезнуть** из DOM, а `aria-busy` больше не должен оставаться true. Для независимых областей допустимы независимые `LoadingRegion`; не дробите одну коллекцию на десятки объявлений.

Пульсация мягкая; `prefers-reduced-motion:reduce` отключает её целиком, а `forced-colors` сохраняет различимость формы. Не использовать shimmer, который одновременно пробегает по всему списку, фейковые кнопки, фиктивный progress или повторяющиеся сообщения.

## Тексты и типографика

Заголовки показываются настоящими, когда известны заранее: `ui-type-heading`, `ui-type-subheading`. Сквозь skeleton не подставлять текст-рыбу. На загрузке единственная фраза может оставаться скрытой от зрения: «Загружаем фильмы». При ошибке — видимый заголовок «Не удалось загрузить фильмы», пояснение только при наличии фактов и кнопка «Повторить». Текст в готовом экране использует Manrope и общую типографическую шкалу; skeleton повторяет высоту настоящих строк, а не создаёт собственную шкалу текста.

## Критерии приёмки

- Начальный кадр показывает структуру страницы, без текстовой заставки.
- Картинки 2:3 и количество колонок совпадают с реальным `MediaCard`; нет горизонтального переполнения на 320px.
- Нет кликабельных placeholder и десятков status-сообщений.
- Быстрый запрос не заставляет делать искусственную задержку; медленный завершается успехом или видимой ошибкой с retry.
- Результат не объявляется «готовым», пока реально не получен.
- 200% zoom, тёмная тема и reduced motion протестированы.
- Используются общие компоненты и токены; доменное приложение не копирует CSS skeleton.

Исследовательская база: [Loading states, 2026-11-22](../research/loading-states-2026-11-22.md). Ссылка не переносит права на внешний текст.

## Initial measurement of responsive visuals

For a server-prerendered visual whose final geometry requires browser measurements, reserve its intended layout from the first frame. In scripting-enabled browsers keep provisional geometry and its interactive targets hidden until actual dimensions are available and stable. Keep surrounding text and navigation visible. Do not use an arbitrary timeout or animation to conceal an invalid frame. Preserve a useful static fallback when JavaScript is disabled. Test a cold load with intentionally delayed hydration, compare the first visible geometry against measured bounds, and exercise the final control. Existing post-load resize/interaction rules still apply.
