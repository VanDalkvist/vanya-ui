# Agent and search discoverability — Vanya UI

The site is intentionally **public**. These files must never include secrets, private project details, private account data or internal URLs.

## Authority and guarantees

1. **Real HTML matters most.** The home page is statically rendered during build; substantive content and native links appear in the raw response without JavaScript. Interactive components hydrate afterward.
2. **Canonical page and anchors:** one longread at https://ui.vanya-arc.dev/, with meaningful fragment IDs. Old /guidelines/navigation/ is an explicit redirect; /showcase.html is marked noindex.
3. **Crawl basics:** /robots.txt allows public crawling; /sitemap.xml lists the canonical longread and Markdown references; <a href> links are usable in plain HTML; document metadata includes description, canonical, Open Graph and SoftwareSourceCode JSON-LD.
4. **Markdown alternatives:** /index.md, /reference/components.md, /reference/tokens.md, /reference/navigation.md, /reference/composition.md, /reference/workspaces.md, /reference/installation.md. Generator copies approved public docs and derives component/token indexes from source.
5. **llms.txt:** a compact curated index; /llms-full.txt is a generated extended reference. HTML uses alternate (text/markdown) and describedby relations, following the 2026 llms.txt proposal. The proposal is not an official ranking signal, and crawlers may ignore it.
6. **Releases:** Cloudflare Workers Builds deploys main only after tests, typecheck and Vite + HTML prerender succeed.

## Post-deploy validation

- Compare raw HTML without JS and rendered page: both should contain the headings for "Принципы" and "Рабочие поверхности" and real anchors.
- Confirm 200 on /, /index.md, /llms.txt, /llms-full.txt, /reference/components.md, /robots.txt and /sitemap.xml; verify MIME and links.
- Confirm /guidelines/navigation/ has explicit redirect to /#browser-navigation; /showcase.html does not claim a second canonical URL.
- Confirm unknown URL responds 404 instead of silently rendering /.
- Verify with Google Search Console or Bing Webmaster Tools separately if actual indexing is important. Technical readiness does not guarantee search ranking or indexing.

## Sources

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [llms.txt proposal v2](https://llmstxt.org/)
- [Bing: Sitemaps in AI search](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)
