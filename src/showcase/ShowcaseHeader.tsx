import React, { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
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
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const strip = headerRef.current?.querySelector<HTMLElement>(".showcase-nav [data-ui-nav-items]");
    const selected = strip?.querySelector<HTMLElement>('a[aria-current="location"]');
    if (!strip || !selected) return;
    const reveal = () => {
      const viewport = strip.getBoundingClientRect();
      const link = selected.getBoundingClientRect();
      if (link.left < viewport.left + 2) strip.scrollLeft += link.left - viewport.left - 2;
      else if (link.right > viewport.right - 2) strip.scrollLeft += link.right - viewport.right + 2;
    };
    reveal();
    window.addEventListener("resize", reveal);
    return () => window.removeEventListener("resize", reveal);
  }, [activeSection]);
  return <header ref={headerRef} className="showcase-header">
    <a className="showcase-name" href="/#composition" aria-label="Vanya Arc / UI — главная"><VanyaArcLockup product="UI" size="md" /></a>
    <NavLinks items={longreadSections.map(([id, label]) => ({ id, label, href: `/#${id}`, isActive: id === activeSection }))} className="showcase-nav"/>
    <div className="showcase-utilities">
      <ActionLink className="showcase-author-link" href="https://vanya-arc.dev/" target="_blank" rel="author"
         aria-label="Автор: Ваня Афанасов — личный сайт (новая вкладка)" size="sm" variant="text">
         <span className="showcase-author-full">Ваня Афанасов</span>
         <span className="showcase-author-compact">Автор</span>
         <ArrowUpRight size={13} aria-hidden="true" />
       </ActionLink>
      <a className="showcase-github ui-feedback-icon" href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub — исходники Vanya UI (новая вкладка)" title="GitHub — исходники"><GitHubIcon size={14} /></a>
      <ThemeToggle />
      <VersionLabel version={version}/>
    </div>
  </header>;
}
