import React from "react";
import { ExternalLink } from "lucide-react";
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
      <a className="showcase-github" href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub — исходники Vanya UI (новая вкладка)" title="GitHub — исходники"><svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .297a12 12 0 0 0-3.793 23.386c.6.111.82-.261.82-.577 0-.285-.011-1.039-.017-2.04-3.338.726-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.73.082-.73 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.761-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.526.117-3.176 0 0 1.008-.323 3.301 1.23.957-.266 1.983-.4 3.003-.405 1.02.005 2.047.139 3.006.405 2.291-1.553 3.297-1.23 3.297-1.23.655 1.65.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.899-.015 3.293 0 .32.216.694.825.576A12.001 12.001 0 0 0 12 .297"/></svg></a>
      <ThemeToggle />
    </NavLinks>
  </header>;
}
