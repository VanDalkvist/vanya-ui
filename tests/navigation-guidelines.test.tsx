import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import { Showcase } from "../src/showcase/Showcase";
import { AgentPage } from "../src/showcase/AgentPage";
import { LinkChip } from "../src";
const read=(path:string)=>readFileSync(resolve(import.meta.dirname,"..",path),"utf8");
describe("single longread navigation",()=>{
 it("keeps the old URL as a redirect to the stable anchor",()=>{
  const html=read("guidelines/navigation/index.html");
  expect(html).toContain("url=/#browser-navigation");
  expect(html).toContain('name="robots" content="noindex,follow"');
 });
 it("exposes native anchor navigation for all nine sections",()=>{
  const {container}=render(<Showcase/>);
  const headers=container.querySelectorAll<HTMLElement>("header.showcase-header");
  expect(headers).toHaveLength(1);
  const nav=within(headers[0]).getByRole("navigation",{name:"Навигация"});
  expect(within(nav).getAllByRole("link")).toHaveLength(9);
  for(const [id,label] of [["composition","Композиция"],["identity","Айдентика"],["typography","Типографика"],["writing","Тексты"],["principles","Принципы"],["catalog","Компоненты"],["workspace","Рабочие поверхности"],["setup","Подключение"],["agents","Агентам"]]){
   expect(document.getElementById(id)).not.toBeNull();
   expect(within(nav).getByRole("link",{name:label,exact:true})).toHaveAttribute("href","/#"+id);
  }
  expect(within(document.getElementById("typography")!).getByRole("heading",{name:"Типографика",level:2})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"У каждой страницы — свой адрес"})).toBeInTheDocument();
 });
});

describe("diagonal arrow matches new-tab navigation",()=>{
 for(const [name,Page] of [["showcase",Showcase],["agent page",AgentPage]] as const){
  it("opens every marked link safely in a new tab: "+name,()=>{
   const {container}=render(<Page/>);
   const marked=Array.from(container.querySelectorAll("a[href]")).filter(a=>a.textContent?.includes("↗")||a.querySelector(".lucide-arrow-up-right"));
   expect(marked.length).toBeGreaterThan(0);
   for(const link of marked){
    expect(link,link.getAttribute("href")||"").toHaveAttribute("target","_blank");
    expect(link.getAttribute("rel")?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener","noreferrer"]));
   }
   cleanup();
  });
 }
 it("keeps ordinary section navigation in the same tab and derives the chip arrow from its target",()=>{
  const {container}=render(<><Showcase/><LinkChip url="https://example.com/same" target="_self"/></>);
  expect(container.querySelector('header .showcase-nav a[href="/#composition"]')).not.toHaveAttribute("target","_blank");
  const chip=container.querySelector('a[href="https://example.com/same"]');
  expect(chip).toHaveAttribute("target","_self");
  expect(chip?.textContent).not.toContain("↗");
  cleanup();
 });
});
