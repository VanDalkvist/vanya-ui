import React from "react";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {render,screen} from "@testing-library/react";
import {ActionLink,GitHubIcon,LinkChip} from "../src";

describe("Shared destination links and the independent GitHub glyph",()=>{
 it("keeps genuine anchor semantics and author relation when opening a new tab",()=>{
  render(<ActionLink href="https://vanya-arc.dev/" rel="author" target="_blank" variant="text">Ваня Афанасов</ActionLink>);
  const link=screen.getByRole("link",{name:"Ваня Афанасов"});
  expect(link).toHaveAttribute("href","https://vanya-arc.dev/");
  expect(link.getAttribute("rel")?.split(" ")).toEqual(expect.arrayContaining(["author","noopener","noreferrer"]));
  expect(link).toHaveClass("ui-feedback-text");
  const styles=readFileSync(resolve(import.meta.dirname,"../src/tokens.css"),"utf8");
  expect(styles).toContain(".ui-feedback-avatar):focus-visible");
  expect(styles).toContain("outline:2px solid var(--accent)");
 });
 it("uses the same target-derived marker for prose, utility and source links",()=>{
  render(<><ActionLink variant="prose" href="/reference/navigation.md" target="_blank">Правила навигации</ActionLink><ActionLink href="/internal">Раздел</ActionLink><LinkChip url="https://example.com" label="Источник"/></>);
  const prose=screen.getByRole("link",{name:"Правила навигации"});
  expect(prose).not.toHaveClass("ui-size");
  expect(prose.querySelector(".ui-link-tail")).toHaveTextContent("навигации");
  expect(prose.querySelector(".ui-link-tail .ui-new-tab-marker")).toHaveAttribute("aria-hidden","true");
  expect(screen.getByRole("link",{name:"Раздел"}).querySelector(".ui-new-tab-marker")).toBeNull();
  const source=screen.getByRole("link",{name:/Источник/});
  expect(source).toHaveClass("ui-action-link","ui-link-source");
  expect(source.querySelectorAll(".ui-new-tab-marker")).toHaveLength(1);
 });
 it("keeps the author link visible on compact screens instead of hiding the personal homepage",()=>{
  const css=readFileSync(resolve(import.meta.dirname,"../src/showcase/showcase.css"),"utf8");
  expect(css).not.toContain(".showcase-origin { display:none; }");
  expect(css).toContain(".showcase-author-compact { display:inline; }");
  expect(css).toContain(".showcase-author-full { display:none; }");
 });
 it("exports the legacy outline GitHub glyph as a reusable decoration",()=>{
  const {container}=render(<GitHubIcon size={17} data-testid="github-glyph" />);
  const svg=container.querySelector("svg");
  expect(svg).toHaveAttribute("width","17");
  expect(svg).toHaveAttribute("height","17");
  expect(svg).toHaveAttribute("viewBox","0 0 24 24");
  expect(svg).toHaveAttribute("fill","none");
  expect(svg).toHaveAttribute("stroke","currentColor");
  expect(svg).toHaveAttribute("aria-hidden","true");
  expect(svg?.querySelector("path")?.getAttribute("d")).toContain("M9 19c-5 1.5");
 });
});
