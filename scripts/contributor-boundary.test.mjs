import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cli=fileURLToPath(new URL('./ui-pipeline.mjs',import.meta.url));
function fixture(t){
 const dir=mkdtempSync(join(tmpdir(),'ui-contribution-')),root=join(dir,'library'),policy=join(dir,'policy.json');
 mkdirSync(root);t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',['-C',root,...args],{stdio:'pipe'}).toString().trim();
 const put=(name,value)=>writeFileSync(join(root,name),value);
 git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
 put('README.md','Reusable control');put('.gitignore','dist/\n');git('add','.');git('commit','-qm','base');
 const base=git('rev-parse','HEAD');
 const secret='example-'+ 'internal-identifier';
 writeFileSync(policy,JSON.stringify({schemaVersion:1,identifiers:[secret]}));
 const run=(phase,...args)=>{
  const p=spawnSync(process.execPath,[cli,'contribute','--phase',phase,'--project',root,'--json',...args],{encoding:'utf8'});
  assert.ok(p.stdout,p.stderr);const result=JSON.parse(p.stdout);
  assert.ok(!p.stdout.includes(secret));assert.ok(!p.stdout.includes(dir));assert.ok(!p.stderr.includes(secret));
  return {code:p.status,result};
 };
 return {root,policy,base,secret,git,put,run};
}
test('source and compiled gates inspect distinct actual files',t=>{
 const x=fixture(t);
 assert.equal(x.run('source').code,0);
 assert.notEqual(x.run('built').code,0);
 mkdirSync(join(x.root,'dist'));x.put('dist/index.html','<h1>Demo</h1>');
 assert.equal(x.run('built').code,0);
 x.put('dist/index.html',x.secret);
 const bad=x.run('built','--policy',x.policy);assert.equal(bad.code,1);assert.equal(bad.result.checks.find(c=>c.id==='PUB-02').status,'FAIL');
});
test('owner preflight detects outgoing intermediate commits and staged files without leaking values',t=>{
 const x=fixture(t);x.put('README.md',x.secret);x.git('add','.');x.git('commit','-qm','candidate');
 x.put('README.md','Reusable control');x.git('add','.');x.git('commit','-qm','cleanup');
 const bad=x.run('preflight','--base',x.base,'--policy',x.policy);assert.equal(bad.code,1);assert.equal(bad.result.coverage.outgoingCommits,2);
 assert.equal(bad.result.checks.find(c=>c.id==='PUB-02').status,'FAIL');
 assert.equal(x.run('preflight','--base',x.base).code,1);
});
test('clean staged contribution passes, local dependency and private filename fail',t=>{
 const x=fixture(t);x.put('new.md','General pattern');x.git('add','new.md');
 assert.equal(x.run('preflight','--base',x.base,'--policy',x.policy).code,0);
 x.put(x.secret+'.md','generic');x.git('add','.');
 assert.equal(x.run('preflight','--base',x.base,'--policy',x.policy).code,1);
 x.put('package.json',JSON.stringify({dependencies:{fixture:'file:'+'../outside'}}));x.git('add','package.json');
 assert.equal(x.run('source').result.checks.find(c=>c.id==='PUB-03').status,'FAIL');
});
