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
 it("offers real crawler entry points and generated Markdown sources",()=>{
  expect(read("public/robots.txt")).toContain("Sitemap: https://ui.vanya-arc.dev/sitemap.xml");
  expect(read("public/sitemap.xml")).toContain("/reference/components.md");
  expect(read("llms.txt")).toContain("/index.md");
  expect(read("scripts/sync.ts")).toContain("docs/site-overview.md");
  expect(read("scripts/prerender.tsx")).toContain("renderToString(<Showcase/>");
 });
});
