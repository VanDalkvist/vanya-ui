import { describe, expect, it } from "vitest";
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
  it("rejects absent theme declarations instead of inventing defaults", () => {
    expect(() => renderTokenReference(":root { --ground: white; }")).toThrow(/theme/i);
  });
});
