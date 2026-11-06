import React from "react";
import { Divider, NavLinks, ThemeToggle } from "../index";
import { Scene } from "./Scene";
import { ComponentCatalog } from "./ComponentCatalog";

export function Showcase() {
  return <>
    <a href="#catalog" className="skip-link">К компонентам</a>
    <header className="showcase-header">
      <a className="showcase-name" href="#composition">vanya-arc/ui</a>
      <NavLinks items={[{ id: "composition", label: "Композиция" }, { id: "catalog", label: "Компоненты" }]} onSelect={(id) => document.getElementById(id)?.scrollIntoView()}>
        <a className="showcase-origin" href="https://vanya-arc.dev" target="_blank" rel="noopener noreferrer" title="Оригинальный сайт Синусоиды, новая вкладка">vanya-arc.dev</a>
        <Divider className="mx-2" />
        <ThemeToggle />
      </NavLinks>
    </header>
    <main>
      <Scene />
      <ComponentCatalog />
      <section id="setup" className="catalog setup" aria-labelledby="setup-title">
        <h2 id="setup-title" className="catalog-title">Подключение библиотеки</h2>
        <p className="catalog-intro">Подключи стили один раз в точке входа приложения.</p>
        <pre><code>{'import { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";'}</code></pre>
      </section>
    </main>
    <footer className="showcase-footer"><span>@vanya/ui · React-компоненты</span><a href="https://vanya-arc.dev" target="_blank" rel="noreferrer">На основе Синусоиды</a></footer>
  </>;
}
