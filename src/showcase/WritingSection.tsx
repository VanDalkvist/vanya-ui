import React from "react";
import { ActionLink } from "../index";
import { ChapterHeader } from "./ChapterHeader";

const skillItems = [
  { name: "promo", purpose: "Первый экран и объяснение продукта", link: "https://github.com/N1arko/redaktura-skills/tree/main/promo" },
  { name: "ux-copy", purpose: "Кнопки, поля, ошибки, состояния", link: "https://github.com/N1arko/redaktura-skills/tree/main/ux-copy" },
  { name: "redaktura", purpose: "Смысл, факты, структура и ритм", link: "https://github.com/N1arko/redaktura-skills/tree/main/redaktura" },
  { name: "redpolitika", purpose: "Общий голос и словарь проекта", link: "https://github.com/N1arko/redaktura-skills/tree/main/redpolitika" },
] as const;

export function WritingSection() {
  return <section id="writing" className="catalog writing-section" aria-labelledby="writing-title">
    <ChapterHeader id="writing" description="Примеры подписей кнопок, сообщений об ошибках и текстов для первого экрана."/>
    <div className="writing-example">
      <div><span className="type-demo-label">Лишнее</span><p>«Нажми на точку… Подвинь ползунок…»</p><small>Инструкция к демонстрации повторяет то, что уже видно на экране.</small></div>
      <div><span className="type-demo-label">На первом экране</span><p>Готовые компоненты для рабочих интерфейсов.</p><small>Волна работает прямо здесь. Другие компоненты — в каталоге.</small></div>
    </div>
    <div className="writing-principles">
      <article><h3>Кнопки</h3><p>«Открыть детали» действительно открывает панель. Название действия проверяем в компоненте.</p></article>
      <article><h3>Ошибки</h3><p>Если действие не удалось, показываем причину, когда она известна, и следующий шаг.</p></article>
      <article><h3>Функции</h3><p>Описываем функции, которые уже работают. Результаты проверок привязываем к конкретной версии.</p></article>
      <article><h3>Подсказки</h3><p>Если в продукте есть горячие клавиши, показываем их рядом с соответствующими командами.</p></article>
    </div>
    <h3 className="writing-subtitle">Редакторские методики</h3>
    <p className="ui-type-body">Для работы с текстами можно открыть <ActionLink variant="prose" href="https://bureau.ru/books/pishi/190" target="_blank" rel="noopener noreferrer">оригинальный раздел книги Максима Ильяхова и Людмилы Сарычевой</ActionLink>. Для UX-текстов, промостраниц и редактуры — <ActionLink variant="prose" href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">оригинальные скиллы</ActionLink> Людмилы Сарычевой и Никиты Архипова.</p>
    <p className="ui-type-body"><ActionLink variant="prose" href="/reference/writing.md" target="_blank" rel="noopener noreferrer">Редполитика для агентов</ActionLink> содержит ссылки на конкретные главы и скиллы.</p>
    <div className="writing-skill-list">{skillItems.map(item=><div key={item.name}>
      <code>{item.name}</code><span>{item.purpose}</span><ActionLink variant="prose" href={item.link} target="_blank" rel="noopener noreferrer">Первоисточник</ActionLink>
    </div>)}</div>
    <p className="writing-attribution"><strong>Авторы redaktura-skills:</strong> <ActionLink variant="prose" href="https://gladlax.ru" target="_blank" rel="noopener noreferrer">Людмила Сарычева</ActionLink> и <ActionLink variant="prose" href="https://niar42.com" target="_blank" rel="noopener noreferrer">Никита Архипов</ActionLink>. <ActionLink variant="prose" href="https://github.com/N1arko/redaktura-skills" target="_blank" rel="noopener noreferrer">Оригинальный репозиторий</ActionLink>, лицензия <ActionLink variant="prose" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</ActionLink>. Файлы SKILL.md здесь не копируются.</p>
    <p className="catalog-intro">Для заимствований и цитат сначала проверь <ActionLink variant="prose" href="/reference/sources.md" target="_blank" rel="noopener noreferrer">источник, условия и атрибуцию</ActionLink>. Полные правила, редполитика и разбор правок: <ActionLink variant="prose" href="/reference/writing.md" target="_blank" rel="noopener noreferrer">пособие для людей и агентов</ActionLink>.</p>
  </section>;
}
