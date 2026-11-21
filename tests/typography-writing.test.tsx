import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe,expect,it } from "vitest";
import { render,screen } from "@testing-library/react";
import { TypographySection } from "../src/showcase/TypographySection";
import { WritingSection } from "../src/showcase/WritingSection";
import { Scene } from "../src/showcase/Scene";
const read=(p:string)=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
describe("typography and editor guidance",()=>{
 it("uses shared type scale rather than local one-off sizes",()=>{
  const css=read("src/tokens.css");
  for(const role of ["display","heading","subheading","body","compact","caption","code"]){
   expect(css).toContain("--type-"+role+"-size:");
   expect(css).toContain(".ui-type-"+role);
  }
  expect(css).toContain("--type-body-size: 1rem;");
  expect(css).toContain("--type-reading-measure: 66ch;");
  expect(css).toContain("--size-sm-font: 12px;");
  expect(css).toContain("--size-md-font: 13px;");
 });
 it("renders seven working specimens with direct Markdown links",()=>{
  const {container}=render(<TypographySection/>);
  expect(screen.getByRole("heading",{name:"Текст, который удобно читать"})).toBeInTheDocument();
  expect(container.querySelectorAll(".type-specimen")).toHaveLength(7);
  expect(screen.getByRole("link",{name:/Токены, примеры/})).toHaveAttribute("href","/reference/typography.md");
 });
 it("credits both original authors, source and skills",()=>{
  render(<WritingSection/>);
  expect(screen.getByRole("heading",{name:"Тексты интерфейса"})).toBeInTheDocument();
  expect(screen.getByRole("link",{name:"Людмила Сарычева"})).toHaveAttribute("href","https://gladlax.ru");
  expect(screen.getByRole("link",{name:"Никита Архипов"})).toHaveAttribute("href","https://niar42.com");
  expect(screen.getByRole("link",{name:"Оригинальный репозиторий"})).toHaveAttribute("href","https://github.com/N1arko/redaktura-skills");
  expect(screen.getAllByRole("link",{name:"Первоисточник"})).toHaveLength(4);
 });
 it("revises first screen for accurate product category and action",()=>{
  render(<Scene/>);
  expect(screen.getByRole("heading",{name:"Готовые компоненты для рабочих интерфейсов."})).toBeInTheDocument();
  expect(screen.queryByText(/Нажми на точку на волне/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Подвинь ползунок/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Быстрые переходы/)).not.toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Перейти к компонентам/})).toHaveAttribute("href","/#catalog");
 });
 it("publishes norms and original credit in agent resources",()=>{
  expect(read("docs/patterns/typography.md")).toContain("WCAG");
  expect(read("docs/patterns/writing-and-editorial.md")).toContain("Никита Архипов");
  expect(read(".agents/redpolitika.md")).toContain("N1arko/redaktura-skills");
  expect(read("docs/patterns/writing-and-editorial.md")).toContain("Ильяхов");
  expect(read("docs/patterns/writing-and-editorial.md")).toContain("Если источник не открылся");
  expect(read("docs/research/ilyakhov-copy-audit-2026-11-22.md")).toContain("bureau.ru/books/pishi/190");
  expect(read("llms.txt")).toContain("/reference/typography.md");
  expect(read("llms.txt")).toContain("/reference/writing.md");
  expect(read(".agents/redpolitika.md")).toContain("не выдавай пересказ");
  expect(read("scripts/sync.ts")).toContain("fetch originals only when the task requires them");
  expect(read("llms.txt")).toContain("/reference/sources.md");
  expect(read("scripts/sync.ts")).toContain('["docs/patterns/sources-and-attribution.md","sources.md"]');
  expect(read("docs/patterns/sources-and-attribution.md")).toContain("CC BY 4.0");
  expect(read("docs/research/ilyakhov-copy-audit-2026-11-22.md")).toContain("source");
  expect(read("scripts/sync.ts")).toContain('["docs/patterns/typography.md","typography.md"]');
 });
});
