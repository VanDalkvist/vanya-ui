import React from "react";
import { NavLinks, ThemeToggle } from "../index";
import { Scene } from "./Scene";
import { ComponentCatalog } from "./ComponentCatalog";

export function Showcase() {
  return <>
    <a href="#catalog" className="skip-link">К компонентам</a>
    <header className="showcase-header">
      <a className="showcase-name" href="#composition">Hearth & Wave</a>
      <NavLinks items={[{ id: "composition", label: "Композиция" }, { id: "catalog", label: "Компоненты" }]} onSelect={(id) => document.getElementById(id)?.scrollIntoView()}>
        <ThemeToggle />
      </NavLinks>
    </header>
    <main><Scene /><ComponentCatalog /></main>
    <footer className="showcase-footer"><span>@vanya/ui · живая библиотека</span><a href="https://vanya-arc.dev" target="_blank" rel="noreferrer">Вдохновлено Синусоидой</a></footer>
  </>;
}
