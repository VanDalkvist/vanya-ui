import React, { useState } from "react";
import { ChapterHeader } from "./ChapterHeader";
import { ActionButton, ActionLink } from "../index";

/** Live specimens use published UI typography tokens. No parallel private type scale. */
const sizes = [
  { role: "Крупный заголовок", token: "--type-display-size", className: "ui-type-display", text: "Свободное пространство" },
  { role: "Заголовок раздела", token: "--type-heading-size", className: "ui-type-heading", text: "Компоненты и правила" },
  { role: "Подзаголовок", token: "--type-subheading-size", className: "ui-type-subheading", text: "Детали открываются по запросу" },
  { role: "Основной текст", token: "--type-body-size", className: "ui-type-body", text: "В рабочем интерфейсе главное действие находится на виду. Подробности можно открыть отдельно, когда они понадобятся." },
  { role: "Плотный текст", token: "--type-compact-size", className: "ui-type-compact", text: "Выбери событие на линии, чтобы открыть подробности." },
  { role: "Подпись", token: "--type-caption-size", className: "ui-type-caption", text: "18 ноября 2026 · пример" },
  { role: "Код и клавиши", token: "--type-code-size", className: "ui-type-code", text: 'import { SineWave } from "@vanya/ui";' },
] as const;

export function TypographySection() {
  const [lastAction,setLastAction]=useState("");
  return <section id="typography" className="catalog typography-section" aria-labelledby="typography-title">
    <ChapterHeader id="typography" title="Типографика" description="Manrope — интерфейс, JetBrains Mono — код и короткие метки, Spectral — статьи, истории и цитаты." index="03"/>
    <h3 className="ui-type-subheading type-section-title">Размеры текста</h3>
    <div className="type-specimens" id="typography-scale">
      {sizes.map(item => <div className="type-specimen" key={item.token}>
        <div className="type-specimen-meta"><span>{item.role}</span><code>{item.token}</code></div>
        <p className={item.className}>{item.text}</p>
      </div>)}
    </div>
    <div className="type-specimens" id="typography-tracking" aria-labelledby="type-tracking-title">
      <h3 id="type-tracking-title" className="ui-type-subheading">Межбуквенные интервалы</h3>
      <div className="type-specimen">
        <div className="type-specimen-meta"><span>Обычное действие</span><code>normal</code></div>
        <div className="type-action-pair">
          <ActionButton onClick={()=>setLastAction("Открыть проект")}>Открыть проект</ActionButton>
          <ActionButton lang="en" onClick={()=>setLastAction("Open project")}>Open project</ActionButton>
        </div>
      </div>
      <div className="type-specimen">
        <div className="type-specimen-meta"><span>Моноширинное действие</span><code>--type-tracking-action-mono</code></div>
        <div className="type-action-pair">
          <ActionButton variant="mono" onClick={()=>setLastAction("Подробнее")}>Подробнее</ActionButton>
          <ActionButton variant="mono" lang="en" onClick={()=>setLastAction("Details")}>Details</ActionButton>
          <ActionLink variant="mono" href="#type-reading-title">К чтению</ActionLink>
          <ActionLink variant="mono" lang="en" href="#type-reading-title">Read on</ActionLink>
        </div>
      </div>
      <div className="type-specimen">
        <div className="type-specimen-meta"><span>Короткие метаданные</span><code>--type-tracking-metadata</code></div>
        <div className="type-action-pair"><span className="ui-type-metadata uppercase">Ноябрь 2026</span><span className="ui-type-metadata uppercase" lang="en">November 2026</span></div>
      </div>
      <div className="type-specimen">
        <div className="type-specimen-meta"><span>Заголовок и основной текст</span><code>Manrope</code></div>
        <div><p className="ui-type-heading">Новые возможности</p><p className="ui-type-heading" lang="en">New possibilities</p><p className="ui-type-body">Выбери событие и прочитай историю.</p><p className="ui-type-body" lang="en">Choose an event and read its story.</p></div>
      </div>
      <p className="ui-type-caption" role="status">{lastAction ? "Выбрано: "+lastAction : "Выбери действие в примере."}</p>
    </div>
    <section id="typography-editorial" aria-labelledby="type-editorial-title" className="type-editorial-section">
      <h3 id="type-editorial-title" className="ui-type-subheading">Редакционный текст</h3>
      <p className="ui-type-body">Spectral подходит для чтения и авторских материалов. Кнопки, меню и рабочие заголовки сохраняют Manrope.</p>
      <div className="type-editorial-pair">
        <article lang="ru">
          <p className="ui-type-metadata">Русский · Spectral</p>
          <h4 className="ui-type-editorial-heading">Время для новых идей</h4>
          <p className="ui-type-editorial-body">Иногда полезно вернуться к заметкам и увидеть, как менялись идеи. В каждой истории остаются детали, которые помогают понять сегодняшний выбор.</p>
          <p className="ui-type-editorial-body"><em>У каждого открытия есть свой ритм.</em></p>
        </article>
        <article lang="en">
          <p className="ui-type-metadata">English · Spectral</p>
          <h4 className="ui-type-editorial-heading">Time for new ideas</h4>
          <p className="ui-type-editorial-body">Returning to our notes can reveal how ideas have changed. Every story holds details that help us understand the choices we make today.</p>
          <p className="ui-type-editorial-body"><em>Every discovery has its own rhythm.</em></p>
        </article>
      </div>
      <p className="ui-type-caption">Spectral 400 — текст и курсив; 600 — заголовок. <a href="/reference/typography.md" target="_blank" rel="noopener noreferrer">Правила подключения и примеры кода<span aria-hidden="true" className="ui-inline-new-tab-marker"> ↗</span></a></p>
    </section>
    <div className="type-reading-demo">
      <div>
        <span className="type-demo-label">Текст для чтения</span>
        <h3 id="type-reading-title" className="ui-type-subheading">Когда нужна ещё одна панель</h3>
        <p className="ui-type-body">Сначала покажи человеку задачу и ближайшее действие. Длинное описание можно открыть в отдельной панели. Так рабочий экран сохраняет пространство, а подробности остаются доступными.</p>
        <p className="ui-type-body">На телефоне текст идёт одной колонкой. На широком экране ограничивай длину строки, чтобы удобно переходить к следующей.</p>
      </div>
      <div className="type-rules-brief">
        <h3>Правила</h3>
        <p>Основной текст — 16 px с межстрочным интервалом 1,65. Плотные элементы — 14 px. Подписи — 13 px, только для короткого текста.</p>
        <p>Длина строки — до 66ch. Используй rem и сохраняй возможность масштабирования. Плотные интервалы логотипа предназначены для вордмарка.</p>
        <a href="/reference/typography.md" target="_blank" rel="noopener noreferrer">Токены, примеры и требования доступности<span aria-hidden="true" className="ui-inline-new-tab-marker"> ↗</span></a>
      </div>
    </div>
  </section>;
}
