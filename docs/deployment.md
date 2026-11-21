# Vanya UI production deployment

Production public site: **https://ui.vanya-arc.dev**. Source: **https://github.com/VanDalkvist/vanya-ui**, branch **main**. Existing Cloudflare Worker: **vanya-ui**.

## Source of truth and trigger

Cloudflare Workers Builds connects this public GitHub repository directly to the existing Worker. A push/merge into `main` triggers the production build and deploy; development/other branches do not deploy to the production domain. Cloudflare's build token remains stored in Cloudflare only. No GitHub Actions deploy secrets are required.

Cloudflare Dashboard: Workers & Pages → **vanya-ui** → Settings → Builds.

Build command:
```sh
bun install --frozen-lockfile && bun run test && bunx tsc --noEmit -p tsconfig.build.json && bun run build
```

Deploy command:
```sh
npx wrangler@4 deploy
```

Repository root: `/`. Wrangler config: `wrangler.jsonc`. It names the existing Worker `vanya-ui` and publishes assets from `dist/`. The already-attached custom domain belongs to the Worker; do not recreate it.

## One longread, Markdown and crawler verification

The canonical document is `/` with anchors `/#identity`, `/#principles`, `/#workspace` and `/#browser-navigation`. Legacy `/guidelines/navigation/` and `/showcase.html` use HTTP 301 redirects in `public/_redirects` (the old HTML fallback also has a link). Never configure an SPA fallback that serves home for arbitrary URLs.

`bun run build` runs `bun run sync`, Vite, then `scripts/prerender.tsx`: it produces usable HTML at `dist/index.html` **without client JS** plus `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` and Markdown at `index.md` and `reference/*.md`. React hydrates the server-rendered tree for live interactions. `public/_headers` sets UTF-8 for Markdown and plain-text agent resources and scoped security headers. Build failures prevent production deployment.

## Public release requirements

This repository, site, and all bundled assets are public. No secrets, private data or internal infrastructure. See [publication safety](patterns/publication-safety.md).

Before announcing a production release:
1. Confirm a successful Cloudflare Workers Build for the current commit on `main`.
2. Check the active Worker deployment/version.
3. Check `/`, `/#browser-navigation`, `/#workspace`, `/guidelines/navigation/` (redirect), `/llms.txt`, `/index.md`, `/reference/identity.md`, `/sitemap.xml` and `/reference/components.md` without authentication or JavaScript.
4. Inspect built HTML and JS as public artifacts for accidental secrets or private data; no `.env`, production credentials, private URLs or real user records.
5. If build/deploy fails, inspect Workers Builds logs; do not claim that a Git commit alone is a website release.

## Recovery

Cloudflare retains Worker versions and deployments. If a release breaks the live site, restore a known-good Worker version via Cloudflare deployments. Fix the source on `main` to keep it aligned with production; avoid long-lived manual divergences.
