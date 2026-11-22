import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
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
 file(root,'app/package.json',JSON.stringify({name:'demo-ui',type:'module',dependencies:{react:'19',...(opts.dependency===false?{}:{'@vanya/ui':'file:../ui'})},scripts:{build:'node build.mjs',...(opts.browser===false?{}:{'test:e2e':'node browser.mjs'})}}));
 file(root,'UI_CONTRACT.md','Canonical: Vanya Arc / UI; read skills/vanya-ui/SKILL.md');
 file(root,'app/src/App.jsx',opts.import===false?'export const App=()=>null;':'import {ScrollRegion} from "@vanya/ui"; export const App=()=>ScrollRegion;');
 file(root,'app/build.mjs','console.log("built");');
 file(root,'app/browser.mjs','console.log("browser-ok");');
}
test('React consumer works as portable file tree without a .git directory',()=>fixture(root=>{
 react(root);
 const info=inspectProject({project:root});
 assert.equal(info.mode,'react');assert.equal(info.package,'app');
 assert.equal(info.hasDependency,true);assert.equal(info.hasImport,true);
 assert.equal(checkProject(info).status,'pass');
 const result=verifyProject(info);
 assert.equal(result.status,'passed');
 assert.deepEqual(result.checks.map(x=>x.status),['passed','passed']);
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
