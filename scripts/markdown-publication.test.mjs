import test from 'node:test';
import assert from 'node:assert/strict';
import {publicMarkdown} from './markdown-publication.mjs';

test('rewrite relative links to public aliases or canonical GitHub source',()=>{
 const input='# Agent pipeline\n\n[Skill](../../skills/vanya-ui/SKILL.md) [Scroll](../research/workspace-scroll-composition-2026-11-21.md) [Code](../../scripts/ui-pipeline.mjs)';
 const output=publicMarkdown('docs/patterns/ui-feature-pipeline.md',input);
 assert.match(output,/https:\/\/ui\.vanya-arc\.dev\/reference\/agent-skill\.md/);
 assert.match(output,/https:\/\/ui\.vanya-arc\.dev\/reference\/workspaces\.md/);
 assert.match(output,/https:\/\/github\.com\/VanDalkvist\/vanya-ui\/blob\/main\/scripts\/ui-pipeline\.mjs/);
});
test('preserve absolute urls, fragments and source text',()=>{
 const input='[Canonical](https://ui.vanya-arc.dev/) [Section](#overview) [Local](./list-detail-composition.md#acceptance)';
 const output=publicMarkdown('docs/patterns/ui-feature-pipeline.md',input);
 assert.ok(output.includes('](https://ui.vanya-arc.dev/)'));
 assert.ok(output.includes('](#overview)'));
 assert.ok(output.includes('reference/list-detail.md#acceptance'));
 assert.equal(input.includes('reference/list-detail.md'),false);
});

test('stable geometry links resolve to the composition guide',()=>{
 const input='[Geometry](../../docs/composition/working-surfaces.md#11-stable-geometry-during-ordinary-workspace-interaction)';
 assert.equal(publicMarkdown('skills/vanya-ui/SKILL.md',input),'[Geometry](https://ui.vanya-arc.dev/reference/composition.md#11-stable-geometry-during-ordinary-workspace-interaction)');
});

test('route the existing regression guide from the agent skill to its generated public reference',()=>{
 const source='[Regression Gate](../../docs/patterns/regression-gate.md#acceptance)';
 assert.equal(publicMarkdown('skills/vanya-ui/SKILL.md',source),'[Regression Gate](https://ui.vanya-arc.dev/reference/regression-gate.md#acceptance)');
});
