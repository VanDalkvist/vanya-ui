import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {inspectProject,checkProject,verifyProject} from './ui-pipeline.mjs';

function fixture(fn){
 const root=mkdtempSync(join(tmpdir(),'portable-ui-'));
 try{return fn(root)}finally{rmSync(root,{force:true,recursive:true})}
}
const file=(root,name,content)=>{const p=join(root,name);mkdirSync(join(p,'..'),{recursive:true});writeFileSync(p,content)};
function react(root,opts={}){
 file(root,'app/package.json',JSON.stringify({name:'demo-ui',type:'module',dependencies:{react:'19',...(opts.dependency===false?{}:{'@vanya/ui':'file:../ui'})},scripts:{build:'node build.mjs','lint:design':'vanya-ui-lint',...(opts.browser===false?{}:{'test:e2e':'node browser.mjs'})}}));
 file(root,'UI_CONTRACT.md','Canonical: Vanya Arc / UI; read skills/vanya-ui/SKILL.md');
 file(root,'app/vanya-ui.config.json',JSON.stringify({schemaVersion:1,sources:['src'],mode:'strict'}));
 mkdirSync(join(root,'app/node_modules/@vanya'),{recursive:true});
 symlinkSync(new URL('../',import.meta.url).pathname,join(root,'app/node_modules/@vanya/ui'),'junction');
 if(opts.tokens!==false)file(root,'app/src/style.css','@import "@vanya/ui/tokens.css";\n@source "../node_modules/@vanya/ui/src";');
 file(root,'app/src/App.jsx',opts.import===false?'export const App=()=>null;':'import {ScrollRegion} from "@vanya/ui"; export const App=()=> <ScrollRegion/>;');
 file(root,'app/build.mjs',"import {mkdirSync,writeFileSync} from 'node:fs';mkdirSync('dist',{recursive:true});writeFileSync('dist/app.css',\":root{--ground:white;--accent:red;--type-body-size:1rem}.ui-size{}.ui-action-button{}.rounded-sm{}\");console.log(\"built\");");
 file(root,'app/browser.mjs','console.log("browser-ok");');
}
// Unit orchestration seam: the networked real runner is exercised by design-harness.e2e.test.mjs.
function verifyWithLint(info){
 let calls=0;
 const result=verifyProject(info,{},({project})=>{
  calls++;assert.equal(project,info.packageRoot);
  return {script:'lint:design',status:'passed',exitCode:0};
 });
 assert.equal(calls,1,'React verify must call the lint port');
 return result;
}
test('React consumer works as portable file tree without a .git directory',()=>fixture(root=>{
 react(root);
 const info=inspectProject({project:root});
 assert.equal(info.mode,'react');assert.equal(info.package,'app');
 assert.equal(info.hasDependency,true);assert.equal(info.hasImport,true);
 assert.equal(checkProject(info).status,'pass');
 const result=verifyWithLint(info);
 assert.equal(result.status,'passed');
 assert.deepEqual(result.checks.map(x=>x.status),['passed','passed','passed','passed']);
 assert.equal(result.visualReview,'NOT_VERIFIED');
}));
test('React missing dependency, import or browser script is rejected',()=>fixture(root=>{
 react(root,{dependency:false,import:false,browser:false});
 const c=checkProject(inspectProject({project:root,mode:'react'}));
 assert.equal(c.status,'fail');assert.ok(c.problems.some(x=>x.includes('@vanya/ui')));
 assert.ok(c.problems.some(x=>x.includes('browser')));
}));
test('SVG-only project uses design reference but does not need React',()=>fixture(root=>{
 file(root,'UI_CONTRACT.md','See Vanya Arc / UI pattern');
 file(root,'public/map.svg','<svg xmlns="http://www.w3.org/2000/svg"></svg>');
 const info=inspectProject({project:root});
 assert.equal(info.mode,'visual');
 assert.equal(checkProject(info).status,'pass');
}));
test('backend-only folder skips UI checks with no git and no npm',()=>fixture(root=>{
 file(root,'src/server.ts','export const ok=true;');
 const info=inspectProject({project:root});
 assert.equal(info.mode,'none');
 assert.equal(checkProject(info).status,'skip');
}));
test('monorepo requires explicit package selection instead of guessing',()=>fixture(root=>{
 react(root);
 file(root,'web/package.json',JSON.stringify({dependencies:{react:'18'}}));
 assert.throws(()=>inspectProject({project:root}),/Multiple UI packages/);
 assert.equal(inspectProject({project:root,packageDir:'app'}).package,'app');
 assert.throws(()=>inspectProject({project:root,packageDir:'../else'}),/inside --project/);
}));
test('dry-run never claims build or browser checks actually ran',()=>fixture(root=>{
 react(root);
 const result=verifyProject(inspectProject({project:root}),{dryRun:true});
 assert.equal(result.status,'planned');
 assert.ok(result.checks.every(x=>x.status==='NOT_RUN'));
 assert.equal(result.visualReview,'NOT_VERIFIED');
}));
test('CLI can run from a different working directory and emit JSON without git or GitHub',()=>fixture(root=>{
 react(root);
 const c=spawnSync(process.execPath,[new URL('./ui-pipeline.mjs',import.meta.url).pathname,'check','--project',root,'--json'],{encoding:'utf8',cwd:tmpdir()});
 assert.equal(c.status,0,c.stderr);
 const o=JSON.parse(c.stdout);assert.equal(o.status,'pass');
}));

