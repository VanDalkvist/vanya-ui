import React from "react";
import { ExternalLink } from "lucide-react";
import { Divider, NavLinks, ThemeToggle } from "../index";

export function ShowcaseHeader({ active = "showcase" }: { active?: "showcase" | "principles" }) {
  return <header className="showcase-header">
    <a className="showcase-name" href="/">Vanya-Arc/UI</a>
    <NavLinks
      items={[
        { id: "composition", label: "Композиция", href: "/#composition" },
        { id: "catalog", label: "Компоненты", href: "/#catalog" },
        { id: "principles", label: "Принципы", href: "/guidelines/navigation/", isActive: active === "principles" },
      ]}
      className="showcase-nav"
    >
      <a className="showcase-origin" href="https://vanya-arc.dev" target="_blank" rel="noopener noreferrer" title="Оригинальный сайт Синусоиды, новая вкладка">
        vanya-arc.dev<ExternalLink size={12} aria-hidden="true" />
      </a>
      <Divider className="mx-2" />
      <ThemeToggle />
    </NavLinks>
  </header>;
}
