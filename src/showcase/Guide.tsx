import React from "react";
import { ArrowUpRight } from "lucide-react";
const rules=[
  {id:"browser-navigation",number:"01",title:"У каждой страницы — свой адрес",description:"Страницы, ресурсы и разделяемые представления имеют стабильные прямые URL. Back/Forward, новая вкладка, копирование и обновление сохраняют контекст. Ссылка ведёт на страницу, кнопка выполняет действие."},
  {id:"composition-principle",number:"02",title:"Задача важнее обложки",description:"В рабочих приложениях показывай нужную операцию сразу. Крупные вступления и заголовки уходят при прокрутке, а компактная продуктовая навигация остаётся. Компоненты поддерживают задачу, не отвлекают от неё."},
  {id:"scroll-principle",number:"03",title:"У прокрутки должен быть хозяин",description:"На широком экране допустимы соседние, но не вложенные вертикальные области. На узком — один вертикальный поток. Заголовки и кнопки не должны прятать контент и фокус."},
  {id:"components-principle",number:"04",title:"Один источник визуальных решений",description:"Токены и экспортируемые компоненты используются повторно, а не перерисовываются в каждом продукте. Приложения добавляют свои предметные представления и логику, но сохраняют общую систему."},
];
export function Guide(){
 return <section id="principles" className="catalog guide" aria-labelledby="principles-title">
  <p className="guide-eyebrow">Принципы / 03</p>
  <h2 id="principles-title" className="catalog-title">Как устроен интерфейс</h2>
  <p className="catalog-intro">Небольшой набор решений, которые переходят между продуктами и остаются проверяемыми.</p>
  <div className="guide-articles">{rules.map(item=><article id={item.id} className="guide-article" key={item.id}>
   <span className="guide-number">{item.number}</span>
   <div><h3>{item.title}</h3><p>{item.description}</p>
   {item.id==="browser-navigation"&&<>
    <div className="guide-paths"><span>Страница <code>/projects/example</code></span><span>Вид <code>/items?sort=new</code></span><span>Раздел лонгрида <code>/#browser-navigation</code></span></div>
    <p>Для маршрутов — нативные <code>&lt;a href&gt;</code> или Link роутера, рендерящий ссылку. Для временных локальных операций — <code>&lt;button&gt;</code>. В SPA переходы также обновляют историю браузера, заголовок, фокус и прокрутку.</p>
    <a className="guide-link" href="https://github.com/VanDalkvist/vanya-ui/blob/main/docs/patterns/browser-navigation.md" target="_blank" rel="noopener noreferrer">Подробный контракт и проверка <ArrowUpRight size={14} aria-hidden="true" /></a>
   </>}
   {item.id==="composition-principle"&&<a className="guide-link" href="https://github.com/VanDalkvist/vanya-ui/blob/main/docs/composition/working-surfaces.md" target="_blank" rel="noopener noreferrer">Исследование композиции <ArrowUpRight size={14} aria-hidden="true"/></a>}
   {item.id==="scroll-principle"&&<a className="guide-link" href="https://github.com/VanDalkvist/vanya-ui/blob/main/docs/research/workspace-scroll-composition-2026-11-21.md" target="_blank" rel="noopener noreferrer">Правила прокрутки <ArrowUpRight size={14} aria-hidden="true"/></a>}
   </div>
  </article>)}</div>
 </section>;
}