test('floating Vanya UI dependency is rejected even when imported',()=>fixture(root=>{
 react(root);
 const path=join(root,'app/package.json');
 const data=JSON.parse(readFileSync(path,'utf8'));
 data.dependencies['@vanya/ui']='github:VanDalkvist/vanya-ui#main';
 writeFileSync(path,JSON.stringify(data));
 const result=checkProject(inspectProject({project:root}));
 assert.equal(result.status,'fail');
 assert.ok(result.problems.some(x=>x.includes('immutable')));
}));

import {createAcceptancePlan,reviewAcceptance,criteria} from './ui-acceptance.mjs';
function completePlan(scope='feature'){
 const plan=createAcceptancePlan({task:'Fix catalog spacing',target:'/catalog',scope,libraryVersion:'0.4.2'});
 for(const row of plan.criteria){
  row.status='PASS';row.evidence=[{method:row.method,target:'/catalog',observation:'Fixture observation',viewport:'390x844',theme:'dark',command:'npm run build'}];
 }
 return plan;
}
test('task receipt is incomplete until each criterion is assessed',()=>{
 const p=createAcceptancePlan({task:'Fix spacing',target:'/catalog'});
 assert.equal(p.criteria.length,14);
 assert.equal(reviewAcceptance(p).status,'incomplete');
 assert.equal(reviewAcceptance(p).unresolved.length,14);
 assert.throws(()=>createAcceptancePlan({task:'Fix spacing'}),/--target/);
});
test('receipt rejects missing/duplicate IDs, invalid exclusion and missing evidence',()=>{
 const p=completePlan();
 assert.equal(reviewAcceptance(p).status,'recorded');
 p.criteria[0].status='N/A';p.criteria[0].reason='not applicable';
 p.criteria[2].evidence=[];
 p.criteria[3].status='N/A';p.criteria[3].reason='';
 p.criteria.push(p.criteria[1]);p.criteria.splice(4,1);
 const r=reviewAcceptance(p);
 assert.equal(r.status,'invalid');
 for(const re of [/Duplicate/,/Missing criterion/,/cannot be N\/A/,/PASS requires/,/N\/A requires/])assert.ok(r.errors.some(x=>re.test(x)));
});
test('migration requires composition, typography, interaction and execution rows; scoped feature can exclude unrelated shortcuts',()=>{
 const p=completePlan();const row=p.criteria.find(x=>x.id==='UI-10');row.status='N/A';row.reason='No shortcut changed or affected';
 assert.equal(reviewAcceptance(p).status,'recorded');
 p.scope='migration';p.criteria.find(x=>x.id==='UI-03').status='N/A';p.criteria.find(x=>x.id==='UI-03').reason='none';
 assert.equal(reviewAcceptance(p).status,'invalid');
});
test('browser evidence and unresolved failures cannot be silently accepted',()=>{
 const p=completePlan();delete p.criteria.find(x=>x.id==='UI-11').evidence[0].viewport;
 assert.equal(reviewAcceptance(p).status,'invalid');
 const q=completePlan();q.criteria[6].status='NOT_VERIFIED';q.criteria[6].reason='Browser unavailable';
 assert.equal(reviewAcceptance(q).status,'incomplete');
 assert.equal(reviewAcceptance(q).visualReview,'DECLARED_ONLY');
});
test('plan and review CLI work without git or project dependencies',()=>fixture(root=>{
 const script=new URL('./ui-pipeline.mjs',import.meta.url).pathname;
 const p=spawnSync(process.execPath,[script,'plan','--task','Adjust card','--target','/cards'],{encoding:'utf8'});
 assert.equal(p.status,0,p.stderr);
 const plan=JSON.parse(p.stdout);file(root,'receipt.json',JSON.stringify(plan));
 const r=spawnSync(process.execPath,[script,'review','--receipt',join(root,'receipt.json')],{encoding:'utf8'});
 assert.equal(r.status,1,r.stderr);assert.equal(JSON.parse(r.stdout).status,'incomplete');
}));
test('inspect reports declared and installed versions and supports explicit arbitrary package path',()=>fixture(root=>{
 react(root);const pkg=JSON.parse(readFileSync(join(root,'app/package.json'),'utf8'));
 file(root,'nested/product/package.json',JSON.stringify(pkg));
 file(root,'nested/product/src/App.jsx','import {ScrollRegion} from "@vanya/ui"; import "@vanya/ui/tokens.css";');
 file(root,'nested/product/node_modules/@vanya/ui/package.json',JSON.stringify({name:'@vanya/ui',version:'0.0.1'}));
 const info=inspectProject({project:root,packageDir:'nested/product'});
 assert.equal(info.installedVersion,'0.0.1');assert.equal(info.dependencySpec,'file:../ui');assert.equal(info.hasTokensImport,true);
 assert.ok(checkProject(info).warnings.some(x=>x.includes('differs from local guides')));
}));
test('acceptance canonical documents exist locally',()=>{for(const c of criteria)assert.ok(readFileSync(new URL('../'+c.canonical,import.meta.url),'utf8').length>0,c.canonical)});

