import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,symlinkSync,readFileSync,existsSync} from 'node:fs';
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

test('adopt persists the canonical check; verify executes it before build and rejects a missing or fake gate',()=>{
 const project=mkdtempSync(join(tmpdir(),'vanya-harness-adoption-'));
 try{
  mkdirSync(join(project,'src'));mkdirSync(join(project,'node_modules/@vanya'),{recursive:true});
  symlinkSync(library,join(project,'node_modules/@vanya/ui'),'junction');
  const manifest=join(project,'package.json');
  const original={name:'adoption-consumer',type:'module',dependencies:{react:'19','@vanya/ui':'file:'+library},scripts:{build:'node build.mjs','test:e2e':'node browser.mjs',custom:'echo keep'}};
  writeFileSync(manifest,JSON.stringify(original));
  writeFileSync(join(project,'AGENTS.md'),'# Product rules\nKeep the product boundaries.\n');
  writeFileSync(join(project,'build.mjs'),"import {writeFileSync} from 'node:fs';writeFileSync('build-ran','yes');");
  writeFileSync(join(project,'browser.mjs'),"import {writeFileSync} from 'node:fs';writeFileSync('browser-ran','yes');");
  writeFileSync(join(project,'src/App.tsx'),'import {ActionButton} from "@vanya/ui"; export const App=()=> <ActionButton>Save</ActionButton>;');
  const css=join(project,'src/style.css'),valid='@import "@vanya/ui/tokens.css";\n@source "../node_modules/@vanya/ui/src";\n.card {color:var(--ink);font-size:var(--size-md-font);}\n';
  writeFileSync(css,valid);
  const run=(command,...rest)=>spawnSync(process.execPath,[cli,command,'--project',project,...rest],{cwd:tmpdir(),encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024});
  const adopted=run('adopt','--sources','src');assert.equal(adopted.status,0,adopted.stderr+adopted.stdout);
  const config=join(project,'vanya-ui.config.json');
  assert.deepEqual(JSON.parse(readFileSync(config,'utf8')),{schemaVersion:1,sources:['src'],mode:'strict'});
  const pkg=JSON.parse(readFileSync(manifest,'utf8'));
  assert.deepEqual(pkg.dependencies,original.dependencies);assert.deepEqual(pkg.scripts,{...original.scripts,'lint:design':'vanya-ui-lint'});
  const agents=readFileSync(join(project,'AGENTS.md'),'utf8');
  assert.ok(agents.startsWith('# Product rules\nKeep the product boundaries.\n'));assert.match(agents,/Vanya UI/);
  const repeat=run('adopt','--sources','src');assert.equal(repeat.status,0,repeat.stderr+repeat.stdout);
  assert.equal(readFileSync(join(project,'AGENTS.md'),'utf8'),agents);
  const clean=run('verify','--json');assert.equal(clean.status,0,clean.stderr+clean.stdout);
  const evidence=JSON.parse(clean.stdout);
  assert.deepEqual(evidence.checks.map(c=>c.script),['lint:design','build','test:e2e']);
  assert.ok(existsSync(join(project,'build-ran')));assert.ok(existsSync(join(project,'browser-ran')));
  rmSync(join(project,'build-ran'));rmSync(join(project,'browser-ran'));
  writeFileSync(css,valid+'.bad {color:#f123ab;font-size:19px;}\n');
  const failed=run('verify','--json');assert.equal(failed.status,1,failed.stderr+failed.stdout);
  assert.equal(JSON.parse(failed.stdout).checks[0].script,'lint:design');assert.match(failed.stderr,/#f123ab/);
  assert.equal(existsSync(join(project,'build-ran')),false);assert.equal(existsSync(join(project,'browser-ran')),false);
  pkg.scripts['lint:design']='echo fake';writeFileSync(manifest,JSON.stringify(pkg));
  const fake=run('verify','--json');assert.equal(fake.status,1,fake.stderr+fake.stdout);
  assert.match(fake.stdout+fake.stderr,/lint:design/);
  assert.equal(existsSync(join(project,'build-ran')),false);
 }finally{rmSync(project,{recursive:true,force:true})}
});
