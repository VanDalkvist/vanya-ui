import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const library=fileURLToPath(new URL('../',import.meta.url));
const cli=join(library,'scripts/ui-pipeline.mjs');
test('public consumer lint runs actual installed design tools, detects bad CSS and fails closed without installation',()=>{
 const project=mkdtempSync(join(tmpdir(),'vanya-harness-consumer-'));
 try{
  mkdirSync(join(project,'src'));
  mkdirSync(join(project,'node_modules/@vanya'),{recursive:true});
  symlinkSync(library,join(project,'node_modules/@vanya/ui'),'junction');
  writeFileSync(join(project,'package.json'),JSON.stringify({name:'harness-consumer',type:'module',dependencies:{react:'19','@vanya/ui':'file:'+library}}));
  writeFileSync(join(project,'src/App.tsx'),'import {ActionButton} from "@vanya/ui"; export const App=()=> <ActionButton className="flex items-center">Save</ActionButton>;');
  const css=join(project,'src/style.css');
  const valid='@import "@vanya/ui/tokens.css";\n@source "../node_modules/@vanya/ui/src";\n.card { color:var(--ink); font-size:var(--size-md-font); width:173px; }\n';
  writeFileSync(css,valid);
  const run=()=>spawnSync(process.execPath,[cli,'lint','--project',project,'--sources','src'],{cwd:tmpdir(),encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024});
  const good=run();
  assert.equal(good.status,0,good.stderr+good.stdout);
  assert.match(good.stdout+good.stderr,/Stylelint total=0/);
  writeFileSync(css,valid+'.bad { color:#f123ab; font-size:19px; }\n');
  const bad=run();
  assert.equal(bad.status,1,bad.stderr+bad.stdout);
  assert.match(bad.stderr+bad.stdout,/new=2/);
  assert.match(bad.stderr+bad.stdout,/#f123ab/);
  assert.match(bad.stderr+bad.stdout,/19px/);
  rmSync(join(project,'node_modules/@vanya/ui'));
  const missing=run();
  assert.equal(missing.status,1,missing.stderr+missing.stdout);
  assert.match(missing.stderr+missing.stdout,/installed @vanya\/ui/i);
 }finally{rmSync(project,{recursive:true,force:true})}
});
