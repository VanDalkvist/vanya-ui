import React from "react";

const skillItems = [
  { name: "promo", purpose: "Первый экран и объяснение продукта", link: "https://github.com/N1arko/redaktura-skills/tree/main/promo" },
  { name: "ux-copy", purpose: "Кнопки, поля, ошибки, состояния", link: "https://github.com/N1arko/redaktura-skills/tree/main/ux-copy" },
  { name: "redaktura", purpose: "Смысл, факты, структура и ритм", link: "https://github.com/N1arko/redaktura-skills/tree/main/redaktura" },
  { name: "redpolitika", purpose: "Общий голос и словарь проекта", link: "https://github.com/N1arko/redaktura-skills/tree/main/redpolitika" },
] as const;

export function WritingSection() {
  return <section id="writing" className="catalog writing-section" aria-labelledby="writing-title">
    <p className="guide-eyebrow">Тексты / 04</p>
    <h2 id="writing-title" className="catalog-title">Тексты интерфейса</h2>
    <p className="catalog-intro">Интерфейсный текст нужен там, где без него непонятны действие или результат. Подробные инструкции к очевидным элементам только отвлекают.</p>
    <div className="writing-example">
      <div><span className="type-demo-label">Лишнее</span><p>«Нажми на точку… Подвинь ползунок…»</p><small>Инструкция к демонстрации повторяет то, что уже видно на экране.</small></div>
      <div><span className="type-demo-label">На первом экране</span><p>Готовые компоненты для рабочих интерфейсов.</p><small>Заголовок называет продукт. Демо работает само, ссылка ведёт к каталогу.</small></div>
    </div>
    <div className="writing-principles">
      <article><h3>Сценарий раньше формулировки</h3><p>Прежде чем писать кнопку, выясни, что человек делает сейчас и что изменится после нажатия.</p></article>
      <article><h3>Глагол на кнопке</h3><p>«Открыть детали» говорит о действии. «Подробнее» оставляй лишь там, где содержание очевидно из контекста.</p></article>
      <article><h3>Факты вместо оценок</h3><p>Пиши, что компонент умеет: открывает панель, меняет тему, сохраняет URL. Не называй его «лучшим» или «интуитивным» без проверки.</p></article>
      <article><h3>Длинное — по запросу</h3><p>Сначала результат и следующий шаг. Условия, ограничения и справку размещай рядом или в раскрываемом блоке.</p></article>
    </div>
    <h3 className="writing-subtitle">Сначала полезное действие, потом текст</h3>
    <p className="ui-type-body">По <a href="https://bureau.ru/books/pishi/190" target="_blank" rel="noopener noreferrer">Максиму Ильяхову и Людмиле Сарычевой</a> текст проверяют вопросом, зачем читателю его читать. Если объяснение дублирует видимый интерфейс и не помогает принять решение, его лучше убрать. Это не правило «всё сокращать»: важные условия и последствия действий оставляем.</p>
    <p className="ui-type-body">Источники: <a href="https://bureau.ru/books/pishi/190" target="_blank" rel="noopener noreferrer">«Пиши, сокращай — 2025», полезное действие</a>; <a href="https://bureau.ru/books/pishi/243" target="_blank" rel="noopener noreferrer">структура и внимание читателя</a>; <a href="https://glvrd.ru/about/" target="_blank" rel="noopener noreferrer">«Главред» Максима Ильяхова</a>. <a href="/reference/writing.md">Полная редполитика и применение</a>.</p>
    <h3 className="writing-subtitle">Как использовать редакторские скиллы</h3>
    <p className="ui-type-body">Для текстов Vanya UI применяем набор <a href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">redaktura-skills</a>: правила редполитики, затем скилл под конкретную задачу и финальная редактура. Скиллы помогают проверять текст, но не заменяют фактуру и проверку поведения интерфейса.</p>
    <div className="writing-skill-list">{skillItems.map(item=><div key={item.name}>
      <code>{item.name}</code><span>{item.purpose}</span><a href={item.link} target="_blank" rel="noopener noreferrer">Первоисточник</a>
    </div>)}</div>
    <p className="writing-attribution"><strong>Авторы методики и скиллов:</strong> <a href="https://gladlax.ru" target="_blank" rel="noopener noreferrer">Людмила Сарычева</a> и <a href="https://niar42.com" target="_blank" rel="noopener noreferrer">Никита Архипов</a>. <a href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">Оригинальный репозиторий</a>, лицензия <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Vanya UI использует принципы с указанием авторов, не выдаёт их за собственный метод.</p>
    <p className="catalog-intro">Для заимствований и цитат сначала проверь <a href="/reference/sources.md">источник, условия и атрибуцию</a>. Полные правила, редполитика и разбор правок: <a href="/reference/writing.md">пособие для людей и агентов</a>.</p>
  </section>;
}
