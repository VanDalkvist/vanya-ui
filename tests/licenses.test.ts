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
 it("separates code, CC research, and official artwork without revoking historical grants",()=>{
  const brand=read("BRAND.md"), scope=read("LICENSING.md"), reuse=read("REUSE.toml");
  expect(scope).toContain("CC BY 4.0");
  expect(scope).toContain("MIT");
  expect(scope).toContain("previous");
  expect(brand).toContain("Previously released MIT");
  expect(brand).toContain("registered");
  expect(reuse).toContain("LicenseRef-VanyaArc-Brand");
  expect(reuse).toContain("CC-BY-4.0");
  const renderer=read("src/components/VanyaArcMark.tsx");
  const artwork=read("src/brand/VanyaArcArtwork.ts");
  expect(renderer).toContain('../brand/VanyaArcArtwork');
  expect(renderer).not.toContain('"M 97 293 C 125 259');
  expect(artwork).toContain('SPDX-License-Identifier: LicenseRef-VanyaArc-Brand');
  expect(artwork).toContain("M 97 293 C 125 259");
  expect(read("public/vanya-arc-mark.svg")).toContain("LicenseRef-VanyaArc-Brand");
  expect(read("LICENSES/CC-BY-4.0.txt")).toContain("Creative Commons Attribution 4.0 International");
  for(const file of ["typography-audit-2026-11-22.md","copy-audit-2026-11-22.md","hero-shortcuts-and-copy-2026-11-21.md"]){
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
  expect(read("src/showcase/Showcase.tsx")).toContain('href="/reference/third-party.md"');
  expect(read("llms.txt")).toContain("/licenses.txt");
 });
});