test('new scope plans an empty directory in explicit React mode',()=>fixture(root=>{
 const script=new URL('./ui-pipeline.mjs',import.meta.url).pathname;
 const r=spawnSync(process.execPath,[script,'plan','--project',root,'--scope','new','--task','Create product','--target','/'],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);const p=JSON.parse(r.stdout);
 assert.equal(p.scope,'new');assert.equal(p.targetProject.mode,'react');assert.equal(p.targetProject.project,root);
 const empty=inspectProject({project:root,mode:'react'});assert.equal(empty.mode,'react');assert.equal(checkProject(empty).status,'fail');
 p.criteria.find(x=>x.id==='UI-03').status='N/A';p.criteria.find(x=>x.id==='UI-03').reason='skip';
 assert.ok(reviewAcceptance(p,{projectInfo:empty}).errors.some(x=>x.includes('UI-03')));
}));
test('project-bound React feature cannot exclude execution; actual verify result required',()=>fixture(root=>{
 react(root);const info=inspectProject({project:root});
 const p=completePlan();p.targetProject={project:root,package:'app',mode:'react'};
 const row=p.criteria.find(x=>x.id==='UI-13');row.status='N/A';row.reason='skip build';
 assert.ok(reviewAcceptance(p,{projectInfo:info}).errors.some(x=>x.includes('UI-13')));
 row.status='PASS';
 assert.equal(reviewAcceptance(p,{projectInfo:info}).status,'invalid');
 const planned=verifyProject(info,{dryRun:true});
 assert.equal(reviewAcceptance(p,{projectInfo:info,verification:planned}).status,'invalid');
 const executed=verifyWithLint(info);
 assert.equal(reviewAcceptance(p,{projectInfo:info,verification:executed}).status,'recorded');
 assert.equal(reviewAcceptance(p,{projectInfo:info,verification:{...executed,project:'/wrong'}}).status,'invalid');
 assert.equal(reviewAcceptance(p,{projectInfo:info,verification:{...executed,checks:executed.checks.slice(0,1)}}).status,'invalid');
 assert.equal(reviewAcceptance(p).status,'invalid');
}));
test('project-bound static visual artifact may exclude non-executable build',()=>fixture(root=>{
 file(root,'UI_CONTRACT.md','Vanya UI');file(root,'image.svg','<svg/>');
 const info=inspectProject({project:root,mode:'visual'});
 const p=completePlan();p.targetProject={project:root,mode:'visual',package:null};
 const row=p.criteria.find(x=>x.id==='UI-13');row.status='N/A';row.reason='Static SVG, no package or build';
 const r=reviewAcceptance(p,{projectInfo:info});assert.equal(r.status,'recorded');assert.equal(r.projectBinding,'CHECKED');
}));
test('new product CLI review consumes actual verify JSON and rejects a planned result',()=>fixture(root=>{
 react(root);const script=new URL('./ui-pipeline.mjs',import.meta.url).pathname;
 const p=completePlan('new');p.targetProject={project:root,mode:'react',package:'app'};
 file(root,'receipt.json',JSON.stringify(p));
 const args=[script,'verify','--project',root,'--mode','react','--package','app','--json'];
 const v=verifyWithLint(inspectProject({project:root,mode:'react',packageDir:'app'}));assert.equal(v.status,'passed');file(root,'verify.json',JSON.stringify(v));
 const review=[script,'review','--receipt',join(root,'receipt.json'),'--verification',join(root,'verify.json')];
 const good=spawnSync(process.execPath,review,{encoding:'utf8'});assert.equal(good.status,0,good.stderr+good.stdout);
 const dry=spawnSync(process.execPath,[...args,'--dry-run'],{encoding:'utf8'});file(root,'verify.json',dry.stdout);
 const bad=spawnSync(process.execPath,review,{encoding:'utf8'});assert.equal(bad.status,1,bad.stderr);assert.equal(JSON.parse(bad.stdout).status,'invalid');
}));

