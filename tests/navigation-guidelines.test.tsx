import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Showcase } from "../src/showcase/Showcase";
const read=(path:string)=>readFileSync(resolve(import.meta.dirname,"..",path),"utf8");
describe("single longread navigation",()=>{
 it("keeps the old URL as a redirect to the stable anchor",()=>{
  const html=read("guidelines/navigation/index.html");
  expect(html).toContain("url=/#browser-navigation");
  expect(html).toContain('name="robots" content="noindex,follow"');
 });
 it("exposes native anchor navigation for all five sections",()=>{
  render(<Showcase/>);
  for(const [id,label] of [["composition","Композиция"],["principles","Принципы"],["catalog","Компоненты"],["workspace","Рабочие поверхности"],["setup","Подключение"]]){
   expect(document.getElementById(id)).not.toBeNull();
   expect(screen.getAllByRole("link",{name:new RegExp(label)}).some(a=>a.getAttribute("href")?.endsWith("#"+id))).toBe(true);
  }
  expect(screen.getByRole("heading",{name:"У каждой страницы — свой адрес"})).toBeInTheDocument();
 });
});
