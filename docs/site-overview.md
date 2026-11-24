# Vanya Arc / UI — открытая дизайн-система

> React-компоненты, токены, композиция и нативная браузерная навигация. Основной сайт — один лонгрид. Примеры только синтетические, без приватных данных. Код — MIT; выбранные авторские исследования — CC BY 4.0; официальные знаки — отдельно.

## Агентам и LLM

- [Стабильная геометрия и композиция](https://ui.vanya-arc.dev/reference/composition.md) — измеримые правила для динамических данных.
- [Безопасность публикации](https://ui.vanya-arc.dev/reference/publication-safety.md) — границы публичных материалов.

- [Канонический скилл Vanya UI](https://ui.vanya-arc.dev/reference/agent-skill.md) — полный переносимый рабочий цикл без GitHub.
- [Локальный пайплайн](https://ui.vanya-arc.dev/reference/ui-pipeline.md) — команды `inspect`, `check`, `verify` и проверка в браузере.
- [Композиция list–detail](https://ui.vanya-arc.dev/reference/list-detail.md) — прокрутка, breadcrumbs, размеры областей и критерии приёмки.
- [Версии и обновления](https://ui.vanya-arc.dev/reference/versioning.md) — SemVer, теги, SHA и как отличать релиз от деплоя сайта.
- [Исходные экспорты компонентов](https://github.com/VanDalkvist/vanya-ui/blob/main/src/index.ts) — проверять по версии проекта, не выдумывать API.

Для шапки витрины: логотип ведёт на саму дизайн-систему; **«Ваня Афанасов ↗»** — `rel=author` ссылка на [личный сайт](https://vanya-arc.dev/), а контурная иконка GitHub — на репозиторий исходников. Общая типографика `ActionLink`; иконка `GitHubIcon` — самостоятельный экспорт библиотеки. [Обоснование и источники](https://github.com/VanDalkvist/vanya-ui/blob/main/docs/research/author-source-utility-link-2026-11-22.md).

Для воспроизводимой работы скопируй исходники дизайн-системы локально и передай агенту путь к `skills/vanya-ui/SKILL.md`. Онлайн-страницы — доступные поисковикам указатели, но не обязательная часть пайплайна.

## Путеводитель

- [Композиция](https://ui.vanya-arc.dev/#composition): открытый интерфейс и интерактивная синусоида.
- [Айдентика](https://ui.vanya-arc.dev/#identity): родительский бренд, продукт / UI, утверждённый знак, типографика и цвета.
- [Загрузка и скелетоны](https://ui.vanya-arc.dev/#loading-states): примеры и [правила](https://ui.vanya-arc.dev/reference/loading.md).
- [Типографика](https://ui.vanya-arc.dev/#typography): Manrope, JetBrains Mono, Spectral, текстовые роли и размеры.
- [Тексты](https://ui.vanya-arc.dev/#writing): примеры текста и ссылки на оригинальные скиллы.
- [Принципы](https://ui.vanya-arc.dev/#principles): устойчивые интерфейсные правила.
- [Горячие клавиши](https://ui.vanya-arc.dev/#keyboard-shortcuts): настоящие G → буква, справка ?, выключатель и дизайн подсказок.
- [Состояния взаимодействия](https://ui.vanya-arc.dev/#interaction-states) — живой стенд hover / focus / pressed / selected и [канонические правила](https://ui.vanya-arc.dev/reference/interaction-states.md).
- [Нажатие и результат](https://ui.vanya-arc.dev/#action-feedback) — проверяемый сценарий press → pending → success/error и [правила действий](https://ui.vanya-arc.dev/reference/action-feedback.md).
- [Навигация и URL](https://ui.vanya-arc.dev/#browser-navigation): адрес каждого самостоятельного ресурса, Back/Forward и реальная ссылка вместо кнопки.
- [Компоненты](https://ui.vanya-arc.dev/#catalog): примеры настоящих React-примитивов.
- [Рабочие поверхности](https://ui.vanya-arc.dev/#workspace): разделение списка и чтения, прокрутка, контекстные панели.
- [Подключение](https://ui.vanya-arc.dev/#setup): установка пакета.

## Айдентика

Родительский бренд называется **Vanya Arc**. Его знак — непрерывный асимметричный V → A с тёмным коротким гребнем и высоким терракотовым продолжением. Дизайн-система — продукт **Vanya Arc / UI**, где только UI акцентный. Вордмарк основан на Manrope с оптически настроенными интервалами, системная типографика интерфейсов остаётся прежней. Используй `VanyaArcMark` или `VanyaArcLockup` из пакета; подробности: [канонический брендбук](https://github.com/VanDalkvist/vanya-arc-brand/blob/c3aa7ce7672bb06932dda333ba8bc98e8290f5ae/docs/brand-guidelines.md) и [интеграция в UI](https://ui.vanya-arc.dev/reference/identity.md).

## Типографика

Используй общие CSS-роли `ui-type-display/heading/subheading/body/compact/caption/code/metadata и редакционные ui-type-editorial-heading/body` из `tokens.css`; чтение — 16px/1.65 и ширина 66ch. [Полные правила](https://ui.vanya-arc.dev/reference/typography.md).

## Тексты

На первом экране — «Готовые компоненты для рабочих интерфейсов», живая волна и ссылка в каталог. [Правила](https://ui.vanya-arc.dev/reference/writing.md) применяют сторонние скиллы `promo`, `ux-copy`, `redaktura` и `redpolitika` (авторы [Людмила Сарычева](https://gladlax.ru), [Никита Архипов](https://niar42.com), [оригинал](https://github.com/N1arko/redaktura-skills), CC BY 4.0).

## Горячие клавиши

Клавиши помогают переходить между разделами, но не заменяют ссылки. На витрине `G` → `I` открывает айдентику, `G` → `C` — компоненты, `?` — справку. В настройке справки буквенные сокращения можно отключить. `ShortcutKeys` показывает сочетания тем же стилем, что `Kbd`; ввод текста и системные команды не перехватываются.

Полная [спецификация](https://ui.vanya-arc.dev/reference/keyboard-shortcuts.md) включает стиль, доступность, список команд и тестирование.

В правой части шапки — лаконичная GitHub-ссылка на исходники. Плавающая кнопка справки убрана, чтобы не перекрывать управление расстоянием. Справка открывается через `?` или кнопку в разделе «Принципы → Клавиши»; выключатель команд сохранён.

## Принципы

1. Каждая полноценная страница имеет прямой URL. Разделы одного документа используют фрагменты `#...`. Браузерные Back, Forward и открытие ссылки в новой вкладке работают.
2. В рабочих приложениях задача важнее большого вступления. Используй компактную постоянную навигацию.
3. Не вкладывай вертикальные скроллы. Две соседние области с явными владельцами разрешены на больших экранах.
4. Компоненты и токены переиспользуются из `@vanya/ui`; стили и семантику не дублируют в каждом приложении.
5. При смене фильтра, загрузке и ошибках сохраняй положение защищаемых элементов; проверяй фактические координаты. На узких экранах используй прокрутку страницы.
6. Буквенные клавиши — только как необязательное ускорение: покажи справку, сохрани обычную навигацию, дай выключить и не перехватывай команды браузера.
7. Публичный сайт и репозиторий не содержат секретов, приватных ссылок или внутренних данных.

## Подключение

~~~sh
bun add 'https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/<verified-40-char-commit-sha>'
~~~

~~~tsx
import { ActionButton, NavLinks, WorkspaceSplit } from "@vanya/ui";
import "@vanya/ui/tokens.css";
~~~

## Источники и цитирование

[Правила указания источников](https://ui.vanya-arc.dev/reference/sources.md): автор, название, точная ссылка, подтверждаемое утверждение и условия использования. Ссылка на внешнее руководство не является разрешением копировать его текст, изображения или товарные знаки. Источники книги Ильяхова/Сарычевой — ссылки для критического разбора, не CC BY; отдельные redaktura-skills имеют CC BY 4.0 по лицензии авторов.

## Лицензии и авторство

Исходный **код** проекта лицензирован под [MIT](https://ui.vanya-arc.dev/LICENSE.txt); автор — Ваня Афанасов, 2026. Сторонние инструменты и материалы сохраняют собственные лицензии: React/clsx/tailwind-merge (MIT), Lucide (ISC, включая MIT для части Feather-иконок), Manrope/Spectral/JetBrains Mono (OFL-1.1), редакторские скиллы Сарычевой/Архипова (CC BY 4.0). [Реестр и полные уведомления Lucide/Feather](https://ui.vanya-arc.dev/reference/third-party.md) · [Лицензии собранного JS и отдельные условия знака](https://ui.vanya-arc.dev/licenses.txt) · [Условия использования фирменного рисунка](https://ui.vanya-arc.dev/reference/brand-artwork-license.txt). Для текущих версий действуют [правила бренда](https://github.com/VanDalkvist/vanya-arc-brand/blob/c3aa7ce7672bb06932dda333ba8bc98e8290f5ae/BRAND.md) и [таблица лицензий](https://ui.vanya-arc.dev/reference/licensing.md); ранее выданные MIT-разрешения сохраняются.

Дополнительные источники: [компоненты](https://ui.vanya-arc.dev/reference/components.md), [навигация](https://ui.vanya-arc.dev/reference/navigation.md), [токены](https://ui.vanya-arc.dev/reference/tokens.md), [репозиторий](https://github.com/VanDalkvist/vanya-ui).
