import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { AgentSection, agentPrompt } from "../src/showcase/AgentSection";

const originalClipboard=Object.getOwnPropertyDescriptor(navigator,"clipboard");
afterEach(()=>{
 cleanup();
 if(originalClipboard) Object.defineProperty(navigator,"clipboard",originalClipboard);
 else Reflect.deleteProperty(navigator,"clipboard");
});
const clipboard=(writeText:ReturnType<typeof vi.fn>)=>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText}});
describe("agent-facing section",()=>{
 it("renders the canonical references and honest readiness boundary",()=>{
  render(<AgentSection/>);
  const section=screen.getByRole("region",{name:"Дизайн-система для агентов"});
  for(const [name,href] of [["Agent Skill","/reference/agent-skill.md"],["CLI и приёмка","/reference/ui-pipeline.md"],["Компоненты","/reference/components.md"],["Токены","/reference/tokens.md"],["LLM-индекс","/llms.txt"],["Полная LLM-справка","/llms-full.txt"],["Проверенный релиз и SHA","/reference/versioning.md"],["Подключение пакета","/reference/installation.md"]])expect(within(section).getByRole("link",{name})).toHaveAttribute("href",href);
  expect(within(section).getByText(/evals Codex и Claude Code пока не подтверждены/)).toBeInTheDocument();
 });
 it("copies exactly the visible prompt and reports actual success",async()=>{
  const writeText=vi.fn().mockResolvedValue(undefined);
  clipboard(writeText);render(<AgentSection/>);
  const button=screen.getByRole("button",{name:"Скопировать промпт"});
  expect(screen.getByText(agentPrompt)).toBeVisible();
  fireEvent.click(button);
  await waitFor(()=>expect(button).toHaveAttribute("data-action-state","success"));
  expect(writeText).toHaveBeenCalledExactlyOnceWith(agentPrompt);
 });
 it("reports clipboard rejection and leaves the visible prompt available",async()=>{
  clipboard(vi.fn().mockRejectedValue(new Error("denied")));
  render(<AgentSection/>);
  const button=screen.getByRole("button",{name:"Скопировать промпт"});
  fireEvent.click(button);
  await waitFor(()=>expect(button).toHaveAttribute("data-action-state","error"));
  expect(screen.getByText("Выдели текст и скопируй вручную.")).toBeVisible();
  expect(screen.getByText(agentPrompt)).toBeVisible();
 });
});
