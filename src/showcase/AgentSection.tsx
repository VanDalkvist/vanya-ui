import React, { useState } from "react";
import { Copy, ArrowUpRight } from "lucide-react";
import { ActionButton, ActionLink, type ActionButtonState } from "../index";

export const agentPrompt = "Создай продукт на Vanya UI. Найди или получи локальную копию репозитория https://github.com/VanDalkvist/vanya-ui. Прочитай skills/vanya-ui/SKILL.md, используй scope new и пройди полный цикл реализации и приёмки.";

const resources = [
  { label:"Agent Skill", description:"Канонический сценарий работы агента.", href:"/reference/agent-skill.md" },
  { label:"CLI и приёмка", description:"Inspect, plan, check, verify, review. Критерии и доказательства.", href:"/reference/ui-pipeline.md" },
  { label:"Компоненты", description:"Реальные экспорты и ссылки на исходники.", href:"/reference/components.md" },
  { label:"Токены", description:"Палитра, типографика и размеры.", href:"/reference/tokens.md" },
  { label:"LLM-индекс", description:"Короткий путеводитель по документации.", href:"/llms.txt" },
  { label:"Полная LLM-справка", description:"Каноны, токены и экспортируемые API.", href:"/llms-full.txt" },
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
    <p className="guide-eyebrow">Агентам / 09</p>
    <h2 id="agents-title" className="catalog-title">Дизайн-система для агентов</h2>
    <p className="catalog-intro">Передай агенту задачу и скилл Vanya UI. Он сможет выбрать компоненты, применить каноны и проверить результат в браузере.</p>
    <div className="agents-columns">
      <div className="agents-start">
        <h3 className="ui-type-subheading">Начать работу</h3>
        <p className="ui-type-body">Промпт для нового продукта. Добавь описание задачи и передай его coding-агенту.</p>
        <pre className="agents-prompt ui-type-code"><code>{agentPrompt}</code></pre>
        <div className="agents-copy-row">
          <ActionButton size="lg" variant="outline" actionState={copyState}
            statusLabel={copyState==="success"?"Промпт скопирован":copyState==="error"?"Не удалось скопировать промпт":"Копирование"}
            onClick={copyPrompt}><Copy size={16} aria-hidden="true"/>Скопировать промпт</ActionButton>
          <span className="agents-copy-feedback ui-type-compact">{copyState==="success"?"Промпт скопирован":copyState==="error"?"Выдели текст и скопируй вручную.":""}</span>
        </div>
        <div className="agents-readiness">
          <h3 className="ui-type-subheading">Что доступно</h3>
          <p className="ui-type-body">Открытые исходники, локальный CLI и 14 критериев приёмки. Для исполнения нужна копия библиотеки, Node.js 20+ и браузер для визуальной проверки.</p>
          <p className="ui-type-compact agents-note">Поведенческие evals Codex и Claude Code пока не подтверждены.</p>
          <ActionLink size="lg" href="/reference/versioning.md" className="agents-resource-link">Проверенный релиз и SHA <ArrowUpRight size={14} aria-hidden="true"/></ActionLink>
          <ActionLink size="lg" href="/reference/installation.md" className="agents-resource-link">Подключение пакета <ArrowUpRight size={14} aria-hidden="true"/></ActionLink>
        </div>
      </div>
      <div className="agents-resources">
        <h3 className="ui-type-subheading">Документация и инструменты</h3>
        <ul className="agents-resource-list">
          {resources.map(resource=><li key={resource.href}>
            <ActionLink size="lg" href={resource.href} className="agents-resource-link">{resource.label}<ArrowUpRight size={14} aria-hidden="true"/></ActionLink>
            <p className="ui-type-compact agents-note">{resource.description}</p>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}
