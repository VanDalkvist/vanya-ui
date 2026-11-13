import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");
const brand = "Vanya-Arc/UI";

describe("design system naming", () => {
  it("uses the current name in design guidance, package description and showcase", () => {
    expect(read("DESIGN.md").split("\n")[0]).toBe(`# ${brand}`);
    expect(read("README.md").split("\n")[0]).toBe(`# ${brand}`);
    expect(JSON.parse(read("package.json")).description).toContain(brand);
    expect(read("src/showcase/Showcase.tsx")).toContain(`>${brand}</a>`);
    for (const file of ["index.html", "showcase.html"]) {
      expect(read(file)).toContain(`<title>${brand} — компоненты</title>`);
      expect(read(file)).toContain(`content="${brand}:`);
    }
  });

  it("keeps generated references aligned with the source generator", () => {
    for (const file of ["llms.txt", "public/llms.txt"]) {
      expect(read(file).split("\n")[0]).toBe(`# @vanya/ui — ${brand}`);
    }
    expect(read("scripts/sync.ts")).toContain(`# @vanya/ui — ${brand}`);
  });
});
