import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe,expect,it } from "vitest";
const read=(name:string)=>readFileSync(resolve(import.meta.dirname,"..",name),"utf8");
describe("public search and agent discovery",()=>{
 it("advertises one canonical page and a markdown version",()=>{
  const html=read("index.html");
  expect(html).toContain('rel="canonical" href="https://ui.vanya-arc.dev/"');
  expect(html).toContain('rel="alternate" type="text/markdown"');
  expect(html).toContain('rel="describedby" type="text/markdown"');
  expect(html).toContain('application/ld+json');
 });
 it("does not publish the old guideline as a second indexed page",()=>{
  expect(read("guidelines/navigation/index.html")).toContain("url=/#browser-navigation");
  expect(read("showcase.html")).toContain('noindex,follow');
 });
 it("declares UTF-8 for Markdown and plain-text agent resources",()=>{
  expect(read("public/_headers")).toContain("Content-Type: text/plain; charset=utf-8");
  expect(read("public/_headers")).toContain("Content-Type: text/markdown; charset=utf-8");
  expect(read("public/_redirects")).toContain("/guidelines/navigation/ /#browser-navigation 301");
 });
 it("offers real crawler entry points and generated Markdown sources",()=>{
  expect(read("public/robots.txt")).toContain("Sitemap: https://ui.vanya-arc.dev/sitemap.xml");
  expect(read("public/sitemap.xml")).toContain("/reference/components.md");
  expect(read("public/sitemap.xml")).toContain("/reference/identity.md");
  expect(read("public/sitemap.xml")).toContain("/reference/typography.md");
  expect(read("public/sitemap.xml")).toContain("/reference/writing.md");
  expect(read("public/sitemap.xml")).toContain("/reference/keyboard-shortcuts.md");
  expect(read("llms.txt")).toContain("/reference/identity.md");
  expect(read("llms.txt")).toContain("/reference/typography.md");
  expect(read("llms.txt")).toContain("/reference/writing.md");
  expect(read("scripts/sync.ts")).toContain("docs/patterns/writing-and-editorial.md");
  expect(read("llms.txt")).toContain("/reference/keyboard-shortcuts.md");
  expect(read("llms.txt")).toContain("/reference/licensing.md");
  expect(read("llms.txt")).toContain("/reference/versioning.md");
  expect(read("public/sitemap.xml")).toContain("/reference/versioning.md");
  expect(read("scripts/sync.ts")).toContain('["docs/versioning.md","versioning.md"]');
  expect(read("llms.txt")).toContain("/reference/brand.md");
  expect(read("public/sitemap.xml")).toContain("/reference/licensing.md");
  expect(read("public/sitemap.xml")).toContain("/reference/brand.md");
  expect(read("scripts/sync.ts")).toContain('["BRAND.md","brand.md"]');
  expect(read("scripts/sync.ts")).toContain("docs/patterns/keyboard-shortcuts.md");
  expect(read("llms.txt")).toContain("/index.md");
  expect(read("scripts/sync.ts")).toContain("docs/site-overview.md");
  expect(read("scripts/prerender.tsx")).toContain("renderToString(<Showcase/>");
 });
});
