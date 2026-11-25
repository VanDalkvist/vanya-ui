# Divider composition — #29

Baseline `581bed2e04c6cf105669074797d4187127f28b14` (0.3.28). Owner feedback: adjacent horizontal dividers compete in the Typography and Writing sections. Source and owner screenshots show repeated horizontal rules, including writing example outer edges and four article top edges, editorial pair borders and a separate bordered reading demo. No private screenshots copied into the public repo.

## Cycle 30 — 0.3.29

| Surface | Source finding | Decision |
|---|---|---|
| Typography scale and tracking | Parent top + every row bottom, heading inside border | Internal sibling row separators only; clearer heading and status spacing |
| Editorial and reading | Two border-block containers around adjacent prose | Open text composition; existing heading and layout hierarchy |
| Writing example and principles | Two outer lines plus four per-article lines | One full-width principle group top edge, no individual article edges |
| Writing reference list | Outer top and last bottom | Internal scan row separators |
| Interaction specimens | Parent border-block plus every sample bottom | Interior grid row boundaries only, one column on mobile |

Architecture: layout CSS only, no global --border change, no new shared component or API, no change to control, focus, panel, selected or table borders. Source review found additional purposeful boundaries in identity surfaces, catalog sections, sticky bars, list/shortcut structures; preserve pending full-page visual audit rather than remove indiscriminately.

Design review: hierarchy through whitespace, existing grid/typography and single owner per boundary. Added reusable composition rule to canonical guide, DESIGN, agent skill, and LLM sources. Browser spec asserts computed border styles for eight viewport/theme cases and a negative control restores the old competing border. Actual browser execution and post-change screenshots NOT_RUN at commit; production build pending. Reflow and accessibility remain linked to #27. No new PR, dependency or release tag.
