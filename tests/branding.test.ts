import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
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
 it("keeps curated and generated LLM references aligned",()=>{
   for(const file of ["llms.txt","public/llms.txt"]){
     expect(read(file).split("\n")[0]).toBe("# @vanya/ui — "+brand);
     expect(read(file)).toContain("/reference/identity.md");
   }
   expect(read("scripts/sync.ts")).toContain("# @vanya/ui — "+brand);
   expect(read("scripts/sync.ts")).toContain("docs/identity/brand.md");
 });
});
