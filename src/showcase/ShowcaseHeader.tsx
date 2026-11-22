import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { NavLinks, ThemeToggle, VanyaArcLockup } from "../index";

export const longreadSections = [
  ["composition", "Композиция"],
  ["identity", "Айдентика"],
  ["typography", "Шрифты"],
  ["writing", "Тексты"],
  ["principles", "Принципы"],
  ["catalog", "Компоненты"],
  ["workspace", "Рабочие поверхности"],
  ["setup", "Подключение"],
] as const;

/** One compact, consistent header. All sections are native fragment destinations. */
export function ShowcaseHeader() {
  return <header className="showcase-header">
    <a className="showcase-name" href="/#composition" aria-label="Vanya Arc / UI — главная"><VanyaArcLockup product="UI" size="md" /></a>
    <NavLinks items={longreadSections.map(([id, label]) => ({ id, label, href: `/#${id}` }))} className="showcase-nav">
      <a className="showcase-origin" href="https://vanya-arc.dev" target="_blank" rel="noopener noreferrer" title="Синусоида, новая вкладка">vanya-arc.dev<ExternalLink size={12} aria-hidden="true" /></a>
      <a className="showcase-github" href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub — исходники Vanya UI (новая вкладка)" title="GitHub — исходники"><Github size={18} aria-hidden="true" /></a>
      <ThemeToggle />
    </NavLinks>
  </header>;
}
