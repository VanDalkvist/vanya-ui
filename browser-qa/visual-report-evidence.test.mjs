import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {collectVisualEvidence} from './visual-report-evidence.mjs';

const keys=['workspace-overview-light-1024','workspace-context-header-light-1024'];
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=','base64');
const sha=b=>createHash('sha256').update(b).digest('hex');
function fixture(fn){
 const root=mkdtempSync(join(tmpdir(),'visual-report-')),baseline=join(root,'baseline'),evidence=join(root,'evidence');
 mkdirSync(baseline);mkdirSync(evidence);
 try{
  const manifest={schema:2,images:Object.fromEntries(keys.map(key=>{writeFileSync(join(baseline,key+'.png'),png);return [key+'.png',sha(png)];}))};
  const receipts=keys.map((key,i)=>({scene:key.replace('-light-1024',''),theme:'light',width:1024,mode:'compare',status:i?'different':'matched'}));
  const actual=join(evidence,keys[1]+'-actual.png');writeFileSync(actual,png);
  const result={stdout:[],attachments:[{path:actual,contentType:'image/png'}]};
  const report={suites:[{specs:[{tests:[{results:[result]}]}]}]};
  const run=()=>{result.stdout=[{text:receipts.map(r=>'VISUAL_SCENE '+JSON.stringify(r)).join('\n')+'\n'}];return collectVisualEvidence({report,manifest,baseline,evidence,requested:['light-1024']});};
  fn({run,receipts,result,actual,baseline,evidence});
 }finally{rmSync(root,{recursive:true,force:true});}
}
test('native matched receipt exposes reference only; difference exposes real candidate',()=>fixture(({run,actual})=>{
 const r=run();assert.equal(r.expectedKeys.size,2);
 assert.equal(r.receipts.get(keys[0]),'matched');
 assert.equal(r.actuals.has(keys[0]),false);
 assert.equal(r.actuals.get(keys[1]),actual);
 assert.deepEqual(r.different,[keys[1]]);
}));
test('reject duplicate or unknown scene status and missing receipt',()=>fixture(({run,receipts})=>{
 const first=receipts[0];receipts.push(first);assert.throws(run,/Duplicate visual scene/);receipts.pop();
 first.status='unknown';assert.throws(run,/Invalid visual status/);first.status='matched';
 receipts.pop();assert.throws(run,/Incomplete comparison evidence/);
}));
test('reject changed baseline and missing, duplicate or escaped candidate attachment',()=>fixture(({run,result,actual,baseline})=>{
 const b=join(baseline,keys[0]+'.png');writeFileSync(b,'bad');assert.throws(run,/Baseline snapshot integrity/);writeFileSync(b,png);
 const original=result.attachments[0];result.attachments=[];assert.throws(run,/Incomplete comparison evidence/);
 result.attachments=[original,original];assert.throws(run,/Duplicate candidate attachment/);
 result.attachments=[{path:join(baseline,keys[1]+'-actual.png'),contentType:'image/png'}];writeFileSync(result.attachments[0].path,png);assert.throws(run,/outside evidence/);
 result.attachments=[original];rmSync(actual);assert.throws(run,/Incomplete comparison evidence/);
}));
test('reject an attachment claiming a matched scene and a non-PNG candidate',()=>fixture(({run,result,evidence,actual})=>{
 const path=join(evidence,keys[0]+'-actual.png');writeFileSync(path,png);
 result.attachments.push({path,contentType:'image/png'});assert.throws(run,/Unexpected candidate attachment/);result.attachments.pop();
 writeFileSync(actual,'not a PNG');assert.throws(run,/Invalid candidate PNG/);
}));