test('token hookup is mandatory for React; comments do not satisfy it',()=>fixture(root=>{
 react(root,{tokens:false});
 const inspect=()=>inspectProject({project:root});
 assert.equal(inspect().hasTokensImport,false);
 assert.ok(checkProject(inspect()).problems.some(x=>x.includes('tokens.css')));
 file(root,'app/src/style.css','/* @import "@vanya/ui/tokens.css"; */');
 file(root,'app/src/unused.ts','// import "@vanya/ui/tokens.css";');
 assert.equal(inspect().hasTokensImport,false);
 file(root,'app/src/style.css','@import url("@vanya/ui/tokens.css");\n@source "../node_modules/@vanya/ui/src";');
 const info=inspect();
 assert.equal(info.hasTokensImport,true);
 assert.equal(info.hasTailwindSource,true);
 assert.deepEqual(info.tokenImportFiles,['src/style.css']);
 assert.equal(checkProject(info).status,'pass');
 file(root,'app/src/style.css','');
 file(root,'app/src/main.ts','import "@vanya/ui/tokens.css";');
 assert.equal(inspect().hasTokensImport,true);
 assert.ok(checkProject(inspect()).warnings.some(x=>x.includes('@source')));
}));

test('new receipt requires strict and current execution evidence',()=>fixture(root=>{
 react(root);const info=inspectProject({project:root});
 const p=completePlan('new');p.targetProject={project:root,package:'app',mode:'react'};
 const executed=verifyWithLint(info);
 assert.equal(reviewAcceptance(p,{projectInfo:info,verification:executed}).status,'recorded');
 const baseline={...info,designHarness:{...info.designHarness,config:{...info.designHarness.config,mode:'baseline'}}};
 assert.equal(reviewAcceptance(p,{projectInfo:baseline,verification:executed}).status,'invalid');
 const stale={...info,hasTokensImport:false,pinnedDependency:false};
 assert.equal(reviewAcceptance(p,{projectInfo:stale,verification:executed}).status,'invalid');
}));

