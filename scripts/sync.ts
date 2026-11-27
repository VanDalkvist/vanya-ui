import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTokenReference } from "./token-reference";
import { publicMarkdown, publishedDocuments, renderFullReference } from "./markdown-publication.mjs";
import { renderExportIndex } from "./public-export-index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "src/tokens.css"), "utf8");
const brandCss = fs.readFileSync(path.join(root,"node_modules/@vanya/brand/src/tokens.css"),"utf8");
const exports = fs.readFileSync(path.join(root, "src/index.ts"), "utf8");
const exportIndex = renderExportIndex(exports);
const components = fs.readdirSync(path.join(root, "src/components"))
  .filter((file) => file.endsWith(".tsx") && exports.includes(`./components/${file.slice(0, -4)}"`))
  .sort();

// Publish canonical Markdown and actual generated API data from one allowlist.
fs.copyFileSync(path.join(root,"llms.txt"),path.join(root,"public/llms.txt"));
fs.copyFileSync(path.join(root,"LICENSE"),path.join(root,"public/LICENSE.txt"));
// Exact asset copied from the pinned canonical brand package at build time.
fs.copyFileSync(path.join(root,"node_modules/@vanya/brand/assets/favicon.svg"),path.join(root,"public/vanya-arc-mark.svg"));
const refDir=path.join(root,"public/reference");
fs.mkdirSync(refDir,{recursive:true});
// Brand artwork has a custom license, separate from its MIT renderer code.
// Always copy the exact terms shipped in the pinned @vanya/brand dependency.
fs.copyFileSync(path.join(root,"node_modules/@vanya/brand/LICENSES/LicenseRef-VanyaArc-Brand.txt"),path.join(refDir,"brand-artwork-license.txt"));
for(const [source,route] of Object.entries(publishedDocuments)){
 const original=fs.readFileSync(path.join(root,source),"utf8");
 const destination=path.join(root,"public",route);
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.writeFileSync(destination,publicMarkdown(source,original));
}
const list="# Vanya Arc / UI — components\n\nPublic @vanya/ui exports. Source: https://github.com/VanDalkvist/vanya-ui\n\n"+
  exportIndex+"\n"+
  "\nExact prop types are in https://github.com/VanDalkvist/vanya-ui/blob/main/src/index.ts\n";
fs.writeFileSync(path.join(refDir,"components.md"),list);
fs.writeFileSync(path.join(refDir,"tokens.md"),"# Vanya Arc / UI — CSS tokens\n\nGenerated from pinned @vanya/brand and src/tokens.css.\n\n"+renderTokenReference(brandCss+"\n"+css));
fs.writeFileSync(path.join(refDir,"installation.md"),
 "# Install @vanya/ui\n\nInstall a verified immutable commit or use a local copy of the package:\n\n~~~sh\nbun add 'https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/<verified-40-char-commit-sha>'\n~~~\n\nImport tokens and register Tailwind sources:\n\n~~~css\n@import \"@vanya/ui/tokens.css\";\n@source \"../node_modules/@vanya/ui/src\";\n~~~\n\nReact 18/19, Tailwind 4 and TSX-capable bundler required. See https://github.com/VanDalkvist/vanya-ui/blob/main/README.md and https://ui.vanya-arc.dev/reference/agent-skill.md for the portable local agent workflow.\n");

const version=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8")).version;
const reference=renderFullReference(fs.readFileSync(path.join(root,"llms.txt"),"utf8"),version,route=>fs.readFileSync(path.join(root,"public",route),"utf8"));
fs.writeFileSync(path.join(root,"public/llms-full.txt"),reference);

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
