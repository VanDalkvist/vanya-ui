// Evidence validation for the existing native Playwright comparison report.
// A matched receipt has only a verified reference; a different receipt requires
// the actual PNG emitted by Playwright inside this run's evidence directory.
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { join, basename, relative, isAbsolute, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { visualContexts } from './visual-baseline.mjs';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const signature = Buffer.from([137,80,78,71,13,10,26,10]);
function inDirectory(root,path){
 const rel=relative(realpathSync(root),realpathSync(path));
 return rel!==''&&!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep);
}
export function collectVisualEvidence({report,manifest,baseline,evidence,requested}){
 if(manifest.schema!==2)throw Error('Invalid visual baseline schema');
 const contexts=visualContexts.map(c=>({...c,key:c.theme+'-'+c.width}));
 if(requested&&(!requested.length||new Set(requested).size!==requested.length||requested.some(key=>!contexts.some(c=>c.key===key))))throw Error('Invalid explicit review contexts');
 const selected=contexts.filter(c=>!requested||requested.includes(c.key));
 const expectedKeys=new Set(selected.flatMap(({key,scenes})=>scenes.map(scene=>scene+'-'+key)));
 const results=[];
 function walk(suite){
  for(const spec of suite.specs??[])for(const test of spec.tests??[])results.push(...test.results);
  for(const child of suite.suites??[])walk(child);
 }
 for(const suite of report.suites)walk(suite);
 const receipts=new Map(),actuals=new Map();
 for(const result of results){
  const stdout=(result.stdout??[]).map(x=>x.text??'').join('');
  for(const line of stdout.split('\n')){
   if(!line.startsWith('VISUAL_SCENE '))continue;
   const r=JSON.parse(line.slice('VISUAL_SCENE '.length));
   if(r.mode!=='compare')throw Error('Unexpected visual receipt mode');
   const key=r.scene+'-'+r.theme+'-'+r.width;
   if(!expectedKeys.has(key))throw Error('Unexpected comparison scope '+key);
   if(!['matched','different'].includes(r.status))throw Error('Invalid visual status '+key);
   if(receipts.has(key))throw Error('Duplicate visual scene '+key);
   receipts.set(key,r.status);
  }
  for(const a of result.attachments??[]){
   if(!a.path)continue;
   const file=basename(a.path);
   if(!file.endsWith('-actual.png'))continue;
   const key=file.slice(0,-11);
   if(actuals.has(key))throw Error('Duplicate candidate attachment '+key);
   if(!expectedKeys.has(key))throw Error('Unexpected candidate attachment '+key);
   actuals.set(key,a.path);
  }
 }
 const different=[];
 for(const key of expectedKeys){
  const name=key+'.png',reference=join(baseline,name),status=receipts.get(key),actual=actuals.get(key);
  if(!status||!existsSync(reference)||!manifest.images?.[name])throw Error('Incomplete comparison evidence '+key);
  if(!inDirectory(baseline,reference)||digest(readFileSync(reference))!==manifest.images[name])throw Error('Baseline snapshot integrity failure '+key);
  if(status==='matched'){
   if(actual)throw Error('Unexpected candidate attachment '+key);
   continue;
  }
  different.push(key);
  if(!actual||!existsSync(actual))throw Error('Incomplete comparison evidence '+key);
  if(!inDirectory(evidence,actual))throw Error('Candidate outside evidence '+key);
  const bytes=readFileSync(actual);
  if(bytes.length<24||!bytes.subarray(0,8).equals(signature))throw Error('Invalid candidate PNG '+key);
 }
 return {selected,expectedKeys,receipts,actuals,different};
}
