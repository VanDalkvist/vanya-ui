import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const read=(p:string)=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
describe("license compliance and published notices",()=>{
 it("keeps owner's MIT license intact and consistent with package metadata",()=>{
  const license=read("LICENSE"), pkg=JSON.parse(read("package.json"));
  expect(license).toContain("MIT License");
  expect(license).toContain("Copyright (c) 2026 Vanya Afanasov");
  expect(pkg.license).toBe("MIT");
 });
 it("records upstream Lucide ISC and inherited Feather MIT with explicit copyright",()=>{
  const notice=read("THIRD_PARTY_NOTICES.md");
  expect(notice).toContain("ISC License");
  expect(notice).toContain("Lucide Icons and Contributors");
  expect(notice).toContain("Cole Bemis");
  expect(notice).toContain("The MIT License");
  expect(notice).toContain("CC BY 4.0");
  expect(notice).toContain("Никита Архипов");
 });
 it("publishes license texts and builds a version-specific dependency inventory",()=>{
  const vite=read("vite.config.ts"), sync=read("scripts/sync.ts");
  expect(vite).toContain('license: { fileName: "licenses.txt" }');
  expect(sync).toContain('"public/LICENSE.txt"');
  expect(sync).toContain('["THIRD_PARTY_NOTICES.md","third-party.md"]');
  expect(read("src/showcase/Showcase.tsx")).toContain('href="/reference/third-party.md"');
  expect(read("llms.txt")).toContain("/licenses.txt");
 });
});
