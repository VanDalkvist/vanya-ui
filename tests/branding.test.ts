import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { publishedDocuments } from "../scripts/markdown-publication.mjs";
const read=(path:string)=>readFileSync(resolve(import.meta.dirname,"..",path),"utf8");
const brand="Vanya Arc / UI";
describe("master brand and product identity",()=>{
 it("uses the canonical name in public design, app metadata and logo",()=>{
   expect(read("DESIGN.md").split("\n")[0]).toBe("# "+brand);
   expect(read("README.md").split("\n")[0]).toBe("# "+brand);
   expect(JSON.parse(read("package.json")).description).toContain(brand);
   expect(read("src/showcase/ShowcaseHeader.tsx")).toContain('<VanyaArcLockup product="UI"');
   for(const file of ["index.html","showcase.html"]){
     expect(read(file)).toContain("<title>"+brand+" — дизайн-система</title>");
     expect(read(file)).toContain('href="/vanya-arc-mark.svg"');
   }
 });
 it("routes the canonical LLM index to the authored identity guide",()=>{
   const index=read("llms.txt");
   expect(index.split("\n")[0]).toBe("# @vanya/ui — "+brand);
   expect(index).toContain("/reference/identity.md");
   expect(publishedDocuments["docs/identity/brand.md"]).toBe("reference/identity.md");
   expect(read("docs/identity/brand.md").trim()).not.toBe("");
   // Generated index/corpus equality is checked by check-llm-publication after sync.
 });
});
