import React from "react";
import { ChapterHeader } from "./ChapterHeader";
import { ActionLink } from "../index";

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
          <div className="guide-links"><ActionLink variant="prose" href="/reference/navigation.md" target="_blank" rel="noopener noreferrer">Правила навигации</ActionLink></div>
        </>}
        {rule.id==="composition-principle" && <><div className="guide-links"><ActionLink variant="prose" href="/reference/composition.md" target="_blank" rel="noopener noreferrer">Примеры композиции</ActionLink><ActionLink variant="prose" href="/#composition-reading-inspector" target="_blank" rel="noopener noreferrer">Панель чтения и стоимость запросов</ActionLink></div></>}
        {rule.id==="scroll-principle" && <div className="guide-links"><ActionLink variant="prose" href="/reference/workspaces.md" target="_blank" rel="noopener noreferrer">Правила прокрутки</ActionLink></div>}
        {rule.id==="components-principle" && <div className="guide-links"><ActionLink variant="prose" href="/reference/interaction-states.md" target="_blank" rel="noopener noreferrer">Состояния элементов</ActionLink></div>}
        {rule.id==="stable-workspace-geometry" && <>
          <div className="guide-links"><ActionLink variant="prose" href="/#composition-stable-geometry" target="_blank" rel="noopener noreferrer">Интерактивный пример</ActionLink><ActionLink variant="prose" href="/reference/composition.md" target="_blank" rel="noopener noreferrer">Правила стабильного интерфейса</ActionLink></div>
        </>}
        {rule.id==="keyboard-shortcuts" && <>
          <p>Витрина использует обычные ссылки. Дополнительные сочетания стоит вводить, если они экономят время в повторяемых задачах.</p>
          <div className="guide-links"><ActionLink variant="prose" href="/reference/keyboard-shortcuts.md" target="_blank" rel="noopener noreferrer">Полные правила и чек-лист</ActionLink></div>
        </>}
      </div>
    </article>)}</div>
  </section>;
}
