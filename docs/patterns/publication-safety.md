# Public publication boundary: Vanya UI

**Required for every contributor, agent, automated commit and deployment.**

Both the repository `VanDalkvist/vanya-ui` and the deployed website `https://ui.vanya-arc.dev/` are intentionally **public**. Assume an unauthenticated visitor can read every tracked file and inspect every client-side bundle, asset, route, source map and browser request.

## Do not publish

- Credentials of any kind: API keys, tokens, session/cookie values, passwords, private keys, signing secrets or `.env` files. Even if a token has expired, it does not belong in git history.
- Non-public personal or third-party data, messages, calendars, user records, business details, account IDs, email dumps, usage exports, analytics, private notes, internal screenshots or production logs.
- Details obtained from private repositories, conversations, connected apps, private files or other projects unless explicitly approved for public disclosure.
- Private services' internal hostnames, access URLs, infrastructure configurations, database connection strings, deployment secrets or Cloudflare account metadata.
- Test/demo data that accidentally contains real user information. Do not assume a screenshot, code snippet or generated `llms.txt` is safe merely because it came from a tool.

## Allowed

- Published UI components, styles, public design principles, general code examples and synthetic fixture data.
- Public references and deliberately shared project URLs, with no secret query parameters or authorization context.
- Sanitized examples **only after verifying** that no private detail, identifying metadata or embedded credential remains.

## Mandatory release checklist

1. Review the complete commit diff, including generated files and deleted files (history remains public).
2. Examine the production `dist/` output after building. Bundled `VITE_*` / `import.meta.env` values are public. Do not put secrets into client environment variables.
3. Check newly added images, HTML metadata, fonts, source maps, fixtures, demos, API samples and static documents for private content.
4. Ensure GitHub history contains no newly introduced secret. If leakage occurs, stop publishing, rotate/revoke affected credentials immediately and assess history cleanup; deleting the file is not enough.
5. Check that credentials needed by server-side Cloudflare Workers are managed as protected secret bindings; client code must never receive them.
6. Verify the public domain anonymously after deployment, including all newly added URLs. Never claim a public release based only on a git commit or a Worker deployment timestamp.
7. If a source might be private, **do not publish it** until its public status is explicitly confirmed. Use a synthetic example instead.

Automated secret scanning is a supporting check, **not a substitute** for review of context, identifiers and private information. No deployment workflow is implicitly authorised to release connected-account data.

## Related rules

- [Browser navigation and addressable views](browser-navigation.md)
- [Vanya UI design source of truth](../../DESIGN.md)
