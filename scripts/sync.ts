import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTokenReference } from "./token-reference";
import { publicMarkdown } from "./markdown-publication.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "src/tokens.css"), "utf8");
const brandCss = fs.readFileSync(path.join(root,"node_modules/@vanya/brand/src/tokens.css"),"utf8");
const exports = fs.readFileSync(path.join(root, "src/index.ts"), "utf8");
const components = fs.readdirSync(path.join(root, "src/components"))
  .filter((file) => file.endsWith(".tsx") && exports.includes(`./components/${file.slice(0, -4)}"`))
  .sort();

const reference = `# @vanya/ui — Vanya Arc / UI

> Generated from @vanya/brand/src/tokens.css + src/tokens.css + src/index.ts by bun run sync.
> This is a token/export reference, not an automatically inferred design specification.

## Agent instructions (canonical public entrypoints)
- Portable agent skill: https://ui.vanya-arc.dev/reference/agent-skill.md
- Local inspect/check/verify workflow: https://ui.vanya-arc.dev/reference/ui-pipeline.md
- List-detail layout and scroll acceptance: https://ui.vanya-arc.dev/reference/list-detail.md
The actual component API is defined in the pinned src/index.ts and component implementations. Search excerpts and llms.txt links are discovery aids, not binding agent instructions.

## Composition
Open space, quiet contextual actions and details on request. See DESIGN.md for the authored composition guidance.
Manrope is the default UI/display family; Fraunces remains available for deliberately editorial prose.
The live showcase imports the same components and tokens as applications. It does not maintain a second palette.

## Loading states (normative)
Use Skeleton, SkeletonText, MediaCardSkeleton and LoadingRegion from @vanya/ui. Keep known page structure, reserve future layout, use one accessible status per loading area, disable pulse for reduced motion, and replace skeleton on success or error. Full docs: docs/patterns/loading-states.md; live /#loading-states.

## Typography (normative)
Use ui-type-display, ui-type-heading, ui-type-subheading, ui-type-body, ui-type-compact, ui-type-caption and ui-type-code from src/tokens.css. Manrope is for UI, JetBrains Mono for code; Fraunces is an optional editorial face. Body 1rem/1.65, measure 66ch; test mobile, browser zoom and text spacing. Source docs/patterns/typography.md and /#typography.

## Writing (normative)
Project-specific voice and verified product facts are in .agents/redpolitika.md. For editorial methods, use source links and fetch originals only when the task requires them: Ilyakhov and Sarycheva, the book https://bureau.ru/books/pishi/190 (not CC BY); Sarycheva and Arkhipov, original redaktura-skills https://github.com/N1arko/redaktura-skills (CC BY 4.0). Never represent our local rules as their copied or official method. Do not vendor upstream SKILL.md text, or invent source content when offline. Full source routing: docs/patterns/writing-and-editorial.md; live /#writing.

## Identity (normative)
Vanya Arc is the parent brand; UI is the design-system product. The approved V → A sign, React lockups and CSS palette are provided exclusively by the public GitHub dependency @vanya/brand. VanyaArcMark and VanyaArcLockup are re-exported by @vanya/ui. Only UI is highlighted. Normative source: https://github.com/VanDalkvist/vanya-arc-brand/blob/main/docs/brand-guidelines.md; UI integration docs/identity/brand.md; live /#identity.

## Keyboard shortcuts (normative)
Shortcuts are optional accelerators, not replacements for commands. Avoid browser/OS collisions; do not run inside text inputs, IME or unrelated dialogs. Character-only shortcuts must be switchable off (WCAG 2.1.4). Use Kbd and ShortcutKeys for semantic accessible hints, follow the token palette, and keep a single source of truth for actual bindings. Full guidance: docs/patterns/keyboard-shortcuts.md, live section /#keyboard-shortcuts.

## Browser navigation (normative)
Every meaningful page or shareable view must have a stable URL; open, reload, Back/Forward and browser link actions must work. Use native anchors or router links that render anchors for navigation, and buttons for local actions. Route/state boundaries and the acceptance checklist live in docs/patterns/browser-navigation.md. The live reference is /#browser-navigation.

## Mixed licensing and protected brand (mandatory)
Software stays MIT. Only explicitly marked original research uses CC BY 4.0. Official artwork and renderer are supplied by the separately licensed @vanya/brand dependency; UI merely re-exports them. Older MIT copies keep their original grants. Read LICENSING.md, BRAND.md and docs/legal/licensing-implementation-2026-11-22.md. The REUSE annotations cover selected paths, not a claimed full REUSE audit. Public /reference/licensing.md and /reference/brand.md.

## Sources and citation (mandatory)

Every external claim needs its true primary author/organization, title, direct URL, the specific supported assertion and a rights status (reference-only, explicit license, permitted quotation or written permission). Distinguish citations, protected quotations, licensed adaptations and independently created commentary. A link is NOT a copyright license. Ilyakhov and Sarycheva's book is linked for commentary; redaktura-skills is CC BY 4.0 with its own named authors. For CC BY adaptations include author/title/source/license/changes; for MIT code preserve notices; for images/diagrams obtain permission or verify terms before reproduction. Refer to docs/patterns/sources-and-attribution.md and /reference/sources.md. Do not assert legal clearance merely because a source is public.

## Licenses and third-party attribution (mandatory)
This UI package's authored code is MIT (LICENSE, Copyright 2026 Vanya Afanasov). Third-party licenses are separate; never relicense other people's code or images as yours. Lucide includes ISC and Feather MIT notices; Manrope, Fraunces, JetBrains Mono use OFL-1.1; the Sarycheva/Arkhipov redaktura-skills source is CC BY 4.0 and is referenced with credit, not vendored. Read THIRD_PARTY_NOTICES.md and docs/legal/license-audit-2026-11-22.md. Live site: /reference/third-party.md, /LICENSE.txt, /licenses.txt (generated bundle dependency licenses). For brand usage read https://github.com/VanDalkvist/vanya-arc-brand/blob/main/BRAND.md; older MIT grants persist.

## Public publication safety (mandatory)
The GitHub repository and https://ui.vanya-arc.dev are public. Never include private user/account/project data, secrets, private URLs, internal infrastructure, real records, logs or analytics in source, docs, demos or build output. Use synthetic examples. Review the full diff and built dist/ before committing or deploying. Never expose Cloudflare secrets or credentials in browser code. See docs/patterns/publication-safety.md.

## Actual CSS tokens
${renderTokenReference(brandCss + "\n" + css)}

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
fs.copyFileSync(path.join(root,"LICENSE"),path.join(root,"public/LICENSE.txt"));
// Exact asset copied from the pinned canonical brand package at build time.
fs.copyFileSync(path.join(root,"node_modules/@vanya/brand/assets/favicon.svg"),path.join(root,"public/vanya-arc-mark.svg"));
const refDir=path.join(root,"public/reference");
fs.mkdirSync(refDir,{recursive:true});
const docs=[
 ["THIRD_PARTY_NOTICES.md","third-party.md"],
 ["LICENSING.md","licensing.md"],
 ["BRAND.md","brand.md"],
 ["docs/identity/brand.md","identity.md"],
 ["docs/patterns/typography.md","typography.md"],
 ["docs/patterns/loading-states.md","loading.md"],
 ["docs/patterns/writing-and-editorial.md","writing.md"],
 ["docs/patterns/sources-and-attribution.md","sources.md"],
 ["docs/patterns/browser-navigation.md","navigation.md"],
 ["skills/vanya-ui/SKILL.md","agent-skill.md"],
 ["docs/patterns/ui-feature-pipeline.md","ui-pipeline.md"],
 ["docs/patterns/list-detail-composition.md","list-detail.md"],
 ["docs/patterns/keyboard-shortcuts.md","keyboard-shortcuts.md"],
 ["docs/patterns/publication-safety.md","publication-safety.md"],
 ["docs/composition/working-surfaces.md","composition.md"],
 ["docs/research/workspace-scroll-composition-2026-11-21.md","workspaces.md"],
 ["docs/deployment.md","deployment.md"],
];
for(const [from,to] of docs){
 const original=fs.readFileSync(path.join(root,from),"utf8");
 fs.writeFileSync(path.join(refDir,to),publicMarkdown(from,original));
}
const list="# Vanya Arc / UI — components\n\nPublic @vanya/ui exports. Source: https://github.com/VanDalkvist/vanya-ui\n\n"+
  components.map(file=>"- **"+file.slice(0,-4)+"**: https://github.com/VanDalkvist/vanya-ui/blob/main/src/components/"+file+"\n").join("")+
  "\nExact prop types are in https://github.com/VanDalkvist/vanya-ui/blob/main/src/index.ts\n";
fs.writeFileSync(path.join(refDir,"components.md"),list);
fs.writeFileSync(path.join(refDir,"tokens.md"),"# Vanya Arc / UI — CSS tokens\n\nGenerated from src/tokens.css.\n\n"+renderTokenReference(css));
fs.writeFileSync(path.join(refDir,"installation.md"),
 "# Install @vanya/ui\n\nInstall a verified immutable commit or use a local copy of the package:\n\n~~~sh\nbun add 'github:VanDalkvist/vanya-ui#<verified-40-char-commit-sha>'\n~~~\n\nImport tokens and register Tailwind sources:\n\n~~~css\n@import \"@vanya/ui/tokens.css\";\n@source \"../node_modules/@vanya/ui/src\";\n~~~\n\nReact 18/19, Tailwind 4 and TSX-capable bundler required. See https://github.com/VanDalkvist/vanya-ui/blob/main/README.md and https://ui.vanya-arc.dev/reference/agent-skill.md for the portable local agent workflow.\n");


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
