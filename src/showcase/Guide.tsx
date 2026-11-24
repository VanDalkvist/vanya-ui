import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ShortcutKeys } from "../index";

const rules = [
  {id:"browser-navigation", number:"01", title:"У каждой страницы — свой адрес", description:"Страницу можно открыть по прямой ссылке, сохранить и пройти назад. Переход — ссылка. Действие на месте — кнопка."},
  {id:"composition-principle", number:"02", title:"Сначала действие", description:"Покажи основную задачу сразу. Большие заголовки пусть уходят со скроллом. Постоянная панель нужна только для того, что используют часто."},
  {id:"scroll-principle", number:"03", title:"Выбирай область прокрутки", description:"На широком экране соседние панели могут прокручиваться независимо. На телефоне используй прокрутку страницы. Избегай вложенных вертикальных областей."},
  {id:"components-principle", number:"04", title:"Бери компоненты из библиотеки", description:"Цвета, размеры и поведение уже заданы токенами и компонентами. В продукте собирай из них нужный интерфейс, не копируй стили."},
  {id:"stable-workspace-geometry", number:"05", title:"Сохраняй положение элементов", description:"При смене фильтра и обновлении данных кнопки и область графика остаются на своих местах. Длинный список может прокручиваться в своей области на широком экране. На узком он продолжает страницу."},
  {id:"keyboard-shortcuts", number:"06", title:"Клавиши должны помогать", description:"Добавляй сокращения для частых действий, показывай их рядом с командой и давай отключить. Не перехватывай сочетания браузера и ввод текста."},
];

export function Guide({onShowShortcuts}:{onShowShortcuts?:()=>void} = {}) {
  return <section id="principles" className="catalog guide" aria-labelledby="principles-title">
    <p className="guide-eyebrow">Принципы / 06</p>
    <h2 id="principles-title" className="catalog-title">Как устроен интерфейс</h2>
    <p className="catalog-intro">Правила, которые действуют в каждом продукте на Vanya UI.</p>
    <div className="guide-articles">{rules.map(rule => <article id={rule.id} className="guide-article" key={rule.id}>
      <span className="guide-number">{rule.number}</span>
      <div>
        <h3>{rule.title}</h3>
        <p>{rule.description}</p>
        {rule.id==="browser-navigation" && <>
          <div className="guide-paths"><span>Страница <code>/projects/example</code></span><span>Фильтр <code>/items?sort=new</code></span><span>Раздел <code>/#browser-navigation</code></span></div>
          <p>При переходах внутри SPA обновляй историю браузера, заголовок страницы, фокус и прокрутку.</p>
          <a className="guide-link" href="/reference/navigation.md">Правила навигации <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
        {rule.id==="composition-principle" && <><a className="guide-link" href="/reference/composition.md">Примеры композиции <ArrowUpRight size={14} aria-hidden="true"/></a><a className="guide-link" href="/#composition-reading-inspector">Панель чтения и стоимость запросов <ArrowUpRight size={14} aria-hidden="true"/></a></>}
        {rule.id==="scroll-principle" && <a className="guide-link" href="/reference/workspaces.md">Правила прокрутки <ArrowUpRight size={14} aria-hidden="true"/></a>}
        {rule.id==="components-principle" && <a className="guide-link" href="/reference/interaction-states.md">Состояния элементов <ArrowUpRight size={14} aria-hidden="true"/></a>}
        {rule.id==="stable-workspace-geometry" && <>
          <a className="guide-link" href="/#composition-stable-geometry">Интерактивный пример <ArrowUpRight size={14} aria-hidden="true"/></a>
          <a className="guide-link" href="/reference/composition.md">Правила стабильного интерфейса <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
        {rule.id==="keyboard-shortcuts" && <>
          <div className="shortcut-guide-example" aria-label="Примеры сочетаний">
            <span>Перейти к разделу <ShortcutKeys keys={["G","I"]}/></span>
            {onShowShortcuts ? <button type="button" className="shortcut-guide-open ui-feedback-text" onClick={onShowShortcuts} aria-label="Настроить горячие клавиши">Справка <ShortcutKeys keys={["?"]}/></button> : <span>Справка <ShortcutKeys keys={["?"]}/></span>}
            <span>Закрыть панель <ShortcutKeys keys={["Esc"]}/></span>
          </div>
          <p>Это работающие клавиши витрины. Команды с одной буквой можно отключить в справке. Ссылки в шапке работают и без них.</p>
          <a className="guide-link" href="/reference/keyboard-shortcuts.md">Полные правила и чек-лист <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
      </div>
    </article>)}</div>
  </section>;
}
