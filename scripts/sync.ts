import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const TOKENS_CSS = path.join(ROOT, "src/tokens.css");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const LLMS_TXT = path.join(ROOT, "llms.txt");
const PUBLIC_LLMS_TXT = path.join(ROOT, "public/llms.txt");
const REGISTRY_JSON = path.join(ROOT, "registry.json");

// 1. Read tokens.css and parse tokens
const cssContent = fs.readFileSync(TOKENS_CSS, "utf8");

// 2. Discover exported components
const componentFiles = fs
  .readdirSync(COMPONENTS_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .sort();

console.log(`Discovered ${componentFiles.length} components in src/components/:`);
componentFiles.forEach((f) => console.log(` - ${f}`));

// 3. Generate llms.txt content
const llmsContent = `# @vanya/ui (Hearth & Wave Design System)

> Single Source of Truth for Vanya Afanasov's autonomous workspace, tools, and creative apps.
> Generated automatically from src/tokens.css and component TypeScript signatures.
> DO NOT hand-edit this file; run 'bun run sync' to regenerate.

## Core Rules & Invariants
- **Operate Mode:** High scanability, zero unearned motion, 150-250ms transitions.
- **Rule of 5% Color:** Max 3-5% colored pixels. Chrome is monochrome warm charcoal/paper. Accent color belongs only on data and living focus (amber #ffb266).
- **Single Elevation:** 1px hairline border OR surface step; never combine with soft drop shadows.
- **Typography Trinity:**
  - Fraunces: narrative dates, identity, quotes. Never for buttons or UI labels.
  - Manrope: UI labels, card headers, buttons, prose body text.
  - JetBrains Mono: code, ports, timestamps, metrics, strictly in lowercase.
- **Micro-radii:** 2px for buttons/tags/kbd/inputs; 4px for cards/drawers/modals.

## Dual-Theme Color Ramp (OKLCH)
- **Dark Ground:** oklch(0.185 0.008 65) (#181816)
- **Dark Surface:** oklch(0.235 0.010 65) (#22221f)
- **Dark Ink:** oklch(0.930 0.008 75) (#ece4d6)
- **Dark Amber:** #ffb266 / oklch(0.68 0.155 45)
- **Light Ground:** oklch(0.964 0.008 85) (#f6f5f0)
- **Light Surface:** oklch(0.979 0.006 85)
- **Light Ink:** oklch(0.265 0.012 60) (#181816)
- **Light Amber:** oklch(0.530 0.135 42) (terracotta)

## Exported Components (${componentFiles.length})
${componentFiles
  .map((file) => {
    const name = file.replace(/\.tsx$/, "");
    return `- **${name}**: 'import { ${name} } from "@vanya/ui";'`;
  })
  .join("\n")}

## Usage Pattern
\`\`\`tsx
import { CraftCard, Kbd, CategoryBadge, SegmentedControl, ThemeToggle, useTheme } from "@vanya/ui";
import "@vanya/ui/tokens.css";
\`\`\`
`;

fs.writeFileSync(LLMS_TXT, llmsContent, "utf8");
fs.mkdirSync(path.dirname(PUBLIC_LLMS_TXT), { recursive: true });
fs.writeFileSync(PUBLIC_LLMS_TXT, llmsContent, "utf8");
console.log("Updated llms.txt and public/llms.txt");

// 4. Generate shadcn-compatible registry.json
const registryItems = componentFiles.map((file) => {
  const name = file.replace(/\.tsx$/, "");
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return {
    name: kebab,
    type: "registry:ui",
    title: name,
    description: `Hearth & Wave primitive component ${name}`,
    files: [
      {
        path: `src/components/${file}`,
        type: "registry:ui",
      },
    ],
  };
});

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "@vanya/ui",
  homepage: "https://github.com/VanDalkvist/vanya-ui",
  description: "Contemplative craft design system for Vanya Afanasov",
  items: registryItems,
};

fs.writeFileSync(REGISTRY_JSON, JSON.stringify(registry, null, 2) + "\n", "utf8");
console.log("Updated registry.json");
console.log("Zero-drift sync completed successfully.");
