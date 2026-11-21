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
    <h3 className="writing-subtitle">Методики — у авторов</h3>
    <p className="ui-type-body">Здесь — решения для Vanya UI, а не перепечатка редакторской методики. Если нужно глубже разобраться с текстом, открой <a href="https://bureau.ru/books/pishi/190" target="_blank" rel="noopener noreferrer">оригинальный раздел книги Максима Ильяхова и Людмилы Сарычевой</a>. Для UX-текстов, промостраниц и редактуры — <a href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">оригинальные скиллы</a> Людмилы Сарычевой и Никиты Архипова.</p>
    <p className="ui-type-body">Агент открывает подходящий источник только по задаче. Если ссылка недоступна — не имитирует прочтение и не использует локальный пересказ как оригинальные правила. <a href="/reference/writing.md">Короткая редполитика и ссылки для агентов</a>.</p>
    <div className="writing-skill-list">{skillItems.map(item=><div key={item.name}>
      <code>{item.name}</code><span>{item.purpose}</span><a href={item.link} target="_blank" rel="noopener noreferrer">Первоисточник</a>
    </div>)}</div>
    <p className="writing-attribution"><strong>Авторы методики и скиллов:</strong> <a href="https://gladlax.ru" target="_blank" rel="noopener noreferrer">Людмила Сарычева</a> и <a href="https://niar42.com" target="_blank" rel="noopener noreferrer">Никита Архипов</a>. <a href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">Оригинальный репозиторий</a>, лицензия <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. В коде Vanya UI нет копий этих SKILL.md; локальные правила относятся к нашему продукту.</p>
    <p className="catalog-intro">Для заимствований и цитат сначала проверь <a href="/reference/sources.md">источник, условия и атрибуцию</a>. Полные правила, редполитика и разбор правок: <a href="/reference/writing.md">пособие для людей и агентов</a>.</p>
  </section>;
}
