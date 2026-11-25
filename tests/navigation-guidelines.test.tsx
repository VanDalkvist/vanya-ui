import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Showcase } from "../src/showcase/Showcase";
const read=(path:string)=>readFileSync(resolve(import.meta.dirname,"..",path),"utf8");
describe("single longread navigation",()=>{
 it("keeps the old URL as a redirect to the stable anchor",()=>{
  const html=read("guidelines/navigation/index.html");
  expect(html).toContain("url=/#browser-navigation");
  expect(html).toContain('name="robots" content="noindex,follow"');
 });
 it("exposes native anchor navigation for all eight sections",()=>{
  render(<Showcase/>);
  const nav=within(screen.getByRole("banner")).getByRole("navigation",{name:"Навигация"});
  expect(within(nav).getAllByRole("link")).toHaveLength(8);
  for(const [id,label] of [["composition","Композиция"],["identity","Айдентика"],["typography","Типографика"],["writing","Тексты"],["principles","Принципы"],["catalog","Компоненты"],["workspace","Рабочие поверхности"],["setup","Подключение"]]){
   expect(document.getElementById(id)).not.toBeNull();
   expect(within(nav).getByRole("link",{name:label,exact:true})).toHaveAttribute("href","/#"+id);
  }
  expect(within(document.getElementById("typography")!).getByRole("heading",{name:"Типографика",level:2})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"У каждой страницы — свой адрес"})).toBeInTheDocument();
 });
});
