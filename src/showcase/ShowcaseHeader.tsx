import React from "react";
import { ExternalLink } from "lucide-react";
import { Divider, NavLinks, ThemeToggle, VanyaArcLockup } from "../index";

export const longreadSections = [
  ["composition", "Композиция"],
  ["identity", "Айдентика"],
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
      <Divider className="mx-2" />
      <ThemeToggle />
    </NavLinks>
  </header>;
}