function contributorFixture(root,{fail,missing,name='@vanya/ui'}={}){
 const steps=['test','typecheck','build','lint:design:pilot'];
 file(root,'package.json',JSON.stringify({name,type:'module',scripts:Object.fromEntries(steps.filter(s=>s!==missing).map(s=>[s,'node step.mjs '+s]))}));
 file(root,'step.mjs',"import {appendFileSync} from 'node:fs';const step=process.argv[2];appendFileSync('executed.txt',step+'\\n');if(step==="+JSON.stringify(fail??null)+")process.exit(7);");
 const invoke=(...args)=>spawnSync(process.execPath,[new URL('./ui-pipeline.mjs',import.meta.url).pathname,'contribute','--project',root,'--json',...args],{encoding:'utf8',cwd:tmpdir()});
 return {invoke,steps};
}
test('contributor executes existing library verification scripts in a portable directory without Git',()=>fixture(root=>{
 const {invoke,steps}=contributorFixture(root);
 const result=invoke();
 assert.equal(result.status,0,result.stderr);
 assert.deepEqual(readFileSync(join(root,'executed.txt'),'utf8').trim().split('\n'),steps);
 const report=JSON.parse(result.stdout);
 assert.equal(report.status,'passed');
 assert.deepEqual(report.checks.map(x=>x.script),steps);
 assert.equal(report.visualReview,'NOT_VERIFIED');
}));
test('contributor stops on real failed script and dry-run does not execute',()=>fixture(root=>{
 const {invoke,steps}=contributorFixture(root,{fail:'typecheck'});
 const dry=invoke('--dry-run');
 assert.equal(dry.status,0,dry.stderr);
 assert.equal(JSON.parse(dry.stdout).status,'planned');
 assert.deepEqual(JSON.parse(dry.stdout).checks.map(x=>x.script),steps);
 assert.throws(()=>readFileSync(join(root,'executed.txt')),/ENOENT/);
 const result=invoke();
 assert.notEqual(result.status,0);
 assert.deepEqual(readFileSync(join(root,'executed.txt'),'utf8').trim().split('\n'),['test','typecheck']);
 assert.equal(JSON.parse(result.stdout).checks.at(-1).exitCode,7);
}));
test('contributor rejects consumer packages and incomplete library scripts before execution',()=>fixture(root=>{
 const {invoke}=contributorFixture(root,{name:'consumer'});
 assert.notEqual(invoke().status,0);
 assert.throws(()=>readFileSync(join(root,'executed.txt')),/ENOENT/);
 contributorFixture(root,{missing:'build'});
 const result=invoke();
 assert.notEqual(result.status,0);
 assert.equal(JSON.parse(result.stdout).status,'blocked');
 assert.throws(()=>readFileSync(join(root,'executed.txt')),/ENOENT/);
}));

test('canonical installed CLI symlink runs help, version and actual commands',()=>fixture(root=>{
 const manifest=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert.deepEqual(manifest.bin,{vui:'./scripts/ui-pipeline.mjs','vanya-ui-lint':'./scripts/design-harness-bin.mjs'});
 assert.equal(manifest.scripts['test:consumer'],'node scripts/consumer-smoke.mjs');
 assert.equal(manifest.scripts['test:harness:consumer'],undefined);
 const target=new URL('./ui-pipeline.mjs',import.meta.url).pathname;
 const executable=join(root,'vui');
 symlinkSync(target,executable,'file');
 const run=(...args)=>spawnSync(process.execPath,[executable,...args],{encoding:'utf8',cwd:root});
 const help=run('--help');assert.equal(help.status,0,help.stderr);assert.match(help.stdout,/Consumer commands:/);assert.match(help.stdout,/Contributor command:/);
 const sub=run('contribute','--help');assert.equal(sub.status,0,sub.stderr);assert.match(sub.stdout,/Usage: vui contribute/);
 assert.equal(run('--version').stdout.trim(),manifest.version);
 const check=run('inspect','--project',root,'--json');assert.equal(check.status,0,check.stderr);assert.equal(JSON.parse(check.stdout).project,root);
 assert.notEqual(run('not-a-command','--help').status,0);
}));

