import React from "react";
import {afterEach,describe,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen,waitFor,within} from "@testing-library/react";
import {readFileSync} from "node:fs";
import {AgentPage} from "../src/showcase/AgentPage";
import {AgentSection} from "../src/showcase/AgentSection";
import {agentPrompts,verifiedHarness} from "../src/showcase/agent-harness-data";
const originalClipboard=Object.getOwnPropertyDescriptor(navigator,"clipboard");
afterEach(()=>{cleanup();if(originalClipboard)Object.defineProperty(navigator,"clipboard",originalClipboard);else Reflect.deleteProperty(navigator,"clipboard")});
describe("independent Agent Mode page",()=>{
 it("exposes the native route and canonical quickstart",()=>{
  render(<AgentSection/>);expect(screen.getByRole("link",{name:"Открыть Agent Mode"})).toHaveAttribute("href","/agents/");
  const html=readFileSync(new URL("../agents/index.html",import.meta.url),"utf8");
  expect(html).toContain('rel="canonical" href="https://ui.vanya-arc.dev/agents/"');
  expect(html).toContain("/src/showcase/agent-main.tsx");
 });
 it("shows pinned evidence as a snapshot, both CI commands and real shared demo",()=>{
  render(<AgentPage/>);
  expect(screen.getByRole("heading",{level:1})).toHaveTextContent("Дизайн-система");
  expect(screen.getByText(/кандидат без релизного тега/)).toBeVisible();
  expect(screen.getByRole("link",{name:new RegExp(verifiedHarness.sha.slice(0,8))})).toHaveAttribute("href","https://github.com/VanDalkvist/vanya-ui/commit/"+verifiedHarness.sha);
  expect(readFileSync(new URL("../docs/versioning.md",import.meta.url),"utf8")).toContain(verifiedHarness.sha);
  expect(screen.getByText("node --input-type=module -e \"import '@vanya/ui/lint'\"")).toBeVisible();
  expect(screen.getByText("node --input-type=module -e \"import '@vanya/ui/check-built'\"")).toBeVisible();
  const button=screen.getByRole("button",{name:"Сохранить пример"});fireEvent.click(button);
  expect(button).toHaveAttribute("data-action-state","success");
 });
 it("switches the scope and copies the actual selected prompt",async()=>{
  const writeText=vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText}});
  render(<AgentPage/>);expect(screen.getByText(agentPrompts.new)).toBeVisible();
  const filter=screen.getByRole("group",{name:"Сценарий подключения"});
  fireEvent.click(within(filter).getByRole("button",{name:"Существующий"}));
  expect(screen.getByText(agentPrompts.existing)).toBeVisible();
  fireEvent.click(screen.getByRole("button",{name:"Скопировать промпт"}));
  await waitFor(()=>expect(writeText).toHaveBeenCalledExactlyOnceWith(agentPrompts.existing));
  expect(await screen.findByText("Промпт скопирован")).toBeVisible();
 });
});
