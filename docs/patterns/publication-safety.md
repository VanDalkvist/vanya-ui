# Public publication boundary: Vanya UI

**Required for every contributor, agent, automated commit and deployment.**

Both the repository `VanDalkvist/vanya-ui` and the deployed website `https://ui.vanya-arc.dev/` are intentionally **public**. Assume an unauthenticated visitor can read every tracked file and inspect every client-side bundle, asset, route, source map and browser request.

## Do not publish

- Credentials of any kind: API keys, tokens, session/cookie values, passwords, private keys, signing secrets or `.env` files. Even if a token has expired, it does not belong in git history.
- Non-public personal or third-party data, messages, calendars, user records, business details, account IDs, email dumps, usage exports, analytics, private notes, internal screenshots or production logs.
- Actual consuming-service names, URLs, repository paths, commit identifiers, product marks, screenshots, adoption records and source-specific provenance, even when independently public. Generic components and reusable rules may be contributed after rights and boundary review. Keep origin records outside these public tools.
- Details obtained from private repositories, conversations, connected apps or files unless explicitly approved for public disclosure within this boundary.
- Private services' internal hostnames, access URLs, infrastructure configurations, database connection strings, deployment secrets or Cloudflare account metadata.
- Test/demo data that accidentally contains real user information. Do not assume a screenshot, code snippet or generated `llms.txt` is safe merely because it came from a tool.

## Allowed

- Published UI components, styles, public design principles, general code examples and synthetic fixture data.
- Relevant public third-party references with verified rights and attribution, and links to this library or its canonical brand package. Consumer identities remain outside the public boundary.
- Sanitized examples **only after verifying** that no private detail, identifying metadata or embedded credential remains.

Public verification receipts may include the public commit SHA, public URL, test counts and asset filenames. Keep provider account/build IDs, dashboard URLs, private session references, raw logs and comment edit history out of public reports. Review PR and issue descriptions and comments as well as Git diffs.

## Contributor preflight

Follow the [contributor guide](contributing.md). Run the owner preflight locally before public push using an externally supplied private policy; run the generic source and compiled checks in the existing build. Review outgoing commits, PR text, issue text and attachments separately. Generic CI does not have the private dictionary; a successful machine check cannot certify semantic privacy or binary content. Never publish the policy, raw reports or matching values.

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
