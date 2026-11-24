import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {validateReleaseVersion} from './check-release.mjs';
const good='# Changelog\n\n## [Unreleased]\n\n## [0.2.0] - 2026-11-22\n\n### Added\n- Breadcrumbs\n';
test('local offline release check validates source version and changelog',()=>{
 const dir=mkdtempSync(join(tmpdir(),'vanya-ui-release-'));
 try{
  writeFileSync(join(dir,'package.json'),JSON.stringify({name:'@vanya/ui',version:'0.2.0'}));
  writeFileSync(join(dir,'CHANGELOG.md'),good);
  assert.equal(validateReleaseVersion(dir).ok,true);
  writeFileSync(join(dir,'package.json'),JSON.stringify({name:'@vanya/ui',version:'0.3.0'}));
  assert.match(validateReleaseVersion(dir).errors.join(' '),/does not match/);
  writeFileSync(join(dir,'package.json'),JSON.stringify({name:'@vanya/ui',version:'main'}));
  assert.match(validateReleaseVersion(dir).errors.join(' '),/exact SemVer/);
  writeFileSync(join(dir,'package.json'),JSON.stringify({name:'@vanya/ui',version:'0.2.0'}));
  writeFileSync(join(dir,'CHANGELOG.md'),good.replace('## [Unreleased]','## [Future]'));
  assert.match(validateReleaseVersion(dir).errors.join(' '),/Unreleased/);
 }finally{rmSync(dir,{recursive:true,force:true})}
});

// Check the actual source-package contract separately from the generic release fixture.
test('package metadata resolves one source entrypoint and existing public files',async()=>{
 const {readFileSync,existsSync}=await import('node:fs');
 const {fileURLToPath}=await import('node:url');
 const root=fileURLToPath(new URL('../',import.meta.url));
 const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
 const entry=pkg.exports['.'];
 assert.equal(pkg.type,'module');
 assert.equal(Object.keys(entry)[0],'types');
 for(const path of [pkg.main,pkg.module,pkg.types,entry.types,entry.import]){
  assert.equal(path,'./src/index.ts');
  assert.ok(existsSync(join(root,path)),path);
 }
 assert.equal(pkg.exports['./tokens.css'],'./src/tokens.css');
 assert.ok(existsSync(join(root,pkg.exports['./tokens.css'])));
 assert.equal(entry.require,undefined);
});


test('consumer smoke fixture has independent exact-SHA installs and real client/SSR inputs',async()=>{
 const {fixture,matrix}=await import('./consumer-smoke.mjs');
 const sha='ef40f50e9f62a4780c35181391c0309fe50fee5e';
 assert.deepEqual(matrix.map(x=>x.manager),['npm','bun']);
 assert.throws(()=>fixture('main',matrix[0]),/40-character/);
 for(const row of matrix){
  const files=fixture(sha,row),pkg=JSON.parse(files['package.json']);
  assert.equal(pkg.dependencies['@vanya/ui'],'https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/'+sha);
  assert.equal(pkg.dependencies.react,row.react);
  assert.equal(pkg.dependencies['react-dom'],row.react);
  assert.match(files['src/App.tsx'],/SegmentedControl/);
  assert.match(files['src/style.css'],/@source/);
  assert.match(files['src/entry-server.tsx'],/renderToString/);
  assert.match(files['vite.config.mjs'],/noExternal/);
 }
});


test('consumer CSS oracle checks emitted tokens and rejects missing library or utility',async()=>{
 const {assertConsumerCss}=await import('./consumer-smoke.mjs');
 const css=':root{--accent: red}.ui-action-button:active{color:var(--accent)}.rounded-sm{border-radius:2px}';
 assert.doesNotThrow(()=>assertConsumerCss(css));
 for(const token of ['--accent:','.ui-action-button','.rounded-sm'])assert.throws(()=>assertConsumerCss(css.replace(token,'missing')),/Expected shared CSS/);
});


test('consumer lock oracle binds direct requested and resolved package; unrelated SHA cannot pass',async()=>{
 const {assertConsumerLock}=await import('./consumer-smoke.mjs');
 const sha='ef40f50e9f62a4780c35181391c0309fe50fee5e';
 const url='https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/'+sha;
 const npm=JSON.stringify({packages:{'':{dependencies:{'@vanya/ui':url}},'node_modules/@vanya/ui':{resolved:url},'node_modules/unrelated':{resolved:url}}});
 const bun='{\n "workspaces": {\n  "": {\n   "dependencies": {\n    "@vanya/ui": "'+url+'",\n   },\n  },\n },\n "packages": {\n  "@vanya/ui": ["@vanya/ui@'+url+'", {}, "sha512-synthetic"],\n  "unrelated": ["unrelated@'+url+'", {}, "sha512-synthetic"],\n },\n}';
 for(const [manager,lock] of [['npm',npm],['bun',bun]]){
  assert.doesNotThrow(()=>assertConsumerLock(lock,manager,sha));
  assert.throws(()=>assertConsumerLock(lock.replace(url,url.replace(sha,'0'.repeat(40))),manager,sha),/Direct consumer dependency/);
  const wrong=lock.replace(manager==='npm'?'"resolved":"'+url+'"':'"@vanya/ui@'+url+'"',manager==='npm'?'"resolved":"https://example.invalid/wrong"':'"@vanya/ui@https://example.invalid/wrong"');
  assert.notEqual(wrong,lock);
  assert.throws(()=>assertConsumerLock(wrong,manager,sha),/Direct consumer dependency/);
 }
});
