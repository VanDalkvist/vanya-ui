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
