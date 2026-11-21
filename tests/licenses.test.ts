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
 it("depends on the canonical brand package rather than local brand artwork",()=>{
   const pkg=JSON.parse(read("package.json")),lock=read("bun.lock");
   const brand=pkg.dependencies["@vanya/brand"];
   expect(brand).toMatch(/^github:VanDalkvist\/vanya-arc-brand#[a-f0-9]{40}$/);
   expect(lock).toContain(brand);
   const scope=read("LICENSING.md");
   expect(scope).toContain("CC BY 4.0");
   expect(scope).toContain("vanya-arc-brand");
   expect(read("BRAND.md")).toContain("vanya-arc-brand");
   expect(read("REUSE.toml")).not.toContain("src/brand/VanyaArcArtwork.ts");
   expect(read("src/index.ts")).toContain('from "@vanya/brand"');
   expect(read("src/tokens.css")).toContain('@import "@vanya/brand/tokens.css"');
   expect(read("scripts/sync.ts")).toContain('node_modules/@vanya/brand/assets/favicon.svg');
   expect(read("LICENSES/CC-BY-4.0.txt")).toContain("Creative Commons Attribution 4.0 International");
   for(const file of ["typography-audit-2026-11-22.md","copy-audit-2026-11-22.md","hero-shortcuts-and-copy-2026-11-21.md","ilyakhov-copy-audit-2026-11-22.md"]){
    expect(read("docs/research/"+file)).toContain("SPDX-License-Identifier: CC-BY-4.0");
   }
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
  expect(read("src/showcase/Showcase.tsx")).toContain('href="/reference/licensing.md"');
  expect(read("src/showcase/Showcase.tsx")).toContain('https://github.com/VanDalkvist/vanya-arc-brand');
  expect(read("llms.txt")).toContain("/reference/third-party.md");
  expect(read("llms.txt")).toContain("/licenses.txt");
 });
});
