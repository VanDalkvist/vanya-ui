import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {finalizePublishedLicenses} from './finalize-published-licenses.mjs';

const pin='6c6a3d2d1b25e212817c354b2ee76163c4a64fab';
const terms=[
 'Vanya Arc Brand Artwork — Reserved Rights and Limited Permitted Uses',
 'The official artwork is not granted under MIT.',
 'Previous historically distributed copies retain MIT rights.'
].join('\n');
const inventory='# Licenses\n\n## @vanya/brand - 0.1.0 (SEE LICENSE IN LICENSING.md)\n\nMIT License\n\n'+
 '## lucide-react - 1.65.0 (ISC)\n\nISC License\n\nCopyright Cole Bemis\n';
const put=(root,path,body)=>{const dest=join(root,path);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,body)};
function fixture(fn){
 const dir=mkdtempSync(join(tmpdir(),'vanya-rights-'));
 try{
  put(dir,'package.json',JSON.stringify({dependencies:{'@vanya/brand':'github:VanDalkvist/vanya-arc-brand#'+pin}}));
  put(dir,'node_modules/@vanya/brand/package.json',JSON.stringify({license:'SEE LICENSE IN LICENSING.md'}));
  put(dir,'node_modules/@vanya/brand/LICENSES/LicenseRef-VanyaArc-Brand.txt',terms);
  put(dir,'dist/reference/brand-artwork-license.txt',terms);
  put(dir,'dist/licenses.txt',inventory);
  return fn(dir);
 }finally{rmSync(dir,{recursive:true,force:true})}
}
test('preserve notices and append exact pin terms once',()=>fixture(root=>{
 const r=finalizePublishedLicenses(root);
 assert.equal(r.status,'written');
 const out=readFileSync(join(root,'dist/licenses.txt'),'utf8');
 assert.ok(out.includes('## @vanya/brand - 0.1.0'));
 assert.ok(out.includes('ISC License'));
 assert.ok(out.includes('Cole Bemis'));
 assert.ok(out.includes(pin));
 assert.ok(out.includes(terms));
 assert.ok(out.includes('NOT licensed under MIT'));
 assert.equal(finalizePublishedLicenses(root).status,'verified');
 assert.equal(readFileSync(join(root,'dist/licenses.txt'),'utf8'),out);
}));
test('reject stale published notice',()=>fixture(root=>{
 put(root,'dist/reference/brand-artwork-license.txt','outdated');
 assert.throws(()=>finalizePublishedLicenses(root),/stale/);
}));
test('reject missing Feather license or floating dependency',()=>fixture(root=>{
 put(root,'dist/licenses.txt',inventory.replace('Cole Bemis',''));
 assert.throws(()=>finalizePublishedLicenses(root),/Lucide/);
 put(root,'dist/licenses.txt',inventory);
 put(root,'package.json',JSON.stringify({dependencies:{'@vanya/brand':'github:VanDalkvist/vanya-arc-brand#main'}}));
 assert.throws(()=>finalizePublishedLicenses(root),/pinned/);
}));
