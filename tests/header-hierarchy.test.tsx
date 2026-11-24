import React from "react";
import {describe,expect,it} from "vitest";
import {render,screen,within} from "@testing-library/react";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {ShowcaseHeader} from "../src/showcase/ShowcaseHeader";

const read=(file:string)=>readFileSync(resolve(import.meta.dirname,"..",file),"utf8");

describe("showcase header: product, navigation and utility hierarchy",()=>{
 it("keeps the personal site as a named author destination, not a profile avatar or account control",()=>{
  const {container}=render(<ShowcaseHeader/>);
  const header=container.querySelector("header")!;
  const author=within(header).getByRole("link",{name:/Автор: Ваня Афанасов/});
  expect(author).toHaveAttribute("href","https://vanya-arc.dev/");
  expect(author.getAttribute("rel")).toContain("author");
  expect(author).toHaveTextContent("Ваня Афанасов");
  expect(author.querySelector("img")).toBeNull();
  expect(author.querySelector("svg")).not.toBeNull(); // outbound arrow, not avatar
 });
 it("uses a single muted text tier across default section links and both right-side glyphs",()=>{
  const {container}=render(<ShowcaseHeader/>);
  const header=container.querySelector("header")!;
  const current=within(header).getByRole("link",{name:"Композиция"});
  const other=within(header).getByRole("link",{name:"Айдентика"});
  // Active location is deliberately accented; ordinary links remain in the
  // muted tier, just like the GitHub/theme icon links at rest.
  expect(current).toHaveAttribute("aria-current","location");
  expect(current).toHaveClass("text-accent");
  expect(current).not.toHaveClass("text-ink-soft/80");
  expect(other).not.toHaveAttribute("aria-current");
  expect(other).toHaveClass("text-ink-soft/80");
  const author=within(header).getByRole("link",{name:/Автор: Ваня Афанасов/});
  expect(author).toHaveClass("ui-feedback-text");
  const github=within(header).getByRole("link",{name:/GitHub — исходники Vanya UI/});
  const theme=within(header).getByRole("button",{name:/Тема оформления:/});
  expect(github).toHaveClass("ui-feedback-icon");
  expect(theme).toHaveClass("ui-feedback-icon");
  const tokens=read("src/tokens.css");
  const layout=read("src/showcase/showcase.css");
  expect(tokens).toContain("color:var(--ui-feedback-icon-ink,var(--ink-soft));");
  expect(layout).toContain("--ui-feedback-icon-ink:color-mix(in oklab,var(--ink-soft) 80%,transparent)");
  expect(layout).not.toContain(".showcase-github { color:var(--ink-soft)");
  expect(github.querySelector("svg")).toHaveAttribute("width","14");
 });
 it("keeps navigation and utilities in explicit separate layout areas",()=>{
  const {container}=render(<ShowcaseHeader/>);
  const nav=container.querySelector(".showcase-nav")!;
  const utilities=container.querySelector(".showcase-utilities")!;
  expect(nav.querySelector("[data-ui-nav-items]")).not.toBeNull();
  expect(nav.contains(utilities)).toBe(false);
  expect(within(utilities as HTMLElement).getByRole("button",{name:/Тема оформления:/})).toBeInTheDocument();
 });
 it("leaves expanded theme, focus and hover as separate feedback states",()=>{
  const css=read("src/tokens.css");
  expect(css).toContain('.ui-feedback-icon[aria-expanded="true"]');
  expect(css).toContain("color:var(--accent);background:var(--accent-soft);");
  expect(css).toContain(":focus-visible {");
  expect(css).toContain("color:var(--ink);background:var(--ui-feedback-hover-fill)");
 });
});
