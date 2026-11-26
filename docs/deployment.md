# Vanya UI production deployment

Production public site: **https://ui.vanya-arc.dev**. Source: **https://github.com/VanDalkvist/vanya-ui**, branch **main**. Existing Cloudflare Worker: **vanya-ui**.

## Source of truth and trigger

Cloudflare Workers Builds connects this public GitHub repository directly to the existing Worker. A push/merge into `main` triggers the production build and deploy; development/other branches do not deploy to the production domain. Cloudflare's build token remains stored in Cloudflare only. No GitHub Actions deploy secrets are required.

Cloudflare Dashboard: Workers & Pages → **vanya-ui** → Settings → Builds.

Build command:
```sh
bun run test && bunx tsc --noEmit -p tsconfig.build.json && bun run build && bun run lint:design:pilot
```

Deploy command:
```sh
npx wrangler@4 deploy
```

Cloudflare performs the frozen Bun installation from the committed `bun.lock` before the build command. The validation trigger includes non-production branches and excludes `main`; the production trigger is limited to `main`. Both retain their existing checks. Do not repeat the native install unless a build log proves it is needed.

Repository root: `/`. Wrangler config: `wrangler.jsonc`. It names the existing Worker `vanya-ui` and publishes assets from `dist/`. The already-attached custom domain belongs to the Worker; do not recreate it.

## One longread, Markdown and crawler verification

The canonical document is `/` with anchors `/#identity`, `/#typography`, `/#writing`, `/#principles`, `/#workspace` and `/#browser-navigation`. Legacy `/guidelines/navigation/` and `/showcase.html` use HTTP 301 redirects in `public/_redirects` (the old HTML fallback also has a link). Never configure an SPA fallback that serves home for arbitrary URLs.

`bun run build` runs `bun run sync`, Vite, then `scripts/prerender.tsx`: it produces usable HTML at `dist/index.html` **without client JS** plus `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` and Markdown at `index.md` and `reference/*.md`. React hydrates the server-rendered tree for live interactions. `public/_headers` sets UTF-8 for Markdown and plain-text agent resources and scoped security headers. Build failures prevent production deployment. The build also checks that compiled CSS contains required brand/type tokens, shared component selectors and a generated utility. The networked `bun run lint:design:pilot` is a separate source check. See the static enforcement record for the current evidence and promotion criteria. Non-production builds use the same gate after calibration and end with `echo VALIDATION_ONLY_DO_NOT_DEPLOY`.

## Mixed-license publication

The build also publishes /reference/licensing.md and /reference/brand.md. The favicon is copied from the pinned `@vanya/brand` dependency during `bun run sync`. Do not edit an asset independently in UI. Keep past MIT permissions intact. Verify these live docs in the same build.

## Dependency license preservation

`vite.config.ts` uses `build.license: { fileName: "licenses.txt" }` to publish full bundled-dependency notices with the site at `/licenses.txt`. `scripts/sync.ts` publishes the project's own MIT license at `/LICENSE.txt` and manual source attribution at `/reference/third-party.md`. Never omit these artifacts from a release or mistake their presence for a legal review of every upstream package.

## Public release requirements

This repository, site, and all bundled assets are public. No secrets, private data or internal infrastructure. See [publication safety](patterns/publication-safety.md).

Before announcing a production release:
1. Confirm a successful Cloudflare Workers Build for the current commit on `main`.
2. Check the active Worker deployment/version.
3. Check `/`, `/#browser-navigation`, `/#workspace`, `/guidelines/navigation/` (redirect), `/llms.txt`, `/index.md`, `/reference/identity.md`, `/reference/typography.md`, `/reference/writing.md`, `/sitemap.xml` and `/reference/components.md`, `/reference/third-party.md`, `/LICENSE.txt`, `/licenses.txt` without authentication or JavaScript.
4. Inspect built HTML and JS as public artifacts for accidental secrets or private data; no `.env`, production credentials, private URLs or real user records.
5. If build/deploy fails, inspect Workers Builds logs; do not claim that a Git commit alone is a website release.

## Versioned package vs live documentation

Every successful Workers Build deploys the documentation from `main`, **not** a new consumer package release or Git tag. Follow the separate [SemVer and SHA-pin procedure](versioning.md); do not add push/PR/schedule GitHub Actions for release automation.

## Recovery

Cloudflare retains Worker versions and deployments. If a release breaks the live site, restore a known-good Worker version via Cloudflare deployments. Fix the source on `main` to keep it aligned with production; avoid long-lived manual divergences.
