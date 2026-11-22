import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ShortcutKeys } from "../index";

const rules = [
  {id:"browser-navigation", number:"01", title:"У каждой страницы — свой адрес", description:"Страницу можно открыть по прямой ссылке, сохранить и пройти назад. Переход — ссылка. Действие на месте — кнопка."},
  {id:"composition-principle", number:"02", title:"Сначала действие", description:"Покажи основную задачу сразу. Большие заголовки пусть уходят со скроллом. Постоянная панель нужна только для того, что используют часто."},
  {id:"scroll-principle", number:"03", title:"Каждой области — свой скролл", description:"Не вкладывай вертикальную прокрутку в другую. На широком экране могут прокручиваться соседние панели; на узком лучше оставить одну."},
  {id:"components-principle", number:"04", title:"Бери компоненты из библиотеки", description:"Цвета, размеры и поведение уже заданы токенами и компонентами. В продукте собирай из них нужный интерфейс, не копируй стили."},
  {id:"keyboard-shortcuts", number:"05", title:"Клавиши должны помогать", description:"Добавляй сокращения для частых действий, показывай их рядом с командой и давай отключить. Не перехватывай сочетания браузера и ввод текста."},
];

export function Guide() {
  return <section id="principles" className="catalog guide" aria-labelledby="principles-title">
    <p className="guide-eyebrow">Принципы / 05</p>
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
        {rule.id==="composition-principle" && <><a className="guide-link" href="/reference/composition.md">Примеры композиции <ArrowUpRight size={14} aria-hidden="true"/></a><a className="guide-link" href="/#composition-reading-inspector">Читающий дровер и стоимость запросов <ArrowUpRight size={14} aria-hidden="true"/></a></>}
        {rule.id==="scroll-principle" && <a className="guide-link" href="/reference/workspaces.md">Правила прокрутки <ArrowUpRight size={14} aria-hidden="true"/></a>}
        {rule.id==="components-principle" && <a className="guide-link" href="/reference/interaction-states.md">Контракт hover и focus <ArrowUpRight size={14} aria-hidden="true"/></a>}
        {rule.id==="keyboard-shortcuts" && <>
          <div className="shortcut-guide-example" aria-label="Примеры сочетаний">
            <span>Перейти к разделу <ShortcutKeys keys={["G","I"]}/></span>
            <span>Справка <ShortcutKeys keys={["?"]}/></span>
            <span>Закрыть панель <ShortcutKeys keys={["Esc"]}/></span>
          </div>
          <p>Это работающие клавиши витрины. Команды с одной буквой можно отключить в справке. Ссылки в шапке работают и без них.</p>
          <a className="guide-link" href="/reference/keyboard-shortcuts.md">Полные правила и чек-лист <ArrowUpRight size={14} aria-hidden="true"/></a>
        </>}
      </div>
    </article>)}</div>
  </section>;
}
