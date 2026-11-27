import React from "react";
import { ArrowUp } from "lucide-react";
import { ActionLink, VanyaArcLockup } from "../index";

export function ShowcaseFooter(){
  return <footer className="showcase-footer">
    <div className="showcase-footer-main">
      <div className="showcase-footer-identity">
        <a className="showcase-footer-home" href="/#composition" aria-label="Vanya Arc / UI — к началу страницы">
          <VanyaArcLockup product="UI" size="sm" />
        </a>
        <p className="showcase-footer-note">React-компоненты и правила интерфейсов.</p>
      </div>
      <nav className="showcase-footer-links" aria-label="Ссылки проекта">
        <ActionLink href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer">Исходники</ActionLink>
        <ActionLink href="/reference/components.md" target="_blank" rel="noopener noreferrer">Документация</ActionLink>
        <ActionLink href="https://github.com/VanDalkvist/vanya-arc-brand" target="_blank" rel="noopener noreferrer">Бренд</ActionLink>
        <ActionLink href="/reference/licensing.md" target="_blank" rel="noopener noreferrer">Лицензии</ActionLink>
      </nav>
    </div>
    <div className="showcase-footer-meta">
      <span>© 2026 <ActionLink href="https://vanya-arc.dev" target="_blank" rel="noopener noreferrer">Ваня Афанасов</ActionLink></span>
      <a className="showcase-footer-to-top" href="/#composition">Наверх <ArrowUp size={13} aria-hidden="true" /></a>
    </div>
  </footer>;
}
