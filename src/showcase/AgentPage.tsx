import React, {useState} from "react";
import { ArrowUpRight, ArrowRight, Check, Copy, FileText, Terminal, CircleAlert } from "lucide-react";
import { ActionButton, ActionLink, GitHubIcon, SegmentedControl, SineWave, ThemeToggle, VanyaArcLockup, type ActionButtonState } from "../index";
import { ShowcaseFooter } from "./ShowcaseFooter";
import { agentPrompts, harnessTools, verifiedHarness } from "./agent-harness-data";
type Mode = keyof typeof agentPrompts;
const files = [
  {file:"DESIGN.md", role:"Каноны композиции"},
  {file:"SKILL.md", role:"Порядок работы агента"},
  {file:"tokens.css", role:"Визуальные токены"},
  {file:"src/index.ts", role:"Реальные API"},
];
const steps = [
  {title:"Adopt", detail:"Подключает пакет и конфигурацию"},
  {title:"Lint", detail:"Проверяет весь охват UI"},
  {title:"Build", detail:"Собирает продукт"},
  {title:"CSS", detail:"Проверяет артефакты сборки"},
];
const resources = [
  {title:"Quickstart", detail:"Подключение нового или существующего продукта",href:"/reference/design-harness-quickstart.md"},
  {title:"Agent Skill", detail:"Канонический порядок работы",href:"/reference/agent-skill.md"},
  {title:"CLI и приёмка", detail:"Команды и 14 критериев",href:"/reference/ui-pipeline.md"},
  {title:"Компоненты", detail:"Публичные экспорты и типы",href:"/reference/components.md"},
  {title:"Токены", detail:"Палитра, типографика и размеры",href:"/reference/tokens.md"},
  {title:"llms.txt", detail:"Машиночитаемая навигация",href:"/llms.txt"},
];
const commands = [
  {label:"До сборки", code:`node --input-type=module -e "import '@vanya/ui/lint'"`},
  {label:"После сборки", code:`node --input-type=module -e "import '@vanya/ui/check-built'"`},
];
export function AgentPage(){
  const [mode,setMode]=useState<Mode>("new");
  const [copyState,setCopyState]=useState<ActionButtonState>("idle");
  const [demoState,setDemoState]=useState<ActionButtonState>("idle");
  async function copyPrompt(){
    setCopyState("pending");
    try {await navigator.clipboard.writeText(agentPrompts[mode]);setCopyState("success")}
    catch {setCopyState("error")}
  }
  return <>
    <a href="#agent-main" className="skip-link">К содержанию</a>
    <header className="agent-page-header">
      <a className="showcase-name" href="/" aria-label="Vanya Arc / UI — главная"><VanyaArcLockup product="UI" size="md"/></a>
      <nav className="agent-page-nav" aria-label="Навигация">
        <ActionLink href="/#catalog" size="md">Компоненты</ActionLink>
        <ActionLink href="/agents/" size="md" aria-current="page" variant="accent">Агентам</ActionLink>
      </nav>
      <div className="agent-header-utilities">
        <a className="showcase-github ui-feedback-icon" href="https://github.com/VanDalkvist/vanya-ui" aria-label="Исходники Vanya UI"><GitHubIcon size={16}/></a>
        <ThemeToggle/>
      </div>
    </header>
    <main id="agent-main" className="agent-page">
      <section className="agent-hero" aria-labelledby="agent-hero-title">
        <div className="agent-hero-copy">
          <p className="ui-type-metadata agent-eyebrow">Design system / Agent mode</p>
          <h1 id="agent-hero-title" className="ui-type-display">Дизайн-система, которую агент умеет исполнять.</h1>
          <p className="ui-type-body agent-muted">Контекст, компоненты и правила качества в одном пакете. Агент подключает Vanya UI, собирает интерфейс и запускает проверки в CI.</p>
          <div className="agent-hero-actions">
            <ActionLink href="#agent-start" variant="accent" size="md">Начать работу <ArrowRight size={16} aria-hidden="true"/></ActionLink>
            <ActionLink href="/reference/design-harness-quickstart.md" size="md">Quickstart <ArrowUpRight size={14} aria-hidden="true"/></ActionLink>
          </div>
        </div>
        <figure className="agent-context" aria-labelledby="agent-context-label">
          <figcaption id="agent-context-label" className="ui-type-metadata agent-muted">01 / Контекст агента</figcaption>
          <div className="agent-context-flow">
            <div className="agent-context-files">
              {files.map(file=><div key={file.file} className="agent-file"><FileText size={18} aria-hidden="true"/><div><code className="ui-type-code">{file.file}</code><p className="ui-type-caption agent-muted">{file.role}</p></div></div>)}
            </div>
            <div className="agent-flow-arrow" aria-hidden="true"><ArrowRight size={24}/></div>
            <div className="agent-context-output">
              <Terminal size={24} aria-hidden="true"/>
              <strong className="ui-type-subheading">Coding agent</strong>
              <p className="ui-type-compact agent-muted">Контекст задачи и исходники проекта</p>
              <div className="agent-output-line"/>
              <p className="ui-type-metadata">Интерфейс · CI</p>
            </div>
          </div>
          <SineWave className="agent-harness-wave" fit zoom={4.8} horizon={0.82}/>
        </figure>
      </section>
      <section className="agent-band" aria-labelledby="agent-pipeline-title">
        <div className="agent-band-heading"><p className="ui-type-metadata agent-eyebrow">02 / Исполнение</p><h2 id="agent-pipeline-title" className="ui-type-heading">Проверяемый путь от задачи до сборки</h2><p className="ui-type-body agent-muted">Харнесс использует установленные инструменты и CI проекта. Ошибка блокирующей проверки останавливает дальнейшие шаги.</p></div>
        <ol className="agent-pipeline">
          {steps.map((step,index)=><li key={step.title}><span className="ui-type-metadata agent-muted">0{index+1}</span><strong className="ui-type-subheading">{step.title}</strong><p className="ui-type-compact agent-muted">{step.detail}</p>{index<steps.length-1&&<ArrowRight className="agent-pipeline-arrow" size={18} aria-hidden="true"/>}</li>)}
        </ol>
        <div className="agent-execution-grid">
          <div className="agent-terminal">
            <div className="agent-terminal-heading"><Terminal size={17} aria-hidden="true"/><span className="ui-type-metadata">CI / два обязательных вызова</span></div>
            {commands.map(command=><div className="agent-command" key={command.label}><p className="ui-type-caption agent-muted">{command.label}</p><pre className="ui-type-code"><code>{command.code}</code></pre></div>)}
          </div>
          <div className="agent-gates">
            <h3 className="ui-type-subheading">Инструменты качества</h3>
            <ul>{harnessTools.map(tool=><li key={tool.name}><div><strong className="ui-type-compact">{tool.name}</strong><p className="ui-type-caption agent-muted">{tool.description}</p></div><span className="ui-type-metadata agent-gate-mode">{tool.mode}</span></li>)}</ul>
          </div>
        </div>
      </section>
      <section className="agent-band agent-enforcement" aria-labelledby="agent-enforcement-title">
        <div className="agent-band-heading"><p className="ui-type-metadata agent-eyebrow">03 / Правила</p><h2 id="agent-enforcement-title" className="ui-type-heading">Правило становится исполняемой проверкой</h2><p className="ui-type-body agent-muted">Пример нарушения и исправления. Реальный Stylelint проверяет цвета в CSS. Общий компонент получает оформление из токенов.</p></div>
        <div className="agent-compare">
          <div className="agent-compare-panel">
            <p className="ui-type-metadata agent-compare-label"><CircleAlert size={17} aria-hidden="true"/> Отклонено · пример</p>
            <pre className="ui-type-code"><code>{".save {\n  color: #f123ab;\n}"}</code></pre>
            <p className="ui-type-caption agent-muted">value-type-custom-property-required-list</p>
          </div>
          <div className="agent-compare-panel">
            <p className="ui-type-metadata agent-compare-label"><Check size={17} aria-hidden="true"/> Допустимо · пример</p>
            <pre className="ui-type-code"><code>{".save {\n  color: var(--accent);\n}"}</code></pre>
            <div className="agent-demo-action"><ActionButton variant="outline" size="md" actionState={demoState} onClick={()=>setDemoState("success")}>Сохранить пример</ActionButton><p className="ui-type-caption agent-muted" aria-live="polite">{demoState==="success"?"Состояние примера: сохранено":"ActionButton · реальный компонент"}</p></div>
          </div>
        </div>
      </section>
      <section className="agent-band agent-evidence" aria-labelledby="agent-evidence-title">
        <div className="agent-band-heading"><p className="ui-type-metadata agent-eyebrow">04 / Доказательства</p><h2 id="agent-evidence-title" className="ui-type-heading">Проверено на конкретной версии</h2><p className="ui-type-body agent-muted">Снимок успешной CI-проверки {verifiedHarness.date}. Версия {verifiedHarness.version} · кандидат без релизного тега. Визуальная приёмка и evals агентов остаются открытыми.</p><ActionLink href={`https://github.com/VanDalkvist/vanya-ui/commit/${verifiedHarness.sha}`} size="md">SHA {verifiedHarness.sha.slice(0,8)} <ArrowUpRight size={14} aria-hidden="true"/></ActionLink></div>
        <dl className="agent-evidence-grid">{verifiedHarness.tests.map(test=><div key={test.name}><dt className="ui-type-compact">{test.name}</dt><dd className="ui-type-display agent-evidence-value">{test.result}</dd><p className="ui-type-caption agent-muted">{test.description}</p></div>)}</dl>
        <p className="ui-type-caption agent-muted">Impeccable: CLEAN (advisory) · Stylelint: 69 существующих замечаний витрины, 0 новых · shadcn: 0. Данные относятся к указанному SHA.</p>
      </section>
      <section id="agent-start" className="agent-band agent-start" aria-labelledby="agent-start-title">
        <div className="agent-band-heading"><p className="ui-type-metadata agent-eyebrow">05 / Подключение</p><h2 id="agent-start-title" className="ui-type-heading">Передай агенту задачу</h2><p className="ui-type-body agent-muted">Выбери сценарий и добавь описание продукта. Для существующих проектов изменение зависимостей и baseline требует согласования.</p><ActionLink href="/reference/versioning.md" size="md">Проверенный SHA и условия установки <ArrowUpRight size={14} aria-hidden="true"/></ActionLink></div>
        <div className="agent-prompt-panel">
          <SegmentedControl<Mode> aria-label="Сценарий подключения" items={[{id:"new",label:"Новый продукт"},{id:"existing",label:"Существующий"}]} value={mode} disabled={copyState==="pending"} onChange={value=>{setMode(value);setCopyState("idle")}}/>
          <pre className="ui-type-code"><code>{agentPrompts[mode]}</code></pre>
          <div className="agent-copy-actions"><ActionButton size="md" variant="outline" actionState={copyState} onClick={copyPrompt}><Copy size={16} aria-hidden="true"/>Скопировать промпт</ActionButton><span className="ui-type-caption agent-muted" aria-live="polite">{copyState==="success"?"Промпт скопирован":copyState==="error"?"Выдели и скопируй текст вручную.":""}</span></div>
        </div>
      </section>
      <section className="agent-band" aria-labelledby="agent-resources-title">
        <div className="agent-band-heading"><p className="ui-type-metadata agent-eyebrow">06 / Источники</p><h2 id="agent-resources-title" className="ui-type-heading">Вся документация из одного репозитория</h2></div>
        <ul className="agent-resources-grid">{resources.map(resource=><li key={resource.href}><ActionLink href={resource.href} size="md" variant="accent">{resource.title} <ArrowUpRight size={14} aria-hidden="true"/></ActionLink><p className="ui-type-compact agent-muted">{resource.detail}</p></li>)}</ul>
      </section>
    </main>
    <ShowcaseFooter/>
  </>;
}
