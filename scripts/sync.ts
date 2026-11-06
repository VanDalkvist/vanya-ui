import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTokenReference } from "./token-reference";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "src/tokens.css"), "utf8");
const exports = fs.readFileSync(path.join(root, "src/index.ts"), "utf8");
const components = fs.readdirSync(path.join(root, "src/components"))
  .filter((file) => file.endsWith(".tsx") && exports.includes(`./components/${file.slice(0, -4)}"`))
  .sort();

const reference = `# @vanya/ui — Hearth & Wave

> Generated from src/tokens.css and src/index.ts by bun run sync.
> This is a token/export reference, not an automatically inferred design specification.

## Composition
Open space, quiet contextual actions and details on request. See DESIGN.md for the authored composition guidance.
Manrope is the default UI/display family; Fraunces remains available for deliberately editorial prose.
The live showcase imports the same components and tokens as applications. It does not maintain a second palette.

## Actual CSS tokens
${renderTokenReference(css)}

## Exported components (${components.length})
${components.map((file) => `- ${file.slice(0, -4)}: import from "@vanya/ui"`).join("\n")}

## Usage
\`\`\`tsx
import { EventCard, InspectDrawer, ThemeToggle } from "@vanya/ui";
import "@vanya/ui/tokens.css";
\`\`\`
`;
for (const name of ["llms.txt", "public/llms.txt"]) fs.writeFileSync(path.join(root, name), reference);

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "@vanya/ui",
  homepage: "https://github.com/VanDalkvist/vanya-ui",
  description: "Contemplative craft design system for Vanya Afanasov",
  items: components.map((file) => {
    const name = file.slice(0, -4);
    return {
      name: name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
      type: "registry:ui",
      title: name,
      description: `Hearth & Wave primitive component ${name}`,
      files: [{ path: `src/components/${file}`, type: "registry:ui" }],
    };
  }),
};
fs.writeFileSync(path.join(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`Synced CSS token reference and ${components.length} exported components.`);
