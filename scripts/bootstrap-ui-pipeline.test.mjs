import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {bootstrap} from './bootstrap-ui-pipeline.mjs';
test('local agent bootstrap works with no git and does not alter CI',()=>{
 const root=mkdtempSync(join(tmpdir(),'agent-ui-project-'));
 try{
  const first=bootstrap(root);
  assert.equal(first.created.length,2);
  const skill=readFileSync(join(root,'.agents/skills/vanya-ui/SKILL.md'),'utf8');
  assert.match(skill,/ui-pipeline\.mjs/);
  assert.doesNotMatch(skill,/github\.com/);
  assert.match(readFileSync(join(root,'UI_CONTRACT.md'),'utf8'),/check --project/);
  assert.match(readFileSync(join(root,'UI_CONTRACT.md'),'utf8'),/node \"[^\"]+ui-pipeline\.mjs\" check/);
  writeFileSync(join(root,'UI_CONTRACT.md'),'keep original');
  const second=bootstrap(root);
  assert.equal(second.created.length,0);
  assert.equal(readFileSync(join(root,'UI_CONTRACT.md'),'utf8'),'keep original');
 }finally{rmSync(root,{recursive:true,force:true})}
});
