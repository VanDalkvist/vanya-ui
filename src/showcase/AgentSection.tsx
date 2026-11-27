import React, { useState } from "react";
import { ChapterHeader } from "./ChapterHeader";
import { CatalogSection } from "./CatalogSection";
import { Copy } from "lucide-react";
import { ActionButton, ActionLink, type ActionButtonState } from "../index";

import { agentPrompts } from "./agent-harness-data";
export const agentPrompt = agentPrompts.new;

const resources = [
  { label:"Agent Skill", description:"Инструкция по работе с библиотекой.", href:"/reference/agent-skill.md" },
  { label:"CLI и приёмка", description:"Adopt, lint, verify, review. Критерии и доказательства.", href:"/reference/ui-pipeline.md" },
  { label:"Компоненты", description:"Список экспортируемых компонентов и исходники.", href:"/reference/components.md" },
  { label:"Токены", description:"Палитра, типографика и размеры.", href:"/reference/tokens.md" },
  { label:"LLM-индекс", description:"Короткий путеводитель по документации.", href:"/llms.txt" },
  { label:"Полная LLM-справка", description:"Правила, токены и публичный API.", href:"/llms-full.txt" },
] as const;

export function AgentSection() {
  const [copyState,setCopyState] = useState<ActionButtonState>("idle");
  async function copyPrompt() {
    setCopyState("pending");
    try {
      await navigator.clipboard.writeText(agentPrompt);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }
  return <section id="agents" className="catalog agents-section" aria-labelledby="agents-title">
    <ChapterHeader id="agents" description="Инструкции, промпты и инструменты проверок для разработки с агентом."/>
    <CatalogSection id="agents-start" title="Начать работу" description="Добавь описание продукта к промпту и передай агенту.">
      <div className="agents-start chapter-reading">
        <ActionLink href="/agents/" variant="accent" size="md" target="_blank">Открыть Agent Mode</ActionLink>
        <pre className="agents-prompt ui-type-code"><code>{agentPrompt}</code></pre>
        <div className="agents-copy-row">
          <ActionButton size="md" variant="text" actionState={copyState}
            statusLabel={copyState==="success"?"Промпт скопирован":copyState==="error"?"Не удалось скопировать промпт":"Копирование"}
            onClick={copyPrompt}><Copy size={16} aria-hidden="true"/>Скопировать промпт</ActionButton>
          <span className="agents-copy-feedback ui-type-compact">{copyState==="success"?"Промпт скопирован":copyState==="error"?"Выдели текст и скопируй вручную.":""}</span>
        </div>
      </div>
    </CatalogSection>
    <CatalogSection id="agents-readiness" title="Что доступно">
        <div className="agents-readiness chapter-reading">
          <p className="ui-type-body">Открытые исходники, локальный CLI и 14 критериев приёмки. Для исполнения нужна копия библиотеки, Node.js 20+ и браузер для визуальной проверки.</p>
          <p className="ui-type-compact agents-note">Поведенческие evals Codex и Claude Code пока не подтверждены.</p>
          <ActionLink size="md" href="/reference/versioning.md" className="agents-resource-link" target="_blank">Проверенный релиз и SHA</ActionLink>
          <ActionLink size="md" href="/reference/installation.md" className="agents-resource-link" target="_blank">Подключение пакета</ActionLink>
        </div>
    </CatalogSection>
    <CatalogSection id="agents-resources" title="Документация и инструменты">
      <div className="agents-resources chapter-reading">
        <ul className="agents-resource-list">
          {resources.map(resource=><li key={resource.href}>
            <ActionLink size="md" href={resource.href} className="agents-resource-link" target="_blank">{resource.label}</ActionLink>
            <p className="ui-type-compact agents-note">{resource.description}</p>
          </li>)}
        </ul>
      </div>
    </CatalogSection>
  </section>;
}
