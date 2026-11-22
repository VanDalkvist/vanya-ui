import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ActionLink, GitHubIcon, NavLinks, ThemeToggle, VanyaArcLockup } from "../index";

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
      <ActionLink className="showcase-author-link" href="https://vanya-arc.dev/" target="_blank" rel="author"
         aria-label="Автор: Ваня Афанасов — личный сайт (новая вкладка)" size="sm" variant="text">
         <span className="showcase-author-full">Ваня Афанасов</span>
         <span className="showcase-author-compact">Автор</span>
         <ArrowUpRight size={13} aria-hidden="true" />
       </ActionLink>
      <a className="showcase-github" href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub — исходники Vanya UI (новая вкладка)" title="GitHub — исходники"><GitHubIcon size={17} /></a>
      <ThemeToggle />
    </NavLinks>
  </header>;
}
