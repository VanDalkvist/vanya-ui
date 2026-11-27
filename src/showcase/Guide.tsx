import React from "react";
import { ChapterHeader } from "./ChapterHeader";
import { ArrowUpRight } from "lucide-react";

const rules = [
  {id:"browser-navigation", title:"У каждой страницы — свой адрес", description:"Страницу можно открыть по прямой ссылке, сохранить и пройти назад. Переход — ссылка. Действие на месте — кнопка."},
  {id:"composition-principle", title:"Сначала действие", description:"Покажи основную задачу сразу. Большие заголовки пусть уходят со скроллом. Постоянная панель нужна только для того, что используют часто."},
  {id:"scroll-principle", title:"Выбирай область прокрутки", description:"На широком экране соседние панели могут прокручиваться независимо. На телефоне используй прокрутку страницы. Избегай вложенных вертикальных областей."},
  {id:"components-principle", title:"Бери компоненты из библиотеки", description:"Цвета, размеры и поведение уже заданы токенами и компонентами. В продукте собирай из них нужный интерфейс, не копируй стили."},
  {id:"stable-workspace-geometry", title:"Сохраняй положение элементов", description:"При смене фильтра и обновлении данных кнопки и область графика остаются на своих местах. Длинный список может прокручиваться в своей области на широком экране. На узком он продолжает страницу."},
  {id:"keyboard-shortcuts", title:"Клавиатурное управление", description:"Сохраняй управление с клавиатуры и системные сочетания. Добавляй горячие клавиши для частых действий, показывай их рядом с командой и предусмотри отключение буквенных сочетаний."},
];

export function Guide() {
  return <section id="principles" className="catalog guide" aria-labelledby="principles-title">
    <ChapterHeader id="principles" description="Навигация, расположение действий, прокрутка и поведение компонентов."/>
    <div className="guide-articles">{rules.map(rule => <article id={rule.id} className="guide-article" key={rule.id}>
      <div>
        <h3>{rule.title}</h3>
        <p>{rule.description}</p>
        {rule.id==="browser-navigation" && <>
          <div className="guide-paths"><span>Страница <code>/projects/example</code></span><span>Фильтр <code>/items?sort=new</code></span><span>Раздел <code>/#browser-navigation</code></span></div>
          <p>При переходах внутри SPA обновляй историю браузера, заголовок страницы, фокус и прокрутку.</p>
          <a className="guide-link" href="/reference/navigation.md" target="_blank" rel="noopener noreferrer">Правила навигации <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
        {rule.id==="composition-principle" && <><a className="guide-link" href="/reference/composition.md" target="_blank" rel="noopener noreferrer">Примеры композиции <ArrowUpRight size={14} aria-hidden="true"/></a><a className="guide-link" href="/#composition-reading-inspector" target="_blank" rel="noopener noreferrer">Панель чтения и стоимость запросов <ArrowUpRight size={14} aria-hidden="true"/></a></>}
        {rule.id==="scroll-principle" && <a className="guide-link" href="/reference/workspaces.md" target="_blank" rel="noopener noreferrer">Правила прокрутки <ArrowUpRight size={14} aria-hidden="true"/></a>}
        {rule.id==="components-principle" && <a className="guide-link" href="/reference/interaction-states.md" target="_blank" rel="noopener noreferrer">Состояния элементов <ArrowUpRight size={14} aria-hidden="true"/></a>}
        {rule.id==="stable-workspace-geometry" && <>
          <a className="guide-link" href="/#composition-stable-geometry" target="_blank" rel="noopener noreferrer">Интерактивный пример <ArrowUpRight size={14} aria-hidden="true"/></a>
          <a className="guide-link" href="/reference/composition.md" target="_blank" rel="noopener noreferrer">Правила стабильного интерфейса <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
        {rule.id==="keyboard-shortcuts" && <>
          <p>Витрина использует обычные ссылки. Дополнительные сочетания стоит вводить, если они экономят время в повторяемых задачах.</p>
          <a className="guide-link" href="/reference/keyboard-shortcuts.md" target="_blank" rel="noopener noreferrer">Полные правила и чек-лист <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
      </div>
    </article>)}</div>
  </section>;
}
