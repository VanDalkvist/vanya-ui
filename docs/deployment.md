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

## Multi-page navigation

Vite creates a separate output at `dist/guidelines/navigation/index.html`. Cloudflare Workers Static Assets serves it at `/guidelines/navigation/`. **Never** use SPA fallback to the home page for unrecognized routes: it would violate the addressable-page rule in [browser navigation](patterns/browser-navigation.md).

## Public release requirements

This repository, site, and all bundled assets are public. No secrets, private data or internal infrastructure. See [publication safety](patterns/publication-safety.md).

Before announcing a production release:
1. Confirm a successful Cloudflare Workers Build for the current commit on `main`.
2. Check the active Worker deployment/version.
3. Visit the public homepage and `/guidelines/navigation/` unauthenticated. Verify the page title and heading differ and that links and Back/Forward work.
4. Inspect a built artifact for accidental secrets or private data; no `.env`, production credentials, private URLs or real user records.
5. If build/deploy fails, inspect Workers Builds logs; do not claim that a Git commit alone is a website release.

## Recovery

Cloudflare retains Worker versions and deployments. If a release breaks the live site, restore a known-good Worker version via Cloudflare deployments. Fix the source on `main` to keep it aligned with production; avoid long-lived manual divergences.
