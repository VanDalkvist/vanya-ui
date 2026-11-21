import React from "react";

/** Live specimens use published UI typography tokens. No parallel private type scale. */
const sizes = [
  { role: "Крупный заголовок", token: "--type-display-size", className: "ui-type-display", text: "Свободное пространство" },
  { role: "Заголовок раздела", token: "--type-heading-size", className: "ui-type-heading", text: "Компоненты и правила" },
  { role: "Подзаголовок", token: "--type-subheading-size", className: "ui-type-subheading", text: "Детали открываются по запросу" },
  { role: "Основной текст", token: "--type-body-size", className: "ui-type-body", text: "В рабочем интерфейсе главное действие находится на виду. Подробности можно открыть отдельно, когда они понадобятся." },
  { role: "Короткая подпись", token: "--type-compact-size", className: "ui-type-compact", text: "Выделите событие на линии, чтобы посмотреть детали." },
  { role: "Метаданные", token: "--type-caption-size", className: "ui-type-caption", text: "18 ноября 2026 · пример" },
  { role: "Код и клавиши", token: "--type-code-size", className: "ui-type-code", text: 'import { SineWave } from "@vanya/ui";' },
] as const;

export function TypographySection() {
  return <section id="typography" className="catalog typography-section" aria-labelledby="typography-title">
    <p className="guide-eyebrow">Типографика / 03</p>
    <h2 id="typography-title" className="catalog-title">Текст, который удобно читать</h2>
    <p className="catalog-intro">Manrope — для интерфейса и заголовков. JetBrains Mono — для кода и клавиш. Fraunces остаётся для отдельных редакционных материалов. Размер и интервал зависят от роли текста.</p>
    <div className="type-specimens">
      {sizes.map(item => <div className="type-specimen" key={item.token}>
        <div className="type-specimen-meta"><span>{item.role}</span><code>{item.token}</code></div>
        <p className={item.className}>{item.text}</p>
      </div>)}
    </div>
    <div className="type-reading-demo">
      <div>
        <span className="type-demo-label">Текст для чтения</span>
        <h3 className="ui-type-subheading">Когда нужна ещё одна панель</h3>
        <p className="ui-type-body">Сначала покажи человеку задачу и ближайшее действие. Длинное описание можно открыть в отдельной панели. Так рабочий экран сохраняет пространство, а подробности остаются доступными.</p>
        <p className="ui-type-body">На телефоне текст идёт одной колонкой. В длинном материале ширина строки ограничена; на широком экране строка не растягивается на всю страницу.</p>
      </div>
      <div className="type-rules-brief">
        <h3>Правила</h3>
        <p>Основной текст — 16 px с межстрочным интервалом 1,65. Плотные элементы — 14 px. Подписи — 13 px, только для короткого текста.</p>
        <p>У текста есть предельная ширина 66ch. Размеры задаются в rem, масштабирование браузера не отключается. У логотипа — своя оптическая настройка букв, которая не распространяется на абзацы.</p>
        <a href="/reference/typography.md">Токены, примеры и требования доступности</a>
      </div>
    </div>
  </section>;
}
