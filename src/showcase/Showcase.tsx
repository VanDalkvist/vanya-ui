import React from "react";
import { Scene } from "./Scene";
import { Guide } from "./Guide";
import { ComponentCatalog } from "./ComponentCatalog";
import { ShowcaseHeader, longreadSections } from "./ShowcaseHeader";
export function Showcase(){
 return <>
  <a href="#principles" className="skip-link">К содержанию</a>
  <ShowcaseHeader />
  <main id="main-content">
   <Scene />
   <nav className="reading-map catalog" aria-label="Содержание лонгрида">
    <p className="reading-map-eyebrow">Содержание</p>
    <ol>{longreadSections.map(([id,label],i)=><li key={id}>
     <a href={`#${id}`}><span>{String(i+1).padStart(2,"0")}</span>{label}<span aria-hidden="true">↗</span></a>
    </li>)}</ol>
   </nav>
   <Guide/>
   <ComponentCatalog/>
   <section id="setup" className="catalog setup" aria-labelledby="setup-title">
    <p className="guide-eyebrow">Подключение / 05</p>
    <h2 id="setup-title" className="catalog-title">Подключение библиотеки</h2>
    <p className="catalog-intro">Используй реальные компоненты, без копий стилей. Пакет устанавливается из публичного GitHub.</p>
    <pre><code>{'bun add github:VanDalkvist/vanya-ui\n\nimport { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";'}</code></pre>
    <p className="catalog-intro">Для агентов: <a href="/llms.txt">llms.txt</a>, <a href="/index.md">Markdown-версия</a>, <a href="/reference/components.md">справочник компонентов</a>.</p>
   </section>
  </main>
  <footer className="showcase-footer"><span>@vanya/ui · Компоненты и принципы</span><a href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://vanya-arc.dev" target="_blank" rel="noreferrer">На основе Синусоиды</a></footer>
 </>;
}
