import React from "react";
import { Scene } from "./Scene";
import { ComponentCatalog } from "./ComponentCatalog";
import { ShowcaseHeader } from "./ShowcaseHeader";

export function Showcase() {
  return <>
    <a href="#catalog" className="skip-link">К компонентам</a>
    <ShowcaseHeader />
    <main>
      <Scene />
      <ComponentCatalog />
      <section id="setup" className="catalog setup" aria-labelledby="setup-title">
        <h2 id="setup-title" className="catalog-title">Подключение библиотеки</h2>
        <p className="catalog-intro">Подключи стили один раз в точке входа приложения.</p>
        <pre><code>{'import { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";'}</code></pre>
      </section>
    </main>
    <footer className="showcase-footer"><span>@vanya/ui · React-компоненты</span><a href="/guidelines/navigation/">Правила навигации и URL</a><a href="https://vanya-arc.dev" target="_blank" rel="noreferrer">На основе Синусоиды</a></footer>
  </>;
}
