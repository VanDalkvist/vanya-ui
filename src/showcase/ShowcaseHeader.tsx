import React from "react";
import { ActionLink, GitHubIcon, NavLinks, ThemeToggle, VanyaArcLockup, VersionLabel } from "../index";
import { version } from "../../package.json";
import { useActiveShowcaseSection } from "./useActiveShowcaseSection";

export const longreadSections = [
  ["composition", "Композиция"],
  ["identity", "Айдентика"],
  ["typography", "Типографика"],
  ["writing", "Тексты"],
  ["principles", "Принципы"],
  ["catalog", "Компоненты"],
  ["workspace", "Рабочие поверхности"],
  ["setup", "Подключение"],
  ["agents", "Агентам"],
] as const;

const SECTION_IDS = longreadSections.map(([id]) => id);

/** One compact, consistent header. Native fragments and viewport-based current state. */
export function ShowcaseHeader() {
  const activeSection = useActiveShowcaseSection(SECTION_IDS);
  return <header className="showcase-header">
    <a className="showcase-name" href="/#composition" aria-label="Vanya Arc / UI — главная"><VanyaArcLockup product="UI" size="md" /></a>
    <NavLinks items={longreadSections.map(([id, label]) => ({ id, label, href: `/#${id}`, isActive: id === activeSection }))} className="showcase-nav"/>
    <div className="showcase-utilities">
      <ActionLink className="showcase-author-link" href="https://vanya-arc.dev/" target="_blank" rel="author"
         aria-label="Автор: Ваня Афанасов — личный сайт (новая вкладка)" size="sm" variant="text">
         <span className="showcase-author-full">Ваня Афанасов</span>
         <span className="showcase-author-compact">Автор</span>
       </ActionLink>
      <a className="showcase-github ui-feedback-icon" href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub — исходники Vanya UI (новая вкладка)" title="GitHub — исходники"><GitHubIcon size={14} /></a>
      <ThemeToggle />
      <VersionLabel version={version}/>
    </div>
  </header>;
}
