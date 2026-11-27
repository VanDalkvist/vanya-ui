import React from "react";
import { ActionLink } from "../index";
import { ChapterHeader } from "./ChapterHeader";
import { Scene } from "./Scene";
import { Guide } from "./Guide";
import { IdentitySection } from "./IdentitySection";
import { TypographySection } from "./TypographySection";
import { WritingSection } from "./WritingSection";
import { ComponentCatalog } from "./ComponentCatalog";
import { ShowcaseHeader } from "./ShowcaseHeader";
import { AgentSection } from "./AgentSection";
import { ShowcaseFooter } from "./ShowcaseFooter";
export function Showcase(){
 return <>
  <a href="#principles" className="skip-link">К содержанию</a>
  <ShowcaseHeader />
  <main id="main-content">
   <Scene />
   <IdentitySection/>
   <TypographySection/>
   <WritingSection/>
   <Guide/>
   <ComponentCatalog/>
   <section id="setup" className="catalog setup" aria-labelledby="setup-title">
    <ChapterHeader id="setup" description="Установка React-пакета по проверенному SHA или из локальной копии. Подключение токенов и компонентов."/>
    <pre><code>{`bun add 'github:VanDalkvist/vanya-ui#<verified-40-char-commit-sha>'\n\nimport { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";`}</code></pre>
    <p className="catalog-intro">Для агентов: <ActionLink variant="prose" href="/reference/agent-skill.md" target="_blank" rel="noopener noreferrer">канонический UI-скилл</ActionLink>, <ActionLink variant="prose" href="/reference/ui-pipeline.md" target="_blank" rel="noopener noreferrer">локальный пайплайн</ActionLink>, <ActionLink variant="prose" href="/llms.txt" target="_blank" rel="noopener noreferrer">LLM-навигация</ActionLink> и <ActionLink variant="prose" href="/reference/components.md" target="_blank" rel="noopener noreferrer">компоненты</ActionLink>.</p>
   </section>
   <AgentSection/>
  </main>
  <ShowcaseFooter />
 </>;
}
