import React, { useState } from "react";
import { ChapterHeader } from "./ChapterHeader";
import { CatalogSection } from "./CatalogSection";
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
    <ChapterHeader id="typography" description="Manrope — интерфейс, JetBrains Mono — код и короткие метки, Spectral — статьи, истории и цитаты."/>
    <CatalogSection id="typography-scale" title="Размеры текста" layout="wide">
    <div className="type-specimens">
      {sizes.map(item => <div className="type-specimen" key={item.token}>
        <div className="type-specimen-meta"><span>{item.role}</span><code>{item.token}</code></div>
        <p className={item.className}>{item.text}</p>
      </div>)}
    </div>
    </CatalogSection>
    <CatalogSection id="typography-tracking" title="Межбуквенные интервалы" titleId="type-tracking-title" layout="wide">
    <div className="type-specimens">
      <div className="type-specimen">
        <div className="type-specimen-meta"><span>Обычное действие</span><code>normal</code></div>
        <div className="type-action-pair">
          <ActionButton onClick={()=>setLastAction("Открыть проект")}>Открыть проект</ActionButton>
          <ActionButton lang="en" onClick={()=>setLastAction("Open project")}>Open project</ActionButton>
        </div>
      </div>
      <div className="type-specimen">
        <div className="type-specimen-meta"><span>Действия и переходы</span><code>ActionButton / ActionLink</code></div>
        <div className="type-action-pair">
          <ActionButton variant="text" onClick={()=>setLastAction("Подробнее")}>Подробнее</ActionButton>
          <ActionButton variant="text" lang="en" onClick={()=>setLastAction("Details")}>Details</ActionButton>
          <ActionLink variant="text" href="#type-reading-title">К чтению</ActionLink>
          <ActionLink variant="text" lang="en" href="#type-reading-title">Read on</ActionLink>
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
    </CatalogSection>
    <CatalogSection id="typography-editorial" title="Редакционный текст" titleId="type-editorial-title" description="Spectral подходит для чтения и авторских материалов. Кнопки, меню и рабочие заголовки сохраняют Manrope." layout="wide">
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
      <p className="ui-type-caption">Spectral 400 — текст и курсив; 600 — заголовок. <ActionLink variant="prose" href="/reference/typography.md" target="_blank" rel="noopener noreferrer">Правила подключения и примеры кода</ActionLink></p>
    </CatalogSection>
    <CatalogSection id="typography-reading" title="Когда нужна ещё одна панель" titleId="type-reading-title" description="Текст для чтения">
      <div className="type-reading-demo">
        <p className="ui-type-body">Сначала покажи человеку задачу и ближайшее действие. Длинное описание можно открыть в отдельной панели. Так рабочий экран сохраняет пространство, а подробности остаются доступными.</p>
        <p className="ui-type-body">На телефоне текст идёт одной колонкой. На широком экране ограничивай длину строки, чтобы удобно переходить к следующей.</p>
      </div>
    </CatalogSection>
    <CatalogSection id="typography-rules" title="Правила">
      <div className="type-rules-brief">
        <p>Основной текст — 16 px с межстрочным интервалом 1,65. Плотные элементы — 14 px. Подписи — 13 px, только для короткого текста.</p>
        <p>Длина строки — до 66ch. Используй rem и сохраняй возможность масштабирования. Плотные интервалы логотипа предназначены для вордмарка.</p>
        <ActionLink variant="prose" href="/reference/typography.md" target="_blank" rel="noopener noreferrer">Токены, примеры и требования доступности</ActionLink>
      </div>
    </CatalogSection>
  </section>;
}
