import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { renderTokenReference } from "../scripts/token-reference";

describe("CSS-derived agent reference", () => {
  it("documents each theme from the supplied CSS, not a parallel palette", () => {
    const css = '@theme inline { --font-sans: "Manrope"; --spacing-scene: 48px; } :root { --ground: #fafafa; --ink: #101010; } .dark { --ground: #111111; --ink: #eeeeee; }';
    const result = renderTokenReference(css);
    expect(result).toContain("--ground: #fafafa");
    expect(result).toContain("--ground: #111111");
    expect(result).toContain('--font-sans: "Manrope"');
    expect(result).toContain("--spacing-scene: 48px");
    const changed = renderTokenReference(css.replace("#fafafa", "#f0f0f0"));
    expect(changed).toContain("--ground: #f0f0f0");
    expect(changed).not.toContain("#fafafa");
  });
  it("merges shared brand colors with application role tokens without inventing values",()=>{
    const brand = ":root { --ground: #f6f5f0; --ink: #2a241f; } .dark { --ground: #181816; }";
    const app = "@theme inline { --font-sans: var(--vanya-brand-font-sans); } :root { --surface: white; } .dark { --surface: black; }";
    const output = renderTokenReference(brand + "\n" + app);
    expect(output).toContain("--ink: #2a241f");
    expect(output).toContain("--surface: white");
    expect(output).toContain("--surface: black");
  });
  it("publishes only canonical color roles from the actual library CSS",()=>{
    const css=readFileSync(new URL("../src/tokens.css",import.meta.url),"utf8");
    const output=renderTokenReference(css);
    for(const role of ["ground","surface","accent","border","border-strong"])
      expect(output).toContain(`--color-${role}: var(--${role});`);
    for(const removed of ["paper","paper-raised","amber","hairline","hairline-active"])
      expect(output).not.toContain(`--color-${removed}:`);
  });
  it("rejects absent theme declarations instead of inventing defaults", () => {
    expect(() => renderTokenReference(":root { --ground: white; }")).toThrow(/theme/i);
  });
});
