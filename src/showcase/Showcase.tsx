import React from "react";
import { Scene } from "./Scene";
import { Guide } from "./Guide";
import { IdentitySection } from "./IdentitySection";
import { TypographySection } from "./TypographySection";
import { WritingSection } from "./WritingSection";
import { ComponentCatalog } from "./ComponentCatalog";
import { ShowcaseHeader } from "./ShowcaseHeader";
import { ShowcaseFooter } from "./ShowcaseFooter";
import { ShowcaseShortcutHelp } from "./ShowcaseShortcutHelp";
import { useShowcaseShortcuts } from "./useShowcaseShortcuts";
export function Showcase(){
 const shortcuts=useShowcaseShortcuts();
 return <>
  <a href="#principles" className="skip-link">К содержанию</a>
  <ShowcaseHeader onShowShortcuts={() => shortcuts.setHelpOpen(true)} />
  <main id="main-content">
   <Scene />
   <IdentitySection/>
   <TypographySection/>
   <WritingSection/>
   <Guide/>
   <ComponentCatalog/>
   <section id="setup" className="catalog setup" aria-labelledby="setup-title">
    <p className="guide-eyebrow">Подключение / 08</p>
    <h2 id="setup-title" className="catalog-title">Подключить библиотеку</h2>
    <p className="catalog-intro">Установи пакет из GitHub. Подключи общие стили и импортируй нужные компоненты.</p>
    <pre><code>{'bun add github:VanDalkvist/vanya-ui\n\nimport { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";'}</code></pre>
    <p className="catalog-intro">Агентам доступны <a href="/llms.txt">llms.txt</a>, <a href="/index.md">описание в Markdown</a> и <a href="/reference/components.md">список компонентов</a>.</p>
   </section>
  </main>
  {shortcuts.awaitingDestination && <div className="shortcut-pending" role="status" aria-live="polite">G → <span>выберите раздел</span></div>}
  <ShowcaseShortcutHelp open={shortcuts.helpOpen} onClose={() => shortcuts.setHelpOpen(false)} enabled={shortcuts.enabled} onEnabledChange={shortcuts.setEnabled}/>
  <ShowcaseFooter />
 </>;
}
