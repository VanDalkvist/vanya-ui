import React from "react";
import { Scene } from "./Scene";
import { Guide } from "./Guide";
import { IdentitySection } from "./IdentitySection";
import { TypographySection } from "./TypographySection";
import { WritingSection } from "./WritingSection";
import { ComponentCatalog } from "./ComponentCatalog";
import { ShowcaseHeader } from "./ShowcaseHeader";
import { AgentSection } from "./AgentSection";
import { ShowcaseFooter } from "./ShowcaseFooter";
import { ShowcaseShortcutHelp } from "./ShowcaseShortcutHelp";
import { useShowcaseShortcuts } from "./useShowcaseShortcuts";
export function Showcase(){
 const shortcuts=useShowcaseShortcuts();
 return <>
  <a href="#principles" className="skip-link">К содержанию</a>
  <ShowcaseHeader />
  <main id="main-content">
   <Scene />
   <IdentitySection/>
   <TypographySection/>
   <WritingSection/>
   <Guide onShowShortcuts={() => shortcuts.setHelpOpen(true)}/>
   <ComponentCatalog/>
   <section id="setup" className="catalog setup" aria-labelledby="setup-title">
    <p className="guide-eyebrow">Подключение / 08</p>
    <h2 id="setup-title" className="catalog-title">Подключить библиотеку</h2>
    <p className="catalog-intro">Используй локальную копию библиотеки или закрепи конкретный коммит при установке. Подключи токены и импортируй нужные компоненты.</p>
    <pre><code>{`bun add 'github:VanDalkvist/vanya-ui#<verified-40-char-commit-sha>'\n\nimport { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";`}</code></pre>
    <p className="catalog-intro">Для агентов: <a href="/reference/agent-skill.md">канонический UI-скилл</a>, <a href="/reference/ui-pipeline.md">локальный пайплайн</a>, <a href="/llms.txt">LLM-навигация</a> и <a href="/reference/components.md">компоненты</a>.</p>
   </section>
   <AgentSection/>
  </main>
  {shortcuts.awaitingDestination && <div className="shortcut-pending" role="status" aria-live="polite">G → <span>выберите раздел</span></div>}
  <ShowcaseShortcutHelp open={shortcuts.helpOpen} onClose={() => shortcuts.setHelpOpen(false)} enabled={shortcuts.enabled} onEnabledChange={shortcuts.setEnabled}/>
  <ShowcaseFooter />
 </>;
}
