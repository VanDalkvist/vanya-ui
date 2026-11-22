import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {inspectProject,checkProject} from '../../../scripts/ui-pipeline.mjs';
test('optional action uses the same provider-neutral file contract',()=>{
 const root=mkdtempSync(join(tmpdir(),'ui-adapter-'));
 try{
  mkdirSync(join(root,'src'),{recursive:true});
  writeFileSync(join(root,'UI_CONTRACT.md'),'Vanya Arc / UI local policy');
  writeFileSync(join(root,'src/figure.svg'),'<svg/>');
  const result=checkProject(inspectProject({project:root}));
  assert.equal(result.status,'pass');
 }finally{rmSync(root,{recursive:true,force:true})}
});
