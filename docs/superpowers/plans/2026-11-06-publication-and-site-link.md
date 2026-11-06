# Publish the UI showcase and link the personal site

## User request
Make the audited repository public (existing Git author contact explicitly approved), deploy the verified showcase to ui.vanya-arc.dev, then add an external «Дизайн-система» link on vanya-arc.dev between «Сейчас» and GitHub. Push each meaningful slice immediately. No unrelated site content or infrastructure changes.

## Source / implementation boundary
- Repository visibility is already PUBLIC; anonymous raw access matches the Git revision.
- Cloudflare zone/custom domains inspected: target ui hostname has no current DNS record or Worker binding. Existing root site uses Worker life-wave-narrative with GitHub main → Workers Builds; preserve that deployment path.
- New UI deployment uses cf CLI, not a new Wrangler project. Its Vite plugin requires Vite 7/8, while the library uses Vite 6. Preserve Vite and produce the cf Build Output v0 accepted by `cf deploy --prebuilt`; the tiny adapter copies verified dist and writes root/worker metadata. CLI validates it with a dry run. No bundler/framework migration.
- Reuse existing authorized OAuth only in a child-process environment; never persist or log a credential. No credential or account identifiers required in the public deployment config. Deploy assets-only Worker vanya-ui; custom domain manages DNS/TLS, workers.dev disabled. No paid upgrade.
- Only after the UI URL is live, edit NowQuickLinks.tsx in life-wave-narrative. Add the descriptive external link with an external icon, keep native keyboard operation and dividers, check mobile space and «Сейчас» behavior. Do not change timeline data or camera state.

## Acceptance
- [x] Public repository and anonymous source access verified.
- [ ] cf prebuilt validation and HTTPS asset equality on ui.vanya-arc.dev; live desktop/mobile browser behavior.
- [ ] Main site navigation link ordered after «Сейчас» and before GitHub, with external/new-tab affordance.
- [ ] Tests/build pass in the modified projects, scoped commits pushed immediately.
- [ ] Existing Workers Builds completes successfully and live vanya-arc.dev is read back; no deployment inferred merely from a push.
