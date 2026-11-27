import React from "react";
import {afterEach,describe,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen,within} from "@testing-library/react";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {ActionButton,ActionLink,AvatarLink,Disclosure,EventCard,LinkChip,NavLinks,SegmentedControl,ThemeToggle} from "../src";
import {ShowcaseHeader} from "../src/showcase/ShowcaseHeader";

const read=(file:string)=>readFileSync(resolve(import.meta.dirname,"..",file),"utf8");
afterEach(()=>{cleanup();window.localStorage.removeItem("vanya_theme")});

describe("interaction feedback contracts",()=>{
 it("keeps hover as pointer-only enhancement and focus as its own state",()=>{
  const css=read("src/tokens.css");
  expect(css).toContain("--ui-feedback-hover-fill");
  expect(css).toContain("@layer utilities {\n  .ui-feedback-icon");
  expect(css).toContain("@media(forced-colors:active)");
  expect(css).toContain("@media (hover:hover) and (pointer:fine)");
  expect(css).toContain(".ui-feedback-icon:not(:disabled)");
  expect(css).toContain("outline:2px solid var(--accent)");
  expect(css).toContain(".ui-feedback-nav:is([aria-current],[aria-pressed=\"true\"])");
  expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  expect(css).toContain(".ui-feedback-row[aria-checked=\"true\"]");
 });
 it("keeps button and filter borders stable on hover; reserves outline for keyboard focus",()=>{
  const css=read("src/tokens.css");
  const outlined=css.match(/\.ui-action-button:not\(\[data-variant="prominent"\]\):not\(:disabled\):not\(\[aria-disabled="true"\]\):hover\s*\{([^}]+)\}/)?.[1];
  const filter=css.match(/\.ui-filter-select-trigger:not\(:disabled\):hover\s*\{([^}]+)\}/)?.[1];
  expect(outlined).toContain("background:var(--ui-feedback-hover-fill)");
  expect(outlined).not.toContain("border-color");
  expect(filter).toContain("background:var(--ui-feedback-hover-fill)");
  expect(filter).not.toContain("border-color");
  const focus=css.match(/\.ui-filter-select-trigger:focus-visible\s*\{([^}]+)\}/)?.[1];
  expect(focus).toContain("outline:2px solid var(--accent)");
  expect(focus).not.toContain("border-color");
  const expanded=css.match(/\.ui-filter-select\[data-expanded\] \.ui-filter-select-trigger\s*\{([^}]+)\}/)?.[1];
  expect(expanded).toContain("background:var(--ui-feedback-hover-fill)");
 });
 it("preserves real link and button behavior, disabled actions do not fire",()=>{
  const handle=vi.fn();
  render(<>
   <ActionLink href="/reference/interaction-states.md" variant="text">Правила</ActionLink>
   <ActionButton variant="text" onClick={handle}>Сохранить</ActionButton>
   <ActionButton variant="text" onClick={handle} disabled>Недоступно</ActionButton>
   <LinkChip url="https://example.com" label="Источник"/>
  </>);
  const link=screen.getByRole("link",{name:"Правила"});
  expect(link).toHaveClass("ui-feedback-text");
  expect(link).toHaveAttribute("data-variant","text");
  const save=screen.getByRole("button",{name:"Сохранить"});
  expect(save).toHaveClass("ui-feedback-text");
  expect(save).toHaveAttribute("data-variant","text");
  fireEvent.click(save);
  fireEvent.click(screen.getByRole("button",{name:"Недоступно"}));
  expect(handle).toHaveBeenCalledTimes(1);
  const source=screen.getByRole("link",{name:/Источник/});
  expect(source).toHaveClass("ui-link-source");
  expect(source.querySelector("span:nth-child(2)")).not.toHaveClass("hover:text-ink");
 });
 it("preserves selected navigation and filters independently of hover",()=>{
  const onSelect=vi.fn();
  render(<>
   <NavLinks items={[{id:"a",label:"Сейчас",href:"#a",isActive:true},{id:"b",label:"История",href:"#b"}]}/>
   <SegmentedControl semantics="filters" aria-label="Пример фильтра" items={[{id:"all",label:"Все"},{id:"mine",label:"Мои"}]} value="all" onChange={onSelect}/>
  </>);
  const current=screen.getByRole("link",{name:"Сейчас"});
  expect(current).toHaveAttribute("aria-current","location");
  expect(current).toHaveClass("ui-feedback-nav");
  const selected=screen.getByRole("button",{name:"Все"});
  expect(selected).toHaveAttribute("aria-pressed","true");
  expect(selected).toHaveClass("ui-feedback-segment");
  fireEvent.click(screen.getByRole("button",{name:"Мои"}));
  expect(onSelect).toHaveBeenCalledWith("mine");
 });
 it("does not scale avatar links or introduce layout movement during hover",()=>{
  render(<AvatarLink href="https://example.com" src="/avatar.png" alt="Профиль"/>);
  const link=screen.getByRole("link",{name:"Профиль"});
  expect(link).toHaveClass("ui-feedback-avatar");
  expect(link.className).not.toContain("hover:scale");
  expect(link.className).not.toContain("hover:shadow");
 });
 it("uses the shared feedback on disclosure and close actions",()=>{
  render(<>
   <Disclosure summary="Детали">Дополнительно</Disclosure>
   <EventCard date="2026" title="Тест" description="Пример" links={[]} tags={[]} onClose={()=>{}}/>
  </>);
  const summary=screen.getByText("Детали").closest("summary");
  expect(summary).toHaveClass("ui-feedback-row");
  const close=screen.getByRole("button",{name:"Закрыть"});
  expect(close).toHaveClass("ui-feedback-nav");
 });
 it("uses one native disclosure anatomy for explanation and provenance",()=>{
  render(<><Disclosure summary="Пояснение" open><p>Текст пояснения</p></Disclosure><Disclosure summary="Источник"><p>Текст источника</p></Disclosure></>);
  const first=screen.getByText("Пояснение").closest("details")!;
  const second=screen.getByText("Источник").closest("details")!;
  for(const details of [first,second]){
   expect(details).toHaveClass("ui-disclosure");
   expect(details.querySelector(":scope > summary")).toHaveClass("ui-feedback-row");
   expect(details.querySelector(":scope > .ui-disclosure-content")).not.toBeNull();
  }
  expect(first.open).toBe(true);expect(second.open).toBe(false);
  expect(first).toHaveTextContent("Текст пояснения");expect(second).toHaveTextContent("Текст источника");
 });
 it("retains native disclosure state across rerenders and applies an explicitly changed open attribute",()=>{
  const view=render(<Disclosure summary="Детали" open={false}>Первый текст</Disclosure>);
  const details=screen.getByText("Детали").closest("details")!;
  expect(details.open).toBe(false);
  details.open=true; // Native user toggle is exercised in the compiled-browser suite.
  view.rerender(<Disclosure summary="Детали" open={false}>Новый текст</Disclosure>);
  expect(details.open).toBe(true);
  expect(details).toHaveTextContent("Новый текст");
  view.rerender(<Disclosure summary="Детали" open>Новый текст</Disclosure>);
  view.rerender(<Disclosure summary="Детали" open={false}>Новый текст</Disclosure>);
  expect(details.open).toBe(false);
  view.rerender(<Disclosure summary="Детали" open>Новый текст</Disclosure>);
  expect(details.open).toBe(true);
 });
 it("keeps GitHub glyph smaller than its stable hit target",()=>{
  render(<ShowcaseHeader/>);
  const link=screen.getByRole("link",{name:/GitHub — исходники Vanya UI/});
  expect(link).toHaveClass("ui-feedback-icon");
  expect(link.querySelector("svg")).toHaveAttribute("width","14");
  expect(link.querySelector("svg")).toHaveAttribute("height","14");
  expect(read("src/showcase/showcase.css")).toContain(".showcase-github { display:inline-grid; place-items:center; flex:none; width:32px; height:32px;");
 });
 it("gives theme menu an accessible selected state, arrow navigation and Escape focus return",()=>{
  render(<ThemeToggle/>);
  const trigger=screen.getByRole("button",{name:/Тема оформления:/});
  expect(trigger).toHaveClass("ui-feedback-icon");
  expect(trigger).toHaveAttribute("aria-haspopup","menu");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded","true");
  const menu=screen.getByRole("menu");
  const selected=within(menu).getByRole("menuitemradio",{name:"Системная"});
  expect(selected).toHaveAttribute("aria-checked","true");
  expect(selected).toHaveFocus();
  fireEvent.keyDown(menu,{key:"ArrowUp"});
  expect(within(menu).getByRole("menuitemradio",{name:"Тёмная"})).toHaveFocus();
  fireEvent.keyDown(menu,{key:"Escape"});
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
 });
});
