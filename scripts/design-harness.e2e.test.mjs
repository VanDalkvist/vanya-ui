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
  const planned=run('plan','--scope','new','--task','Create demo','--target','/','--mode','react');
  assert.equal(planned.status,0,planned.stderr);
  const receipt=JSON.parse(planned.stdout);
  // This tests the machine evidence validator, not actual browser visual truth.
  for(const row of receipt.criteria){row.status='PASS';row.evidence=[{method:row.method,target:'/',observation:'validator fixture',command:'fixture',viewport:'390x844',theme:'light'}]}
  writeFileSync(join(project,'receipt.json'),JSON.stringify(receipt));
  writeFileSync(join(project,'verification.json'),clean.stdout);
  const review=()=>run('review','--receipt',join(project,'receipt.json'),'--verification',join(project,'verification.json'));
  assert.equal(review().status,0);
  writeFileSync(join(project,'verification.json'),JSON.stringify({...evidence,checks:evidence.checks.filter(c=>c.script!=='lint:design')}));
  const noLint=review();assert.equal(noLint.status,1,noLint.stderr+noLint.stdout);assert.match(noLint.stdout,/UI-13/);
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

test('existing consumer explicitly captures CSS and JSX debt, rejects regression and missing baseline',()=>{
 const project=mkdtempSync(join(tmpdir(),'vanya-harness-baseline-'));
 try{
  mkdirSync(join(project,'src'));mkdirSync(join(project,'node_modules/@vanya'),{recursive:true});
  symlinkSync(library,join(project,'node_modules/@vanya/ui'),'junction');
  writeFileSync(join(project,'package.json'),JSON.stringify({name:'legacy-consumer',type:'module',dependencies:{react:'19','@vanya/ui':'file:'+library}}));
  const jsx=join(project,'src/App.tsx'),css=join(project,'src/style.css');
  const badJsx='import {ActionButton} from "@vanya/ui"; export const App=()=> <ActionButton className="bg-pink-500 text-[19px]">Save</ActionButton>;\n';
  const badCss='@import "@vanya/ui/tokens.css";\n.bad { color:#f123ab; font-size:19px; }\n';
  writeFileSync(jsx,badJsx);writeFileSync(css,badCss);
  const run=(command,...rest)=>spawnSync(process.execPath,[cli,command,'--project',project,...rest],{cwd:tmpdir(),encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024});
  assert.equal(run('adopt','--sources','src').status,0);
  const capture=run('baseline');assert.equal(capture.status,0,capture.stderr+capture.stdout);
  const config=JSON.parse(readFileSync(join(project,'vanya-ui.config.json'),'utf8'));assert.equal(config.mode,'baseline');
  const baseline=join(project,'vanya-ui.baseline.json');
  const original=readFileSync(baseline,'utf8'),data=JSON.parse(original);
  assert.equal(data.schemaVersion,1);assert.ok(data.entries.some(e=>e.file==='src/App.tsx'&&e.rule.includes('no-raw-colors')));assert.ok(data.entries.some(e=>e.file==='src/style.css'&&e.message.includes('#f123ab')));
  const same=run('lint');assert.equal(same.status,0,same.stderr+same.stdout);
  const recapture=run('baseline');assert.equal(recapture.status,1);assert.equal(readFileSync(baseline,'utf8'),original);
  writeFileSync(css,badCss+'.new {color:#f123ab;}\n');
  const cssFail=run('lint');assert.equal(cssFail.status,1,cssFail.stdout+cssFail.stderr);assert.match(cssFail.stdout+cssFail.stderr,/new=1/);
  writeFileSync(css,badCss);writeFileSync(jsx,badJsx+'export const New=()=> <div className="bg-pink-500 text-[19px]"/>;\n');
  const jsxFail=run('lint');assert.equal(jsxFail.status,1,jsxFail.stdout+jsxFail.stderr);assert.match(jsxFail.stdout+jsxFail.stderr,/no-raw-colors/);
  rmSync(baseline);const missing=run('lint');assert.equal(missing.status,1);assert.match(missing.stderr+missing.stdout,/baseline/i);
 }finally{rmSync(project,{recursive:true,force:true})}
});
