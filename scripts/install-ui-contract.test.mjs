import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {install} from './install-ui-contract.mjs';
test('bootstrap pins consumer CI to immutable Vanya UI and preserves local files',()=>{
 const root=mkdtempSync(join(tmpdir(),'vanya-contract-'));
 try{
  const sha='8d9c63767b04d64784e560e04607c2a4f252d707';
  const out=install(root,sha);
  assert.ok(existsSync(out.workflow));
  const workflow=readFileSync(out.workflow,'utf8');
  assert.match(workflow,new RegExp(sha));
  assert.match(workflow,/^  workflow_dispatch:/m);
  assert.doesNotMatch(workflow,/^  (push|pull_request|schedule|workflow_run|repository_dispatch):/m);
  assert.match(readFileSync(out.policy,'utf8'),/ui-feature-pipeline/);
  assert.throws(()=>install(root,sha),/exists/);
  assert.throws(()=>install(root,'main'),/40-character/);
 }finally{rmSync(root,{recursive:true,force:true})}
});
