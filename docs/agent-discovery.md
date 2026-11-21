# Agent and search discoverability — Vanya UI

The site is intentionally **public**. These files must never include secrets, private project details, private account data or internal URLs.

## Authority and guarantees

1. **Real HTML matters most.** The home page is statically rendered during build; substantive content and native links appear in the raw response without JavaScript. Interactive components hydrate afterward.
2. **Canonical page and anchors:** one longread at https://ui.vanya-arc.dev/, with meaningful fragment IDs. Old /guidelines/navigation/ and /showcase.html use HTTP 301 redirects to canonical sections via `public/_redirects`.
3. **Identity:** /#identity and /reference/identity.md document brand/product naming, exact reusable SVG mark and source tokens. Source: docs/identity/brand.md.
4. **Crawl basics:** /robots.txt allows public crawling; /sitemap.xml lists the canonical longread and Markdown references; <a href> links are usable in plain HTML; document metadata includes description, canonical, Open Graph and SoftwareSourceCode JSON-LD.
5. **Markdown alternatives:** /index.md, /reference/components.md, /reference/tokens.md, /reference/navigation.md, /reference/composition.md, /reference/workspaces.md, /reference/installation.md. Generator copies approved public docs and derives component/token indexes from source.
6. **llms.txt:** a compact curated index; /llms-full.txt is a generated extended reference. HTML uses alternate (text/markdown) and describedby relations, following the 2026 llms.txt proposal. The proposal is not an official ranking signal, and crawlers may ignore it.
7. **Encoding:** `public/_headers` ensures text/markdown and text/plain responses declare UTF-8, including Cyrillic. Test the rendered characters, not only the file's presence.
8. **Releases:** Cloudflare Workers Builds deploys main only after tests, typecheck and Vite + HTML prerender succeed.

## Typography and writing references

- Anchors `/#typography` and `/#writing` are pre-rendered with the longread.
- Normative public Markdown `/reference/typography.md` and `/reference/writing.md` are copied from approved `docs/patterns`.
- Curated `llms.txt` and generated `llms-full.txt` link to these rules; project-specific policy is `.agents/redpolitika.md`.
- The original Sarycheva/Arkhipov skills are explicitly credited; this repo has no ownership of the original skill content.

## Keyboard shortcut indexing

- The live anchor `/#keyboard-shortcuts` is server-rendered with the longread.
- The normative Markdown `/reference/keyboard-shortcuts.md` is copied from `docs/patterns/keyboard-shortcuts.md`.
- Both curated `llms.txt` and generated `llms-full.txt` link to the canonical policy, including WCAG 2.1.4 opt-out rules, keys, conflicts and visual styling.
- The exported `ShortcutKeys` is visible in the component registry and `/reference/components.md`; actual shortcut handling is app-specific and must pass the same policy.

## License discoverability

- Root `LICENSE` governs authored MIT code; `/LICENSE.txt` is a published copy.
- `THIRD_PARTY_NOTICES.md` is copied to `/reference/third-party.md`, including full Lucide ISC and Feather MIT notices.
- Vite generates `/licenses.txt` from licenses of all packages included in the built client bundle, not from every development tool or every consumer app.
- Both human documentation and `llms.txt` link to all three. Creative Commons sources are credited by their actual authors.

## Post-deploy validation

- Compare raw HTML without JS and rendered page: both should contain the headings for "Принципы" and "Рабочие поверхности" and real anchors.
- Confirm 200 on /, /index.md, /llms.txt, /llms-full.txt, /reference/components.md, /reference/identity.md, /reference/keyboard-shortcuts.md, /robots.txt and /sitemap.xml; verify MIME and links.
- Confirm /guidelines/navigation/ has explicit redirect to /#browser-navigation; /showcase.html does not claim a second canonical URL.
- Confirm unknown URL responds 404 instead of silently rendering /.
- Verify with Google Search Console or Bing Webmaster Tools separately if actual indexing is important. Technical readiness does not guarantee search ranking or indexing.

## Sources

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [llms.txt proposal v2](https://llmstxt.org/)
- [Bing: Sitemaps in AI search](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)
