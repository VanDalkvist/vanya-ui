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
    <p className="catalog-intro">В Vanya UI кнопки называют действия, ошибки объясняют следующий шаг. На первом экране сами компоненты показывают, как работают.</p>
    <div className="writing-example">
      <div><span className="type-demo-label">Лишнее</span><p>«Нажми на точку… Подвинь ползунок…»</p><small>Инструкция к демонстрации повторяет то, что уже видно на экране.</small></div>
      <div><span className="type-demo-label">На первом экране</span><p>Готовые компоненты для рабочих интерфейсов.</p><small>Волна работает прямо здесь. Другие компоненты — в каталоге.</small></div>
    </div>
    <div className="writing-principles">
      <article><h3>Кнопки</h3><p>«Открыть детали» действительно открывает панель. Название действия проверяем в компоненте.</p></article>
      <article><h3>Ошибки</h3><p>Если действие не удалось, показываем причину, когда она известна, и следующий шаг.</p></article>
      <article><h3>Функции</h3><p>Описываем только проверенное в коде и тестах. Оценки и обещания не придумываем.</p></article>
      <article><h3>Подсказки</h3><p>Сочетания клавиш объясняет справка. Очевидные действия не повторяем в шапке.</p></article>
    </div>
    <h3 className="writing-subtitle">Методики — у авторов</h3>
    <p className="ui-type-body">Для работы с текстами можно открыть <a href="https://bureau.ru/books/pishi/190" target="_blank" rel="noopener noreferrer">оригинальный раздел книги Максима Ильяхова и Людмилы Сарычевой</a>. Для UX-текстов, промостраниц и редактуры — <a href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">оригинальные скиллы</a> Людмилы Сарычевой и Никиты Архипова.</p>
    <p className="ui-type-body"><a href="/reference/writing.md">Редполитика для агентов</a> содержит ссылки на конкретные главы и скиллы.</p>
    <div className="writing-skill-list">{skillItems.map(item=><div key={item.name}>
      <code>{item.name}</code><span>{item.purpose}</span><a href={item.link} target="_blank" rel="noopener noreferrer">Первоисточник</a>
    </div>)}</div>
    <p className="writing-attribution"><strong>Авторы redaktura-skills:</strong> <a href="https://gladlax.ru" target="_blank" rel="noopener noreferrer">Людмила Сарычева</a> и <a href="https://niar42.com" target="_blank" rel="noopener noreferrer">Никита Архипов</a>. <a href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">Оригинальный репозиторий</a>, лицензия <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Файлы SKILL.md здесь не копируются.</p>
    <p className="catalog-intro">Для заимствований и цитат сначала проверь <a href="/reference/sources.md">источник, условия и атрибуцию</a>. Полные правила, редполитика и разбор правок: <a href="/reference/writing.md">пособие для людей и агентов</a>.</p>
  </section>;
}