test('invalid mutation options are rejected before modifying a project',()=>fixture(root=>{
 react(root);
 const app=join(root,'app'), manifest=join(app,'package.json'), config=join(app,'vanya-ui.config.json'), agents=join(app,'AGENTS.md');
 const before=[manifest,config].map(p=>readFileSync(p,'utf8'));
 const cli=new URL('./ui-pipeline.mjs',import.meta.url).pathname;
 const run=(...args)=>spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8'});
 for(const args of [
  ['adopt','--project',root,'--sources','src','--dry-run'],
  ['baseline','--project',root,'--dry-run'],
  ['adopt','--project',root,'--project',root,'--sources','src'],
  ['inspect','--project',root,'--scope','new']
 ]){
  const result=run(...args);
  assert.equal(result.status,1,result.stdout+result.stderr);
  assert.match(result.stderr,/Unsupported option|Duplicate option/);
  assert.deepEqual([manifest,config].map(p=>readFileSync(p,'utf8')),before);
  assert.throws(()=>readFileSync(agents,'utf8'),/ENOENT/);
 }
}));
test('new product requires an explicit identity applicability observation',()=>fixture(root=>{
 react(root);
 const info=inspectProject({project:root});
 const receipt=completePlan('new');receipt.targetProject={project:root,package:'app',mode:'react'};
 const verified=verifyWithLint(info);
 const identity=receipt.criteria.find(row=>row.id==='UI-12');
 identity.status='N/A';identity.reason='Skipped';
 assert.ok(reviewAcceptance(receipt,{projectInfo:info,verification:verified}).errors.some(e=>e.includes('UI-12')));
 identity.status='PASS';identity.evidence=[{method:'source',target:'src/App.jsx',observation:'Independent application; own identity and source rights reviewed'}];
 assert.equal(reviewAcceptance(receipt,{projectInfo:info,verification:verified}).status,'recorded');
 receipt.scope='feature';identity.status='N/A';identity.reason='No branding changes';
 assert.equal(reviewAcceptance(receipt,{projectInfo:info,verification:verified}).status,'recorded');
}));
test('CLI help exposes actual canonical resource paths and workflow commands',()=>fixture(root=>{
 const result=spawnSync(process.execPath,[new URL('./ui-pipeline.mjs',import.meta.url).pathname,'--help'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 assert.match(result.stdout,/inspect.*plan.*verify.*review/);
 assert.match(result.stdout,/contribute.*--project/);
 const sub=spawnSync(process.execPath,[new URL('./ui-pipeline.mjs',import.meta.url).pathname,'contribute','--project',root,'--help'],{cwd:root,encoding:'utf8'});
 assert.equal(sub.status,0,sub.stderr);assert.match(sub.stdout,/Contributor guide: /);
 const skill=result.stdout.split('\n').find(line=>line.startsWith('Skill: '))?.slice(7);
 assert.ok(skill);assert.ok(readFileSync(skill,'utf8').includes('name: vanya-ui'));
}));

test('linked JSON data does not block React inspection, contract checks or verify planning',()=>fixture(root=>{
 react(root);
 file(root,'shared/registry.json','{"id":"shared"}');
 const data=join(root,'app/src/registry.json');
 symlinkSync(join(root,'shared/registry.json'),data,'file');
 const cli=new URL('./ui-pipeline.mjs',import.meta.url).pathname;
 const run=(...args)=>spawnSync(process.execPath,[cli,...args,'--project',root,'--json'],{cwd:root,encoding:'utf8'});
 const inspected=run('inspect');
 assert.equal(inspected.status,0,inspected.stderr+inspected.stdout);
 const info=JSON.parse(inspected.stdout);
 assert.equal(info.mode,'react');assert.equal(info.package,'app');assert.equal(info.hasTokensImport,true);
 const checked=run('check');assert.equal(checked.status,0,checked.stderr+checked.stdout);
 const planned=run('verify','--dry-run');assert.equal(planned.status,0,planned.stderr+planned.stdout);
 assert.equal(JSON.parse(planned.stdout).status,'planned');
 assert.equal(readFileSync(data,'utf8'),'{"id":"shared"}');
}));
test('authored source and directory symlinks remain blocked',()=>fixture(root=>{
 react(root);
 file(root,'shared/Outside.jsx','export const Outside=()=>null;');
 const linked=join(root,'app/src/Outside.jsx');
 symlinkSync(join(root,'shared/Outside.jsx'),linked,'file');
 assert.throws(()=>inspectProject({project:root}),/Unsupported authored symlink: src\/Outside\.jsx/);
 rmSync(linked);
 symlinkSync(join(root,'shared'),join(root,'app/src/data.json'),'junction');
 assert.throws(()=>inspectProject({project:root}),/Unsupported authored symlink: src\/data\.json/);
}));
