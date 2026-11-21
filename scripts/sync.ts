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

const reference = `# @vanya/ui — Vanya-Arc/UI

> Generated from src/tokens.css and src/index.ts by bun run sync.
> This is a token/export reference, not an automatically inferred design specification.

## Composition
Open space, quiet contextual actions and details on request. See DESIGN.md for the authored composition guidance.
Manrope is the default UI/display family; Fraunces remains available for deliberately editorial prose.
The live showcase imports the same components and tokens as applications. It does not maintain a second palette.

## Browser navigation (normative)
Every meaningful page or shareable view must have a stable URL; open, reload, Back/Forward and browser link actions must work. Use native anchors or router links that render anchors for navigation, and buttons for local actions. Route/state boundaries and the acceptance checklist live in docs/patterns/browser-navigation.md. The live reference is /#browser-navigation.

## Public publication safety (mandatory)
The GitHub repository and https://ui.vanya-arc.dev are public. Never include private user/account/project data, secrets, private URLs, internal infrastructure, real records, logs or analytics in source, docs, demos or build output. Use synthetic examples. Review the full diff and built dist/ before committing or deploying. Never expose Cloudflare secrets or credentials in browser code. See docs/patterns/publication-safety.md.

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
// Keep curated llms.txt human-maintained; generate detailed data and public Markdown from the actual source.
fs.writeFileSync(path.join(root,"llms-full.txt"),reference);
fs.writeFileSync(path.join(root,"public/llms-full.txt"),reference);
fs.copyFileSync(path.join(root,"llms.txt"),path.join(root,"public/llms.txt"));
fs.copyFileSync(path.join(root,"docs/site-overview.md"),path.join(root,"public/index.md"));
const refDir=path.join(root,"public/reference");
fs.mkdirSync(refDir,{recursive:true});
const docs=[
 ["docs/patterns/browser-navigation.md","navigation.md"],
 ["docs/patterns/publication-safety.md","publication-safety.md"],
 ["docs/composition/working-surfaces.md","composition.md"],
 ["docs/research/workspace-scroll-composition-2026-11-21.md","workspaces.md"],
 ["docs/deployment.md","deployment.md"],
];
for(const [from,to] of docs)fs.copyFileSync(path.join(root,from),path.join(refDir,to));
const list="# Vanya-Arc/UI — components\n\nPublic @vanya/ui exports. Source: https://github.com/VanDalkvist/vanya-ui\n\n"+
  components.map(file=>"- **"+file.slice(0,-4)+"**: https://github.com/VanDalkvist/vanya-ui/blob/main/src/components/"+file+"\n").join("")+
  "\nExact prop types are in https://github.com/VanDalkvist/vanya-ui/blob/main/src/index.ts\n";
fs.writeFileSync(path.join(refDir,"components.md"),list);
fs.writeFileSync(path.join(refDir,"tokens.md"),"# Vanya-Arc/UI — CSS tokens\n\nGenerated from src/tokens.css.\n\n"+renderTokenReference(css));
fs.writeFileSync(path.join(refDir,"installation.md"),
 "# Install @vanya/ui\n\nInstall from public GitHub:\n\n~~~sh\nbun add github:VanDalkvist/vanya-ui\n~~~\n\nImport tokens and register Tailwind sources:\n\n~~~css\n@import \"@vanya/ui/tokens.css\";\n@source \"../node_modules/@vanya/ui/src\";\n~~~\n\nReact 18/19, Tailwind 4 and TSX-capable bundler required. See https://github.com/VanDalkvist/vanya-ui/blob/main/README.md\n");


const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "@vanya/ui",
  homepage: "https://ui.vanya-arc.dev",
  description: "React components and CSS tokens by Vanya Afanasov",
  items: components.map((file) => {
    const name = file.slice(0, -4);
    return {
      name: name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
      type: "registry:ui",
      title: name,
      description: `React UI component ${name} from @vanya/ui`,
      files: [{ path: `src/components/${file}`, type: "registry:ui" }],
    };
  }),
};
fs.writeFileSync(path.join(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`Synced CSS token reference and ${components.length} exported components.`);
